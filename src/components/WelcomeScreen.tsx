import type { User } from '../api/auth';

interface WelcomeScreenProps {
  user: User;
  onLogout: () => void;
}

export default function WelcomeScreen({ user, onLogout }: WelcomeScreenProps) {
  return (
    <section className="login-card welcome" aria-labelledby="welcome-heading">
      <h2 id="welcome-heading" className="login-card__title welcome__title">
        Welcome, {user.name}
      </h2>
      <p className="welcome__email">{user.email}</p>
      <button type="button" className="btn btn--secondary" onClick={onLogout}>
        Log out
      </button>
    </section>
  );
}