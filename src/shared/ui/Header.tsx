import { Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useCart } from '../lib/useCart';
import { useTheme, type ThemeChoice } from '../lib/useTheme';
import './Header.css';

export function Header() {
  const { status, user, logout } = useAuth();
  const { totalQty } = useCart();
    const { choice, setChoice } = useTheme();

  return (
    <header className="site-header">
      <Link to="/catalog" className="site-header__logo">
        წიგნების მაღაზია
      </Link>

      <nav className="site-header__nav">
        <Link to="/catalog">კატალოგი</Link>

        <Link to="/cart" className="site-header__cart" aria-label={`კალათა, ${totalQty} პროდუქტი`}>
          კალათა
          {totalQty > 0 ? <span className="site-header__badge">{totalQty}</span> : null}
        </Link>
                <select
          className="site-header__theme"
          value={choice}
          aria-label="თემა"
          onChange={(e) => setChoice(e.target.value as ThemeChoice)}
        >
          <option value="light">☀️ ნათელი</option>
          <option value="dark">🌙 მუქი</option>
          <option value="system">💻 სისტემა</option>
        </select>

        {status === 'authenticated' ? (
          <>
            <Link to="/profile">{user?.name}</Link>
            <button type="button" className="site-header__logout" onClick={logout}>
              გასვლა
            </button>
          </>
        ) : (
          <Link to="/login">შესვლა</Link>
        )}
      </nav>
    </header>
  );
}