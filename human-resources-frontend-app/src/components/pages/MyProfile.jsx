import React from 'react';

const MyProfile = () => {
  // Retrieve user data from session storage
  const userDataStr = sessionStorage.getItem('userData');
  const userData = userDataStr ? JSON.parse(userDataStr) : {};

  return (
    <div className="profile-container">
      <div className="profile-card modern-card">
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-details">
          <div className="profile-row">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{userData.name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{userData.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Role:</span>
            <span className="profile-value">{userData.role}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Gender:</span>
            <span className="profile-value">{userData.gender}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Date of Birth:</span>
            <span className="profile-value">{userData.date_of_birth}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Contract Start Date:</span>
            <span className="profile-value">{userData.contract_start_date}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Position:</span>
            <span className="profile-value">{userData.position}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
