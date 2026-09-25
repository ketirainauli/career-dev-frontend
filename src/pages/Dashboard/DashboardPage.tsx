import { useAuth } from '../../app/AuthContext';
import { Button } from '../../shared/ui/Button';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Welcome{user ? `, ${user.name}` : ''}</h1>
      <p>You are logged in.</p>
      <Button onClick={logout}>Log out</Button>
    </main>
  );
}