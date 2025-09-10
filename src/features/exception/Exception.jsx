import React, { useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import FilterSection from './FilterSection';
import DashboardSummary from './DashboardSummary';
import useDashboardData from './js/useDashboardData';
import './css/stycs.css';

function Exception() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const auditeeName = searchParams.get('auditee');
  const divisionName = searchParams.get('division');
  const departmentName = searchParams.get('department');
  const [openSections, setOpenSections] = useState({});
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    exceptionId: ''
  });

  // Memoize context to prevent unnecessary re-renders
  const context = useMemo(() => ({
    department: departmentName,
    division: divisionName,
    auditee: auditeeName
  }), [departmentName, divisionName, auditeeName]);

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
    <div className="exception-details compact">
      <FilterSection onFilter={handleFilter} initialFilters={filters} />
      <DashboardSummary 
        summary={summary} 
        onToggleSection={toggleSection}
        openSections={openSections}
      />
      <h3 className="mb-2" style={{fontSize: '11px', fontWeight: 'bold'}}>Auditee - {filteredData.name}</h3>
      <div className="table-responsive">
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
            {filteredData.exceptions && filteredData.exceptions.length > 0 ? (
              filteredData.exceptions.map((exc, index) => (
                <tr key={index}>
                  <td style={{fontSize: '10px'}}>{exc.name}</td>
                  <td style={{fontSize: '10px'}}>{exc.underProcess}</td>
                  <td style={{fontSize: '10px'}}>{exc.closedByAuditee}</td>
                  <td style={{fontSize: '10px'}}>{exc.closedByAuditor}</td>
                  <td>
                    <Link 
                      to={`/exception/details/${exc.id}`}
                      className="btn btn-sm btn-outline-primary"
                      style={{fontSize: '9px'}}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{fontSize: '10px', textAlign: 'center'}}>No exceptions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Exception;