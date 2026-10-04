import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import AuthCallbackPage from './pages/home/AuthCallbackPage';
import HomePage from './pages/home/HomePage';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={'/auth-callback'}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
