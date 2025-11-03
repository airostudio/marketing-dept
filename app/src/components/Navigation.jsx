import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🤖 AI Marketing Dept
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/casey"
            className={`nav-link ${isActive('/casey') ? 'active' : ''}`}
          >
            📝 Casey
          </Link>
          <Link
            to="/stats"
            className={`nav-link ${isActive('/stats') ? 'active' : ''}`}
          >
            📊 Stats
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
