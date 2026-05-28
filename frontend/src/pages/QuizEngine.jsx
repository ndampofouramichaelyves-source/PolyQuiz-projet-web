import { useReducer, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        questions: action.payload,
        currentIndex: 0,
        score: 0,
        timeLeft: 60,            // initialisation du timer
        status: 'active',
      };
    case 'ANSWER_QUESTION': {
      if (state.status !== 'active') return state;
      const currentQ = state.questions[state.currentIndex];
      const isCorrect = currentQ.bonne_reponse === action.payload;
      const newScore = state.score + (isCorrect ? 1 : 0);
      const newIndex = state.currentIndex + 1;
      const isFinished = newIndex >= state.questions.length;
      return {
        ...state,
        score: newScore,
        currentIndex: newIndex,
        status: isFinished ? 'finished' : state.status,
      };
    }
    case 'DECREMENT_TIMER': {
      if (state.status !== 'active') return state;
      const newTimeLeft = state.timeLeft - 1;
      if (newTimeLeft <= 0) {
        return { ...state, timeLeft: 0, status: 'finished' };
      }
      return { ...state, timeLeft: newTimeLeft };
    }
    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' };
    default:
      return state;
  }
};

const initialState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  timeLeft: 60,
  status: 'idle',
};

export const QuizEngine = () => {
  const { data: questions, loading, error } = useFetch('/questions.json');
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const hasRedirected = useRef(false);
  const [selectedAnswer, setSelectedAnswer] = useReducer((_, val) => val, null);
  const [answerFeedback, setAnswerFeedback] = useReducer((_, val) => val, null);

  // Démarrage du quiz quand les données sont chargées
  useEffect(() => {
    if (questions && questions.length > 0 && state.status === 'idle') {
      dispatch({ type: 'START_QUIZ', payload: questions });
      hasRedirected.current = false;
      setSelectedAnswer(null);
      setAnswerFeedback(null);
    }
  }, [questions, state.status]);

  // Gestion du timer (décrémentation chaque seconde)
  useEffect(() => {
    if (state.status !== 'active') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      dispatch({ type: 'DECREMENT_TIMER' });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.status]);

  // Redirection quand le quiz est terminé
  useEffect(() => {
    if (state.status === 'finished' && !hasRedirected.current) {
      hasRedirected.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      navigate('/resultats', {
        state: {
          finalScore: state.score,
          totalQuestions: state.questions.length,
        },
        replace: true,
      });
    }
  }, [state.status, state.score, state.questions.length, navigate]);

  const handleAnswer = (answer) => {
    if (state.status !== 'active') return;
    const currentQ = state.questions[state.currentIndex];
    const isCorrect = currentQ.bonne_reponse === answer;
    setSelectedAnswer(answer);
    setAnswerFeedback(isCorrect ? '✅ Bonne réponse !' : '❌ Mauvaise réponse');
    setTimeout(() => {
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      dispatch({ type: 'ANSWER_QUESTION', payload: answer });
    }, 600);
  };

  if (loading) return <LoadingMessage message="Chargement des questions..." />;
  if (error) return <ErrorMessage error={error} />;
  if (!questions || state.status === 'idle') return <LoadingMessage message="Préparation du quiz..." />;
  if (state.status === 'finished') return <LoadingMessage message="Quiz terminé, redirection..." />;

  const current = state.questions[state.currentIndex];
  const progressPercent = ((state.currentIndex + 1) / state.questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.glassCard}>
        <div style={styles.header}>
          <div style={styles.scoreBadge}>🏆 Score : {state.score}</div>
          <div style={styles.timerBadge(state.timeLeft)}>⏱️ {state.timeLeft}s</div>
          <div style={styles.questionCounter}>
            📋 {state.currentIndex + 1} / {state.questions.length}
          </div>
        </div>

        <div style={styles.progressBarContainer}>
          <div style={{ ...styles.progressBar, width: `${progressPercent}%` }} />
        </div>

        <h2 style={styles.question}>{current.libellé}</h2>

        <div style={styles.optionsGrid}>
          {current.options.map((opt, idx) => {
            let buttonStyle = { ...styles.optionButton };
            if (selectedAnswer === opt) {
              const isCorrect = current.bonne_reponse === opt;
              buttonStyle = {
                ...buttonStyle,
                background: isCorrect
                  ? 'linear-gradient(135deg, #00b09b, #96c93d)'
                  : 'linear-gradient(135deg, #ff4b2b, #ff416c)',
                transform: 'scale(0.98)',
              };
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={state.status !== 'active' || selectedAnswer !== null}
                style={buttonStyle}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answerFeedback && <div style={styles.feedback}>{answerFeedback}</div>}

        <div style={styles.category}>📚 Catégorie : {current.catégorie}</div>
      </div>
    </div>
  );
};

// Composants auxiliaires identiques (inchangés)
const LoadingMessage = ({ message }) => (
  <div style={styles.centeredContainer}>
    <div style={styles.loadingCard}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>{message}</p>
    </div>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div style={styles.centeredContainer}>
    <div style={styles.errorCard}>
      <span style={styles.errorIcon}>⚠️</span>
      <p style={styles.errorText}>Erreur : {error}</p>
    </div>
  </div>
);

// Styles (inchangés, identiques à la version précédente)
const styles = {
  container: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', 'Poppins', system-ui, sans-serif",
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 20% 30%, #1e3c72, #2b3b4e, #0f2027)',
    zIndex: -2,
  },
  glassCard: {
    maxWidth: '750px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(16px)',
    borderRadius: '48px',
    padding: '30px 25px 35px 25px',
    boxShadow: '0 25px 45px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.15)',
    transition: 'all 0.3s ease',
    animation: 'fadeSlideUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  scoreBadge: {
    background: 'rgba(0,0,0,0.5)',
    padding: '8px 16px',
    borderRadius: '40px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#FFD966',
    backdropFilter: 'blur(4px)',
  },
  timerBadge: (timeLeft) => ({
    background: timeLeft <= 10 ? 'rgba(220, 53, 69, 0.8)' : 'rgba(0,0,0,0.5)',
    padding: '8px 16px',
    borderRadius: '40px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    transition: 'background 0.2s',
  }),
  questionCounter: {
    background: 'rgba(0,0,0,0.5)',
    padding: '8px 16px',
    borderRadius: '40px',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    marginBottom: '30px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  question: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: 'white',
    marginBottom: '30px',
    textAlign: 'center',
    textShadow: '0 2px 5px rgba(0,0,0,0.3)',
    lineHeight: 1.3,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  optionButton: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '60px',
    padding: '14px 10px',
    fontSize: '1rem',
    fontWeight: '500',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)',
    textAlign: 'center',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.3)',
      transform: 'scale(1.02)',
    },
  },
  feedback: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '12px',
    borderRadius: '40px',
    background: 'rgba(0,0,0,0.6)',
    color: '#FFD966',
    marginBottom: '20px',
    fontWeight: 'bold',
    animation: 'pulse 0.5s',
  },
  category: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.7)',
    borderTop: '1px solid rgba(255,255,255,0.2)',
    paddingTop: '20px',
    marginTop: '10px',
  },
  centeredContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(145deg, #0f2027, #203a43, #2c5364)',
  },
  loadingCard: {
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: '32px',
    padding: '40px',
    textAlign: 'center',
    color: 'white',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#FFD700',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: {
    fontSize: '1.2rem',
  },
  errorCard: {
    background: 'rgba(220,53,69,0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: '28px',
    padding: '30px',
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorIcon: {
    fontSize: '3rem',
    display: 'block',
  },
  errorText: {
    color: 'white',
    fontSize: '1.2rem',
    marginTop: '10px',
  },
};

// Injection des animations (une seule fois)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeSlideUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.02); opacity: 1; }
      100% { transform: scale(1); opacity: 0.7; }
    }
  `;
  if (!document.querySelector('#quiz-animations')) {
    styleSheet.id = 'quiz-animations';
    document.head.appendChild(styleSheet);
  }
}