import React from 'react';
import './css/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <p className="copyright">
              {/* &copy; {currentYear} <strong>ADS Audit Workflow</strong>. All rights reserved. */}
            </p>
          </div>
          <div className="col-md-6 text-end">
            <p className="version" aria-label={`Application version 1.0.0`}>
              {/* Version <code>1.0.0</code> */}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;