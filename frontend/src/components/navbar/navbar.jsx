import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext.jsx'; // Verified path
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <section id="nav-bar">
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo-div">
            <Link to="/"><span>Gebeta</span></Link>
          </div>

          <div className={`menu-div ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={`menu-list ${isActive('/')}`}>Home</Link>
            <Link to="/reviews" className={`menu-list ${isActive('/reviews')}`}>Reviews</Link>
            
            {/*  Only show Delivery if logged in */}
            {user && (
              <Link to="/delivery" className={`menu-list ${isActive('/delivery')}`}>Delivery</Link>
            )}
            
            <Link to="/about" className={`menu-list ${isActive('/about')}`}>About</Link>

            {/*  DYNAMIC AUTH SECTION */}
            {user ? (
              <>
                <Link to="/profile" className={`menu-list ${isActive('/profile')}`}>
                  {'My Profile'}
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className={`menu-list ${isActive('/login')}`}>
                Login
              </Link>
            )}
          </div>

          <div className="hamburger-container">
            <button 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="hamburger-top"></span>
              <span className="hamburger-middle"></span>
              <span className="hamburger-bottom"></span>
            </button>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;