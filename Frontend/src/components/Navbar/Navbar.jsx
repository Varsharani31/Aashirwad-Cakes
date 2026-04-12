// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/frontend_assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

// eslint-disable-next-line react/prop-types
const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const [info, setInfo] = useState(false);
  const [user, setUser] = useState(null); // store logged-in user

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleClick = () => {
    setInfo(!info); // toggle dropdown
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    navigate("/");
  };

  // ✅ Load user details whenever token changes or component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  // ✅ Hide dropdown when clicking outside or scrolling
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setInfo(false);
      }
    };
    const handleScroll = () => setInfo(false);

    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="Logo" /></Link>

      <ul className='navbar-menu'>
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='/#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="Cart" /></Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <button className='btn' onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div ref={profileRef} onClick={handleClick} className={`navbar-profile ${info ? 'profile-active' : ''}`}>
            <img src={assets.profile_icon} alt="Profile" />
            {info && (
              <ul className="nav-profile-dropdown">
                {user && (
                  <>
                    <li className="user-details">
                      <p><strong>{user.name || "User"}</strong></p>
                      <p className="user-email">{user.email || "user@example.com"}</p>
                    </li>
                    <hr />
                  </>
                )}
                <li onClick={() => navigate('/myorders')}>
                  <img src={assets.bag_icon} alt="" /><p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" /><p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
