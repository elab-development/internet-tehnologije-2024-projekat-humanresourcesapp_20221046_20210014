import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaArrowLeft, FaHome, FaPowerOff } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import logo from '../images/logo.png'; // Adjust as needed

const NavMenu = () => {
  const location = useLocation();

  // Retrieve user data from sessionStorage
  const userDataStr = sessionStorage.getItem('userData');
  const userData = userDataStr ? JSON.parse(userDataStr) : {};

  // Get the first letter for the avatar
  const avatarLetter = userData.name ? userData.name.charAt(0).toUpperCase() : '';

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');

    window.location.href = '/'
  };

  return (
    <div className="navmenu-container">
      <div className="navmenu-left">
        {(location.pathname !== '/landing' && location.pathname !== '/landing-worker') && (
          <div className="navmenu-left-icons">
            <FaArrowLeft className="nav-icon" onClick={() => window.history.go(-1)} />
            <FaHome className="nav-icon" onClick={() =>  {userData.role === 'HR Worker' ? window.location.href = '/landing' : window.location.href = '/landing-worker'}} />
          </div>
        )}
      </div>
      <div className="navmenu-center">
        <img src={logo} alt="Logo" className="navmenu-logo" />
      </div>
      <div className="navmenu-right">
        <div className="user-info">
          <div className="avatar">{avatarLetter}</div>
          <div className="user-details">
            <span className="user-name">{userData.name}</span>
            <span className="user-position">{userData.position}</span>
          </div>
        </div>

        {/* Logout Icon with a unique ID so react-tooltip can anchor */}
        <FaPowerOff
          className="logout-icon"
          style={{margin:"30px"}}
          onClick={handleLogout}
          id="logoutIcon" // anchorId for the tooltip
        />

        {/* Anchor-based Tooltip configuration */}
        <Tooltip
            anchorId="logoutIcon"
            content="Logout"
            place="bottom"
            float={false}
            autoPlace={false}
            positionStrategy="fixed"
            appendTo="body"
            style={{ zIndex: 9999 }}
        />
      </div>
    </div>
  );
};

export default NavMenu;
