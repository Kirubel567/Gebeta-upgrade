import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './Footer.css';

import { useAuth } from '../../contexts/authContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-col">
          <span className="script-font text-green logo-large">Gebeta</span>
          <p className="small-text" style={{ marginTop: '10px' }}>
            Campus Food Discovery Platform for AAU Students
          </p>
        </div>

        <div className="footer-col">
          <h4>Gebeta</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/delivery">Delivery</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get Involved</h4>
          <p className="small-text">
            Submit Your Details And Get Featured On Our Platform.
          </p>
          <Link to={user ? "/about#business-sec" : "/login"}>
            <Button variant="primary" className="script-font">
              Submit Application
            </Button>
          </Link>
        </div>

        <div className="footer-col social-col">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-telegram"></i>
            </a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p className="small-text" style={{ marginBottom: '5px' }}>
              <i className="fa-solid fa-envelope"></i> contact@gebeta.com
            </p>
            <p className="small-text">
              <i className="fa-solid fa-phone"></i> +251 911 234 567
            </p>
          </div>
        </div>
      </div>

      <div className="copyright">
        <p>
          &copy; {currentYear} <span className="script-font text-green">Gebeta</span> — Built by Students, for Students.
        </p>
        <p className="small-text" style={{ marginTop: '5px', fontSize: '0.7rem' }}>
          Addis Ababa University | 4K, 5K, 6K Campuses
        </p>
      </div>
    </footer>
  );
};
export default Footer;