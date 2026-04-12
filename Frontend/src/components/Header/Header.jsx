// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleExploreMenu = () => {
    navigate('/exploremenu'); // navigate to Explore Menu page
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2 className='header-heading'>
          Order your favorite cake at Aashirwad Cakes and make every moment special!
        </h2>
        <p className='head-para'>
          Celebrate life’s sweetest moments with a delicious cake that adds joy to every occasion. Big or small, a cake makes happiness even more special—treat yourself or a loved one today!
        </p>
       
      </div>
    </div>
  );
};

export default Header;
