import React from 'react';
import Weather from '../reusable-components/Weather';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        {/* Display the small weather widget for Belgrade */}
        <Weather latitude={44.7866} longitude={20.4489} />
      </div>
      <div className="footer-right">
        <p>
          Having problems? Contact our support:&nbsp;
          <a href="mailto:hrDashboard@support.rs" className="footer-email">
            hrDashboard@support.rs
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
