import { Link } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useCart } from '../lib/useCart';
import './Header.css';

export function Header() {
  const { status, user, logout } = useAuth();
  const { totalQty } = useCart();

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