import React from 'react';

function DashboardSummary({ summary, onToggleSection, openSections }) {
  return (
    <div className="row g-2 mb-3">
      {/* Exception Assigned Card */}
      <div className="col-xl-3 col-md-6">
        <div className="card summary-card border-0 shadow-sm h-100 compact-card">
          <div className="card-body d-flex flex-column p-2">
            <div className="d-flex align-items-center mb-1">
              <div className="summary-icon bg-primary bg-opacity-10 text-primary rounded-circle p-1 me-1">
                <i className="bi bi-clipboard-check" style={{fontSize: '0.9rem'}}></i>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div>
                  <h6 className="text-muted mb-0" style={{fontSize: '10px'}}>Exception Assigned</h6>
                  <h3 className="mb-0 fw-bold text-primary" style={{fontSize: '14px'}}>{summary.assigned}</h3>
                </div>
                <button className="btn btn-outline-primary mt-1 btn-sm" style={{fontSize: '9px'}} onClick={() => onToggleSection('level2')}>
                  <i className={`bi ${openSections['level2'] ? 'bi-eye-slash' : 'bi-eye'}`} style={{fontSize: '9px'}}></i> 
                  {openSections['level2'] ? 'Hide' : 'View'}
                </button>
              </div>
            </div>
            <div className="mt-auto">
              <div className="progress" style={{ height: '3px' }}>
                <div className="progress-bar bg-primary" role="progressbar" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Under Process Card */}
      <div className="col-xl-3 col-md-6">
        <div className="card summary-card border-0 shadow-sm h-100 compact-card">
          <div className="card-body d-flex flex-column p-2">
            <div className="d-flex align-items-center mb-1">
              <div className="summary-icon bg-warning bg-opacity-10 text-warning rounded-circle p-1 me-1">
                <i className="bi bi-arrow-repeat" style={{fontSize: '0.9rem'}}></i>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div>
                  <h6 className="text-muted mb-0" style={{fontSize: '10px'}}>Under Process</h6>
                  <h3 className="mb-0 fw-bold text-warning" style={{fontSize: '14px'}}>{summary.underProcess}</h3>
                </div>
                <button className="btn btn-outline-warning mt-1 btn-sm" style={{fontSize: '9px'}} onClick={() => onToggleSection('underProcessSection')}>
                  <i className={`bi ${openSections['underProcessSection'] ? 'bi-eye-slash' : 'bi-eye'}`} style={{fontSize: '9px'}}></i> 
                  {openSections['underProcessSection'] ? 'Hide' : 'View'}
                </button>
              </div>
            </div>
            <div className="mt-auto">
              <div className="progress" style={{ height: '3px' }}>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Closed by Auditee Card */}
      <div className="col-xl-3 col-md-6">
        <div className="card summary-card border-0 shadow-sm h-100 compact-card">
          <div className="card-body d-flex flex-column p-2">
            <div className="d-flex align-items-center mb-1">
              <div className="summary-icon bg-info bg-opacity-10 text-info rounded-circle p-1 me-1">
                <i className="bi bi-check-circle" style={{fontSize: '0.9rem'}}></i>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div>
                  <h6 className="text-muted mb-0" style={{fontSize: '10px'}}>Closed by Auditee</h6>
                  <h3 className="mb-0 fw-bold text-info" style={{fontSize: '14px'}}>{summary.closedByAuditee}</h3>
                </div>
                <button className="btn btn-outline-info mt-1 btn-sm" style={{fontSize: '9px'}} onClick={() => onToggleSection('closedByAuditeeSection')}>
                  <i className={`bi ${openSections['closedByAuditeeSection'] ? 'bi-eye-slash' : 'bi-eye'}`} style={{fontSize: '9px'}}></i> 
                  {openSections['closedByAuditeeSection'] ? 'Hide' : 'View'}
                </button>
              </div>
            </div>
            <div className="mt-auto">
              <div className="progress" style={{ height: '3px' }}>
                <div className="progress-bar bg-info" role="progressbar" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Closed by Auditor Card */}
      <div className="col-xl-3 col-md-6">
        <div className="card summary-card border-0 shadow-sm h-100 compact-card">
          <div className="card-body d-flex flex-column p-2">
            <div className="d-flex align-items-center mb-1">
              <div className="summary-icon bg-success bg-opacity-10 text-success rounded-circle p-1 me-1">
                <i className="bi bi-shield-check" style={{fontSize: '0.9rem'}}></i>
              </div>
              <div className="d-flex justify-content-between w-100">
                <div>
                  <h6 className="text-muted mb-0" style={{fontSize: '10px'}}>Closed by Auditor</h6>
                  <h3 className="mb-0 fw-bold text-success" style={{fontSize: '14px'}}>{summary.closedByAuditor}</h3>
                </div>
                <button className="btn btn-outline-success mt-1 btn-sm" style={{fontSize: '9px'}} onClick={() => onToggleSection('closedByAuditorSection')}>
                  <i className={`bi ${openSections['closedByAuditorSection'] ? 'bi-eye-slash' : 'bi-eye'}`} style={{fontSize: '9px'}}></i> 
                  {openSections['closedByAuditorSection'] ? 'Hide' : 'View'}
                </button>
              </div>
            </div>
            <div className="mt-auto">
              <div className="progress" style={{ height: '3px' }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSummary;