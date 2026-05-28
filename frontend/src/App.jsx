import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { QuizEngine } from './pages/QuizEngine';
import { Results } from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizEngine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resultats"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;