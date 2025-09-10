import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FilterSection from './FilterSection';
import DashboardSummary from './DashboardSummary';
import CommunicationFilter from './CommunicationFilter';
import useDashboardData from './js/useDashboardData';
import './css/stycs.css';

function Details() {
  const { id } = useParams();
  const [showCommunication, setShowCommunication] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    exceptionId: ''
  });
  const [commFilters, setCommFilters] = useState({
    fromDate: '',
    toDate: '',
    content: '',
    attachmentTitle: ''
  });

  // Memoize context to prevent unnecessary re-renders
  const context = useMemo(() => ({ exceptionId: id }), [id]);

  const { summary, filteredData, filteredEmails } = useDashboardData(filters, context);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCommFilter = (newFilters) => {
    setCommFilters(newFilters);
  };

  // If data is still loading, show a loading message
  if (!filteredData) {
    return <div style={{fontSize: '10px'}}>Loading data...</div>;
  }

  return (
    <div className="exception-details compact">
      <FilterSection onFilter={handleFilter} initialFilters={filters} />
      <DashboardSummary 
        summary={summary} 
        onToggleSection={() => {}} // No toggle needed for details
        openSections={{}} // No sections to toggle
      />
      <h3 className="mb-2" style={{fontSize: '11px', fontWeight: 'bold'}}>Exception Details - {filteredData.name}</h3>
      
      {/* Summary Table */}
      <div className="table-responsive mb-3">
        <table className="table table-sm table-bordered compact-table">
          <thead>
            <tr>
              <th style={{fontSize: '10px'}}>Exception</th>
              <th style={{fontSize: '10px'}}>Under Process</th>
              <th style={{fontSize: '10px'}}>Closed by Auditee</th>
              <th style={{fontSize: '10px'}}>Closed by Auditor</th>
              <th style={{fontSize: '10px'}}>View Exception</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{fontSize: '10px'}}>{filteredData.name}</td>
              <td style={{fontSize: '10px'}}>{filteredData.underProcess}</td>
              <td style={{fontSize: '10px'}}>{filteredData.closedByAuditee}</td>
              <td style={{fontSize: '10px'}}>{filteredData.closedByAuditor}</td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  style={{fontSize: '9px'}}
                  onClick={() => setShowCommunication(!showCommunication)}
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Exception Details Table */}
      <div className="mb-3">
        <h4 className="section-title" style={{fontSize: '11px', fontWeight: 'bold'}}>📋 Exception Details</h4>
        <div className="table-responsive">
          <table className="table table-sm table-bordered compact-table">
            <thead>
              <tr>
                <th style={{fontSize: '10px'}}>S#</th>
                <th style={{fontSize: '10px'}}>Exception ID</th>
                <th style={{fontSize: '10px'}}>Assigned by Auditor</th>
                <th style={{fontSize: '10px'}}>Assigned Date & Time</th>
                <th style={{fontSize: '10px'}}>Assigned To</th>
                <th style={{fontSize: '10px'}}>Department</th>
                <th style={{fontSize: '10px'}}>Division</th>
                <th style={{fontSize: '10px'}}>Assigned Handled By</th>
                <th style={{fontSize: '10px'}}>Assignment Accepted Date</th>
                <th style={{fontSize: '10px'}}>Current Status</th>
                <th style={{fontSize: '10px'}}>Last Updated Date & Time</th>
                <th style={{fontSize: '10px'}}>Communication</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{fontSize: '10px'}}>{filteredData.details?.Sno || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.ExceptionID || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.AssignedBy || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.AssignedDateTime || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.AssignedTo || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.Department || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.Division || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.AssignedHandledBy || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.AssignmentAcceptedDate || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.CurrentStatus || ''}</td>
                <td style={{fontSize: '10px'}}>{filteredData.details?.LastUpdatedDate || ''}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    style={{fontSize: '9px'}}
                    onClick={() => setShowCommunication(!showCommunication)}
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Communication History Section */}
      {showCommunication && (
        <div className="communication-section">
          <CommunicationFilter onFilter={handleCommFilter} initialFilters={commFilters} />
          <h4 className="section-title" style={{fontSize: '11px', fontWeight: 'bold'}}>Communication History</h4>
          <div className="table-responsive">
            <table className="table table-sm table-bordered compact-table">
              <thead>
                <tr>
                  <th style={{fontSize: '10px'}}>Message From</th>
                  <th style={{fontSize: '10px'}}>Date & Time</th>
                  <th style={{fontSize: '10px'}}>Message To</th>
                  <th style={{fontSize: '10px'}}>CC Recipients</th>
                  <th style={{fontSize: '10px'}}>View Message</th>
                  <th style={{fontSize: '10px'}}>Attachments</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails && filteredEmails.length > 0 ? (
                  filteredEmails.map((email, index) => (
                    <tr key={index}>
                      <td style={{fontSize: '10px'}}>{email.from}</td>
                      <td style={{fontSize: '10px'}}>{email.dateTime}</td>
                      <td style={{fontSize: '10px'}}>{email.to}</td>
                      <td style={{fontSize: '10px'}}>{email.cc?.join(', ') || ''}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary" style={{fontSize: '9px'}}>
                          View
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-secondary" style={{fontSize: '9px'}}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{fontSize: '10px', textAlign: 'center'}}>No communications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Details;