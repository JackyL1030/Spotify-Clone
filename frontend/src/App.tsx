import { Route, Routes } from 'react-router-dom';
import AuthCallbackPage from './pages/home/AuthCallbackPage';
import HomePage from './pages/home/HomePage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
      </Routes>
    </>
  );
}

export default App;
