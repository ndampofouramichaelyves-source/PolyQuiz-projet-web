import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pseudonym, bestScore, updateBestScore } = useUser();
  const { finalScore, totalQuestions } = location.state || {};

  // Redirection si les données sont manquantes
  useEffect(() => {
    if (!finalScore || !totalQuestions) {
      navigate('/', { replace: true });
    }
  }, [finalScore, totalQuestions, navigate]);

  // Mise à jour du meilleur score
  useEffect(() => {
    if (finalScore !== undefined) updateBestScore(finalScore);
  }, [finalScore, updateBestScore]);

  // Calcul du pourcentage (useMemo pour optimisation)
  const ratio = useMemo(() => {
    if (!finalScore || !totalQuestions) return 0;
    const percentage = (finalScore / totalQuestions) * 100;
    return percentage.toFixed(1);
  }, [finalScore, totalQuestions]);

  // Déterminer le message et la couleur selon la performance
  const performance = useMemo(() => {
    const percent = parseFloat(ratio);
    if (percent >= 80) return { message: '🏆 Excellent !', color: '#FFD700' };
    if (percent >= 60) return { message: '👍 Très bien !', color: '#00c6ff' };
    if (percent >= 40) return { message: '📚 Peut mieux faire', color: '#FFA500' };
    return { message: '💪 Continue à t’entraîner', color: '#ff6b6b' };
  }, [ratio]);

  if (!finalScore || !totalQuestions) return null;

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.glassCard}>
        <h1 style={styles.title}>🏁 Résultats</h1>
        
        <div style={styles.userInfo}>
          <span style={styles.badge}>🎮 {pseudonym}</span>
          <span style={styles.badge}>🏅 Meilleur : {bestScore}/{totalQuestions}</span>
        </div>

        <div style={styles.scoreCircle}>
          <div style={styles.scoreInner}>
            <span style={styles.scoreNumber}>{finalScore}</span>
            <span style={styles.scoreTotal}>/{totalQuestions}</span>
          </div>
          <div style={styles.ratioBadge} style={{ background: performance.color }}>
            {ratio}%
          </div>
        </div>

        <div style={styles.messageBox} style={{ borderColor: performance.color }}>
          <p style={styles.performanceMessage}>{performance.message}</p>
        </div>

        <div style={styles.stats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Taux de réussite</span>
            <span style={styles.statValue}>{ratio}%</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Score de la partie</span>
            <span style={styles.statValue}>{finalScore}/{totalQuestions}</span>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/quiz')} style={styles.primaryButton}>
            🔄 Rejouer
          </button>
          <button onClick={() => navigate('/')} style={styles.secondaryButton}>
            🏠 Accueil
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles inline
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
    background: 'radial-gradient(circle at 70% 20%, #1f4037, #0f2027, #2c3e50)',
    zIndex: -2,
  },
  glassCard: {
    maxWidth: '550px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(16px)',
    borderRadius: '56px',
    padding: '35px 30px 45px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.15)',
    textAlign: 'center',
    animation: 'fadeSlideUp 0.6s ease-out',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '800',
    marginBottom: '25px',
    background: 'linear-gradient(135deg, #FFD966, #FF6B6B)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '35px',
  },
  badge: {
    background: 'rgba(0,0,0,0.5)',
    padding: '8px 20px',
    borderRadius: '40px',
    fontSize: '1rem',
    color: '#fff',
    backdropFilter: 'blur(4px)',
  },
  scoreCircle: {
    position: 'relative',
    width: '180px',
    height: '180px',
    margin: '0 auto 30px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 6px rgba(255,255,255,0.2), 0 10px 25px rgba(0,0,0,0.2)',
  },
  scoreInner: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '5px',
  },
  scoreNumber: {
    fontSize: '3.8rem',
    fontWeight: 'bold',
    color: '#FFD966',
  },
  scoreTotal: {
    fontSize: '1.5rem',
    color: 'rgba(255,255,255,0.7)',
  },
  ratioBadge: {
    position: 'absolute',
    bottom: '-12px',
    right: '-10px',
    background: '#FFD700',
    padding: '8px 16px',
    borderRadius: '40px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e2a3a',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  messageBox: {
    marginTop: '15px',
    marginBottom: '30px',
    padding: '12px',
    borderRadius: '60px',
    background: 'rgba(0,0,0,0.4)',
    borderLeft: '4px solid',
  },
  performanceMessage: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    marginBottom: '35px',
    flexWrap: 'wrap',
  },
  statItem: {
    background: 'rgba(0,0,0,0.4)',
    borderRadius: '28px',
    padding: '12px 20px',
    flex: 1,
    textAlign: 'center',
  },
  statLabel: {
    display: 'block',
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '6px',
  },
  statValue: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#FFD966',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'linear-gradient(95deg, #FFD700, #FF8C00)',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '60px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#1e2a3a',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
    ':hover': {
      transform: 'scale(1.03)',
      boxShadow: '0 8px 18px rgba(0,0,0,0.3)',
    },
  },
  secondaryButton: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '14px 28px',
    borderRadius: '60px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s, background 0.2s',
    backdropFilter: 'blur(4px)',
    ':hover': {
      background: 'rgba(255,255,255,0.3)',
      transform: 'scale(1.02)',
    },
  },
};

// Injection des animations (identique aux autres pages)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeSlideUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;
  if (!document.querySelector('#results-animations')) {
    styleSheet.id = 'results-animations';
    document.head.appendChild(styleSheet);
  }
}