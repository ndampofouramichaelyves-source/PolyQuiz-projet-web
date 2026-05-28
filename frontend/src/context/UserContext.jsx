import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [pseudonym, setPseudonymState] = useState(null);
  const [bestScore, setBestScore] = useState(0);

  const setPseudonym = (name) => {
    setPseudonymState(name);
    // On réinitialise le meilleur score quand on change de pseudo (optionnel)
    setBestScore(0);
  };

  const updateBestScore = (newScore) => {
    setBestScore(prev => Math.max(prev, newScore));
  };

  return (
    <UserContext.Provider value={{ pseudonym, bestScore, setPseudonym, updateBestScore }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};