import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const Home = () => {
  const { setPseudonym } = useUser();
  const [pseudo, setPseudo] = useState('');
  const navigate = useNavigate();

  // États pour les animations
  const [angle, setAngle] = useState(0);
  const [cardOpacity, setCardOpacity] = useState(0);
  const [buttonHover, setButtonHover] = useState(false);

  // Animation du dégradé en arrière-plan (rotation continue)
  useEffect(() => {
    let frameId;
    const animate = () => {
      setAngle((prev) => (prev + 0.5) % 360);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Animation d'apparition de la carte
  useEffect(() => {
    const timer = setTimeout(() => setCardOpacity(1), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pseudo.trim() === '') return;
    setPseudonym(pseudo.trim());
    navigate('/quiz');
  };

  // Styles inline
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(${angle}deg, #4f46e5, #7e22ce, #ec4899)`,
    transition: 'background 0.05s linear',
    zIndex: -2,
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
    zIndex: -1,
  };

  const cardStyle = {
    maxWidth: '450px',
    width: '90%',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '32px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
    textAlign: 'center',
    transition: 'opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.3s ease',
    opacity: cardOpacity,
    transform: cardOpacity === 1 ? 'translateY(0)' : 'translateY(30px)',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #FFD700, #FF69B4)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
  };

  const subtitleStyle = {
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    letterSpacing: '1px',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    fontSize: '1rem',
    borderRadius: '60px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#FFD700',
    background: 'rgba(255,255,255,0.3)',
    boxShadow: '0 0 12px rgba(255,215,0,0.4)',
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '60px',
    background: buttonHover
      ? 'linear-gradient(95deg, #FFB347, #FF6B6B)'
      : 'linear-gradient(95deg, #FFD700, #FF1493)',
    color: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: buttonHover ? 'scale(1.02)' : 'scale(1)',
    boxShadow: buttonHover ? '0 8px 20px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.2)',
  };

  const footerStyle = {
    marginTop: '1.5rem',
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.5)',
  };

  return (
    <div>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}></div>
      <div style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>🏁 PolyQuiz</h1>
          <p style={subtitleStyle}>Testez vos connaissances !</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Entrez votre pseudonyme"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                Object.assign(e.target.style, inputFocusStyle);
              }}
              onBlur={(e) => {
                Object.assign(e.target.style, inputStyle);
              }}
            />
            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
            >
              Commencer
            </button>
          </form>
          <p style={footerStyle}>Un pseudonyme, et c'est parti !</p>
        </div>
      </div>
    </div>
  );
};