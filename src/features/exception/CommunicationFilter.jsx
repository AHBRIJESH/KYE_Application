import React, { useState, useEffect, useMemo } from 'react';

function CommunicationFilter({ onFilter, initialFilters = {} }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [content, setContent] = useState('');
  const [attachmentTitle, setAttachmentTitle] = useState('');

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
    setContent(memoizedInitialFilters.content || '');
    setAttachmentTitle(memoizedInitialFilters.attachmentTitle || '');
  }, [memoizedInitialFilters]);

  const handleDateSearch = () => {
    onFilter({ fromDate, toDate, content: '', attachmentTitle: '' });
  };

  const handleContentSearch = () => {
    onFilter({ fromDate: '', toDate: '', content, attachmentTitle: '' });
  };

  const handleAttachmentSearch = () => {
    onFilter({ fromDate: '', toDate: '', content: '', attachmentTitle });
  };

  const handleRefresh = () => {
    // Reset all filters and trigger a refresh
    const today = new Date();
    const currentYear = today.getFullYear();
    const formattedToday = today.toISOString().split('T')[0];
    const formattedFirstDay = `${currentYear}-01-01`;
    
    setFromDate(formattedFirstDay);
    setToDate(formattedToday);
    setContent('');
    setAttachmentTitle('');
    
    onFilter({ 
      fromDate: formattedFirstDay, 
      toDate: formattedToday, 
      content: '', 
      attachmentTitle: '' 
    });
  };

  return (
    <div className="filters p-2 mb-2 bg-light rounded">
      <div className="row g-1">
        <div className="col-md-3">
          <label className="form-label" style={{fontSize: '9px'}}>From Date:</label>
          <input 
            type="date" 
            className="form-control form-control-sm" 
            style={{fontSize: '9px'}}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label" style={{fontSize: '9px'}}>To Date:</label>
          <input 
            type="date" 
            className="form-control form-control-sm" 
            style={{fontSize: '9px'}}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button 
            className="btn btn-sm btn-primary w-100" 
            style={{fontSize: '9px'}}
            onClick={handleDateSearch}
          >
            Search
          </button>
        </div>
        <div className="col-md-4">
          <label className="form-label" style={{fontSize: '9px'}}>Search by Communication Content:</label>
          <input 
            type="text" 
            className="form-control form-control-sm" 
            placeholder="Enter keywords..." 
            style={{fontSize: '9px'}}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label" style={{fontSize: '9px'}}>Search by Attachment Titles:</label>
          <input 
            type="text" 
            className="form-control form-control-sm" 
            placeholder="Enter attachment title..." 
            style={{fontSize: '9px'}}
            value={attachmentTitle}
            onChange={(e) => setAttachmentTitle(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button 
            className="btn btn-sm btn-primary w-100" 
            style={{fontSize: '9px'}}
            onClick={handleAttachmentSearch}
          >
            Search
          </button>
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button 
            className="btn btn-sm btn-success w-100" 
            style={{fontSize: '9px'}}
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunicationFilter;