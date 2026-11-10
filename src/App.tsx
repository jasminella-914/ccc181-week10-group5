import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import BrandPanel from './components/BrandPanel';
import LoginForm from './components/LoginForm';
import WelcomeScreen from './components/WelcomeScreen';
import Footer from './components/Footer';
import { ApiError, clearToken, getMe, getToken } from './api/auth';
import type { User } from './api/auth';

type Session =
  | { status: 'checking' }
  | { status: 'out' }
  | { status: 'in'; user: User };

export default function App() {
  // If a token is saved, we must ask the API before showing anything.
  const [session, setSession] = useState<Session>(() =>
    getToken() ? { status: 'checking' } : { status: 'out' },
  );

  // Stay logged in on refresh: 200 shows Welcome, 401 deletes the token.
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let cancelled = false;
    getMe(token)
      .then((user) => {
        if (!cancelled) setSession({ status: 'in', user });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.kind === 'unauthorized') {
          clearToken();
        }
        setSession({ status: 'out' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Log out needs no API call because the API is stateless.
  function handleLogout() {
    clearToken();
    setSession({ status: 'out' });
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <div className="login-layout">
          <BrandPanel />
          {session.status === 'checking' && (
            <section className="login-card" aria-live="polite">
              <p className="welcome__email">Checking your session...</p>
            </section>
          )}
          {session.status === 'out' && (
            <LoginForm
              onLoggedIn={(user) => setSession({ status: 'in', user })}
            />
          )}
          {session.status === 'in' && (
            <WelcomeScreen user={session.user} onLogout={handleLogout} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}