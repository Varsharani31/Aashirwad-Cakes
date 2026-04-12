// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/frontend_assets/assets';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0); // Scrolls to the top of the page
  };

  return (
    <footer className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Fresh Bake Logo" />
          <div className='box-paragraph'>
               Aashirwad Cakes offers fresh, homemade delights made with love and the finest ingredients. Perfect for every special occasion, our cakes are ready for you to pick up from our shop, ensuring freshness and joy in every bite.          </div>
          <br />
          <div className="footer-social-icons">
           <a href="https://www.youtube.com/channel/UCESBgLOJVnCBNbvA_Xd9OkA" target="_blank" rel="noopener noreferrer">
                <img src={assets.youtube_icon} alt="YouTube" />
            </a>
             <a href="https://www.instagram.com/aashirwad_cakes/" target="_blank" rel="noopener noreferrer">
              <img src={assets.instagram_icon} alt="Instagram" />
            </a>
          </div>
        </div>
        <nav className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>
              <Link to="/" onClick={scrollToTop}>Home</Link>
            </li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/myorders">Delivery</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </nav>
        <div className="footer-content-right">
          <h2>Get in Touch</h2>
          <ul>
             <li>Janhavi Khot : <a href="tel:7887432015">+91 78874 32015</a></li>
            

          </ul>
        </div>
      </div>
      <hr />
      <p className='footer-copyright'>Copyright 2025 &copy; AashirwadCakes.com - All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
