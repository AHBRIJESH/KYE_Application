import React, { useState, useEffect, useMemo } from 'react';

function FilterSection({ onFilter, initialFilters = {} }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exceptionId, setExceptionId] = useState('');

  // Memoize initialFilters to prevent unnecessary re-renders
  const memoizedInitialFilters = useMemo(() => initialFilters, [initialFilters]);

  useEffect(() => {
    // Set default dates
    const today = new Date();
    const currentYear = today.getFullYear();
    const formattedToday = today.toISOString().split('T')[0];
    const formattedFirstDay = `${currentYear}-01-01`;
    
    setFromDate(memoizedInitialFilters.fromDate || formattedFirstDay);
    setToDate(memoizedInitialFilters.toDate || formattedToday);
    setExceptionId(memoizedInitialFilters.exceptionId || '');
  }, [memoizedInitialFilters]);

  const handleDateSearch = () => {
    onFilter({ fromDate, toDate, exceptionId: '' });
  };

  const handleIdSearch = () => {
    onFilter({ fromDate: '', toDate: '', exceptionId });
  };

  return (
    <div className="filter mb-2">
      <p className="mb-1" style={{fontSize: '10px'}}>
        The default is the current financial year, or please select the desired dates below.
        To filter by a specific Exception ID, enter it below. Otherwise, this field is optional.
      </p>
      <div className="d-flex flex-wrap gap-1 align-items-end">
        <label className="mb-0" style={{fontSize: '10px'}}>From Date: 
          <input 
            type="date" 
            className="form-control form-control-sm" 
            style={{fontSize: '10px'}}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label className="mb-0" style={{fontSize: '10px'}}>To Date: 
          <input 
            type="date" 
            className="form-control form-control-sm" 
            style={{fontSize: '10px'}}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button className="btn btn-sm btn-primary" style={{fontSize: '10px'}} onClick={handleDateSearch}>Search</button>
        <label className="mb-0" style={{fontSize: '10px'}}>Exception ID: 
          <input 
            type="text" 
            className="form-control form-control-sm" 
            style={{fontSize: '10px'}}
            value={exceptionId}
            onChange={(e) => setExceptionId(e.target.value)}
          />
        </label>
        <button className="btn btn-sm btn-primary" style={{fontSize: '10px'}} onClick={handleIdSearch}>Search</button>
      </div>
    </div>
  );
}

export default FilterSection;