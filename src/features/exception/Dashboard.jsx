import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import FilterSection from './FilterSection';
import DashboardSummary from './DashboardSummary';
import useDashboardData from './js/useDashboardData';
import './css/stycs.css';

function Dashboard() {
  const [openSections, setOpenSections] = useState({});
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    exceptionId: ''
  });

  // Memoize context to prevent unnecessary re-renders
  const context = useMemo(() => ({}), []);

  const { summary, filteredData } = useDashboardData(filters, context);

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  // If data is still loading, show a loading message
  if (!filteredData) {
    return <div style={{fontSize: '10px'}}>Loading data...</div>;
  }

  return (
    <div className="exception-dashboard compact">
      <FilterSection onFilter={handleFilter} initialFilters={filters} />
      <DashboardSummary 
        summary={summary} 
        onToggleSection={toggleSection}
        openSections={openSections}
      />
      
      {/* Level-2 Section */}
      {openSections['level2'] && (
        <div className="expandable mb-3">
          <h3 className="section-title" style={{fontSize: '11px', fontWeight: 'bold'}}>📌 Exception Assigned (Level-2)</h3>
          <div className="table-responsive">
            <table className="table table-sm table-bordered compact-table">
              <thead>
                <tr>
                  <th width="20%" style={{fontSize: '10px'}}>Level-2</th>
                  <th width="20%" style={{fontSize: '10px'}}>Under Process</th>
                  <th width="20%" style={{fontSize: '10px'}}>Closed by Auditee</th>
                  <th width="20%" style={{fontSize: '10px'}}>Closed by Auditor</th>
                  <th width="20%" style={{fontSize: '10px'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.departments && filteredData.departments.length > 0 ? (
                  filteredData.departments.map((dept, index) => (
                    <tr key={index}>
                      <td style={{fontSize: '10px'}}>{dept.name}</td>
                      <td style={{fontSize: '10px'}}>{dept.underProcess}</td>
                      <td style={{fontSize: '10px'}}>{dept.closedByAuditee}</td>
                      <td style={{fontSize: '10px'}}>{dept.closedByAuditor}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          style={{fontSize: '9px'}}
                          onClick={() => toggleSection(`level3-${index}`)}
                        >
                          <i className={`bi ${openSections[`level3-${index}`] ? 'bi-eye-slash' : 'bi-eye'}`} style={{fontSize: '9px'}}></i> 
                          {openSections[`level3-${index}`] ? 'Hide' : 'View'} Divisions
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{fontSize: '10px', textAlign: 'center'}}>No departments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Level-3 Divisions */}
          {filteredData.departments && filteredData.departments.map((dept, deptIndex) => (
            <div key={deptIndex}>
              {openSections[`level3-${deptIndex}`] && (
                <div className="expandable ms-2 mb-2">
                  <h4 className="section-title" style={{fontSize: '11px', fontWeight: 'bold'}}>📌 {dept.name} (Level-3)</h4>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered compact-table">
                      <thead>
                        <tr>
                          <th width="20%" style={{fontSize: '10px'}}>Level-3</th>
                          <th width="20%" style={{fontSize: '10px'}}>Under Process</th>
                          <th width="20%" style={{fontSize: '10px'}}>Closed by Auditee</th>
                          <th width="20%" style={{fontSize: '10px'}}>Closed by Auditor</th>
                          <th width="20%" style={{fontSize: '10px'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dept.divisions && dept.divisions.length > 0 ? (
                          dept.divisions.map((div, divIndex) => (
                            <tr key={divIndex}>
                              <td style={{fontSize: '10px'}}>{div.name}</td>
                              <td style={{fontSize: '10px'}}>{div.underProcess}</td>
                              <td style={{fontSize: '10px'}}>{div.closedByAuditee}</td>
                              <td style={{fontSize: '10px'}}>{div.closedByAuditor}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary" 
                                  style={{fontSize: '9px'}}
                                  onClick={() => toggleSection(`auditee-${deptIndex}-${divIndex}`)}
                                >
                                  <i className={`bi ${openSections[`auditee-${deptIndex}-${divIndex}`] ? 'bi-eye-slash' : 'bi-eye'}`} style={{fontSize: '9px'}}></i> 
                                  {openSections[`auditee-${deptIndex}-${divIndex}`] ? 'Hide' : 'View'} Auditees
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{fontSize: '10px', textAlign: 'center'}}>No divisions found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Auditee Level */}
              {dept.divisions && dept.divisions.map((div, divIndex) => (
                <div key={`${deptIndex}-${divIndex}`}>
                  {openSections[`auditee-${deptIndex}-${divIndex}`] && (
                    <div className="expandable ms-4 mb-2">
                      <h5 className="section-title" style={{fontSize: '11px', fontWeight: 'bold'}}>📌 {div.name} (Auditee)</h5>
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered compact-table">
                          <thead>
                            <tr>
                              <th width="20%" style={{fontSize: '10px'}}>Auditee</th>
                              <th width="20%" style={{fontSize: '10px'}}>Under Process</th>
                              <th width="20%" style={{fontSize: '10px'}}>Closed by Auditee</th>
                              <th width="20%" style={{fontSize: '10px'}}>Closed by Auditor</th>
                              <th width="20%" style={{fontSize: '10px'}}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {div.people && div.people.length > 0 ? (
                              div.people.map((person, personIndex) => (
                                <tr key={personIndex}>
                                  <td style={{fontSize: '10px'}}>{person.name}</td>
                                  <td style={{fontSize: '10px'}}>{person.underProcess}</td>
                                  <td style={{fontSize: '10px'}}>{person.closedByAuditee}</td>
                                  <td style={{fontSize: '10px'}}>{person.closedByAuditor}</td>
                                  <td>
                                    <Link 
                                      to={`/exception?auditee=${encodeURIComponent(person.name)}&division=${encodeURIComponent(div.name)}&department=${encodeURIComponent(dept.name)}`}
                                      className="btn btn-sm btn-outline-primary"
                                      style={{fontSize: '9px'}}
                                    >
                                      View Exception
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" style={{fontSize: '10px', textAlign: 'center'}}>No auditees found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;