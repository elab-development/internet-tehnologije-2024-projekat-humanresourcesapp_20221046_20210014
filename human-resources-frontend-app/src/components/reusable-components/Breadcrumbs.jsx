import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Do not show breadcrumbs on these paths
  if (pathname === '/landing' || pathname === '/landing-worker') {
    return null;
  }

  // Split and filter the path
  // link pre splita: "/payrolls"
  // link posle splita: [ "", "payrolls"]
  // Boolean --> logicki tip vrednosti tj. true ili false
  // Truthy values --> sve koje nisu falsey
  // False values --> "", false, null, undefined
  // nakon filtera: ["payrolls"]
  const pathParts = pathname.split('/').filter(Boolean);

  // Build breadcrumb links
  const breadcrumbs = pathParts.map((part, index) => {
    const to = '/' + pathParts.slice(0, index + 1).join('/');
    const name = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');

    return (
      <span key={to} className="breadcrumb-segment">
        <FaChevronRight className="breadcrumb-separator" />
        <Link to={to} className="breadcrumb-link">
          {name}
        </Link>
      </span>
    );
  });

  return (
    <nav className="breadcrumb-container">
      <Link to="/" className="breadcrumb-link root">Home</Link>
      {breadcrumbs}
    </nav>
  );
};

export default Breadcrumbs;
