import React from 'react';
import './css/home.css';

function Home() {
  return (
    <div className="container-fluid">
      <div className="welcome-card">
        <h1>Welcome to ADS Audit Workflow</h1>
        <p>Select an option from the menu to get started with your audit tasks.</p>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-speedometer2 text-primary" style={{fontSize: '2rem'}}></i>
              <h5 className="card-title mt-2">Dashboard</h5>
              <p className="card-text">View your audit metrics and performance indicators</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-exclamation-triangle text-warning" style={{fontSize: '2rem'}}></i>
              <h5 className="card-title mt-2">Exceptions</h5>
              <p className="card-text">Manage and track audit exceptions</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-journal-text text-info" style={{fontSize: '2rem'}}></i>
              <h5 className="card-title mt-2">Audit Notes</h5>
              <p className="card-text">Document your audit findings and observations</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-file-earmark-bar-graph text-success" style={{fontSize: '2rem'}}></i>
              <h5 className="card-title mt-2">Reports</h5>
              <p className="card-text">Generate and view audit reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;