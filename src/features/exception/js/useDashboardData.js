import { useState, useEffect, useRef, useMemo } from 'react';
import dashboardData from '../data/dummy.json';

export default function useDashboardData(filters, context = {}) {
  const [summary, setSummary] = useState({
    assigned: 0,
    underProcess: 0,
    closedByAuditee: 0,
    closedByAuditor: 0
  });
  const [filteredData, setFilteredData] = useState(null);
  const [filteredEmails, setFilteredEmails] = useState([]);
  
  // Use refs to track previous values
  const prevFiltersRef = useRef(filters);
  const prevContextRef = useRef(context);
  const isInitializedRef = useRef(false);
  
  // Memoize filters and context to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters]);
  const memoizedContext = useMemo(() => context, [context]);
  
  useEffect(() => {
    console.log("useDashboardData effect running");
    console.log("Original dashboardData:", dashboardData);
    console.log("Filters:", memoizedFilters);
    console.log("Context:", memoizedContext);
    
    // Skip first render to prevent initialization issues
    if (!isInitializedRef.current) {
      console.log("First render, initializing");
      isInitializedRef.current = true;
      
      // Make a deep copy of the data for initial render
      const dataCopy = JSON.parse(JSON.stringify(dashboardData));
      const filtered = applyFilters(dataCopy, memoizedFilters, memoizedContext);
      const newSummary = calculateSummary(filtered);
      console.log("Initial filtered data:", filtered);
      console.log("Initial summary:", newSummary);
      
      setSummary(newSummary);
      setFilteredData(filtered);
      
      if (memoizedContext.exceptionId && filtered) {
        const filteredEmailList = filterEmails(filtered.details?.emails || [], memoizedFilters);
        console.log("Initial filtered emails:", filteredEmailList);
        setFilteredEmails(filteredEmailList);
      }
      return;
    }
    
    // Check if filters or context have actually changed
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(memoizedFilters);
    const contextChanged = JSON.stringify(prevContextRef.current) !== JSON.stringify(memoizedContext);
    
    console.log("Filters changed:", filtersChanged);
    console.log("Context changed:", contextChanged);
    
    if (!filtersChanged && !contextChanged) {
      return; // Skip if nothing changed
    }
    
    // Update refs
    prevFiltersRef.current = memoizedFilters;
    prevContextRef.current = memoizedContext;
    
    // Make a deep copy of the data
    const dataCopy = JSON.parse(JSON.stringify(dashboardData));
    // Apply filters based on context
    let filtered = applyFilters(dataCopy, memoizedFilters, memoizedContext);
    console.log("Filtered data after applying filters:", filtered);
    
    // Calculate summary
    const newSummary = calculateSummary(filtered);
    console.log("New summary:", newSummary);
    
    setSummary(newSummary);
    setFilteredData(filtered);
    
    // If we're in Details context, also filter emails
    if (memoizedContext.exceptionId && filtered) {
      const filteredEmailList = filterEmails(filtered.details?.emails || [], memoizedFilters);
      console.log("Filtered emails:", filteredEmailList);
      setFilteredEmails(filteredEmailList);
    }
  }, [memoizedFilters, memoizedContext]);
  
  return { summary, filteredData, filteredEmails };
}

function applyFilters(data, filters, context) {
  console.log("Applying filters with context:", context);
  
  // If we're in Dashboard context, we need the full hierarchy
  if (!context.department && !context.division && !context.auditee && !context.exceptionId) {
    console.log("Dashboard context - filtering all data");
    return filterDashboardData(data, filters);
  }
  
  // If we're in Exception context
  if (context.department && context.division && context.auditee) {
    console.log("Exception context - filtering for specific auditee");
    return filterExceptionData(data, filters, context);
  }
  
  // If we're in Details context
  if (context.exceptionId) {
    console.log("Details context - filtering for specific exception");
    return filterDetailsData(data, filters, context);
  }
  
  console.log("No specific context, returning original data");
  return data;
}

function filterDashboardData(data, filters) {
  console.log("Filtering dashboard data");
  
  // If no filters, return original data
  if (!filters.fromDate && !filters.toDate && !filters.exceptionId) {
    return data;
  }
  
  // Filter departments based on date range
  const filteredDepartments = data.departments.map(dept => {
    const filteredDivisions = dept.divisions.map(div => {
      const filteredPeople = div.people.map(person => {
        const filteredExceptions = person.exceptions.filter(exc => {
          // Check date range
          if (filters.fromDate && filters.toDate) {
            const excDate = new Date(exc.details.AssignedDateTime);
            const fromDate = new Date(filters.fromDate);
            const toDate = new Date(filters.toDate);
            if (excDate < fromDate || excDate > toDate) {
              return false;
            }
          }
          // Check exception ID
          if (filters.exceptionId && exc.id !== filters.exceptionId) {
            return false;
          }
          return true;
        });
        return { ...person, exceptions: filteredExceptions };
      }).filter(person => person.exceptions.length > 0);
      return { ...div, people: filteredPeople };
    }).filter(div => div.people.length > 0);
    return { ...dept, divisions: filteredDivisions };
  }).filter(dept => dept.divisions.length > 0);
  
  return { ...data, departments: filteredDepartments };
}

function filterExceptionData(data, filters, context) {
  console.log("Filtering exception data for:", context);
  const dept = data.departments.find(d => d.name === context.department);
  if (!dept) {
    console.log("Department not found:", context.department);
    return null;
  }
  const div = dept.divisions.find(d => d.name === context.division);
  if (!div) {
    console.log("Division not found:", context.division);
    return null;
  }
  const person = div.people.find(p => p.name === context.auditee);
  if (!person) {
    console.log("Person not found:", context.auditee);
    return null;
  }
  console.log("Found person:", person.name);
  
  // If no filters, return the person data as is
  if (!filters.fromDate && !filters.toDate && !filters.exceptionId) {
    return { ...person };
  }
  
  // Filter exceptions for this person
  const filteredExceptions = person.exceptions.filter(exc => {
    // Check date range
    if (filters.fromDate && filters.toDate) {
      const excDate = new Date(exc.details.AssignedDateTime);
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      if (excDate < fromDate || excDate > toDate) {
        return false;
      }
    }
    // Check exception ID
    if (filters.exceptionId && exc.id !== filters.exceptionId) {
      return false;
    }
    return true;
  });
  console.log("Filtered exceptions:", filteredExceptions.length);
  return { ...person, exceptions: filteredExceptions };
}

function filterDetailsData(data, filters, context) {
  console.log("Filtering details data for exception ID:", context.exceptionId);
  
  // Find the specific exception
  for (const dept of data.departments) {
    for (const div of dept.divisions) {
      for (const person of div.people) {
        for (const exc of person.exceptions) {
          if (exc.id === context.exceptionId) {
            console.log("Found exception:", exc.name);
            
            // If no filters, return the exception as is
            if (!filters.fromDate && !filters.toDate && !filters.exceptionId) {
              return exc;
            }
            
            // Check if it matches filters
            if (filters.fromDate && filters.toDate) {
              const excDate = new Date(exc.details.AssignedDateTime);
              const fromDate = new Date(filters.fromDate);
              const toDate = new Date(filters.toDate);
              if (excDate < fromDate || excDate > toDate) {
                console.log("Exception date out of range");
                return null;
              }
            }
            if (filters.exceptionId && exc.id !== filters.exceptionId) {
              console.log("Exception ID doesn't match");
              return null;
            }
            return exc;
          }
        }
      }
    }
  }
  console.log("Exception not found");
  return null;
}

function filterEmails(emails, filters) {
  console.log("Filtering emails with filters:", filters);
  if (!emails || !Array.isArray(emails)) {
    console.log("No emails to filter");
    return [];
  }
  
  // If no filters, return all emails
  if (!filters.fromDate && !filters.toDate && !filters.content && !filters.attachmentTitle) {
    return emails;
  }
  
  return emails.filter(email => {
    // Check date range
    if (filters.fromDate && filters.toDate) {
      const emailDate = new Date(email.dateTime);
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      if (emailDate < fromDate || emailDate > toDate) {
        return false;
      }
    }
    // Check content
    if (filters.content) {
      const contentLower = filters.content.toLowerCase();
      if (!email.content || !email.content.toLowerCase().includes(contentLower)) {
        return false;
      }
    }
    // Check attachment titles
    if (filters.attachmentTitle) {
      const attachmentLower = filters.attachmentTitle.toLowerCase();
      const hasMatchingAttachment = email.attachments && email.attachments.some(att => 
        att.title && att.title.toLowerCase().includes(attachmentLower)
      );
      if (!hasMatchingAttachment) {
        return false;
      }
    }
    return true;
  });
}

function calculateSummary(data) {
  console.log("Calculating summary for data:", data);
  
  // For Dashboard
  if (data && data.departments) {
    let assigned = 0;
    let underProcess = 0;
    let closedByAuditee = 0;
    let closedByAuditor = 0;
    
    data.departments.forEach(dept => {
      dept.divisions.forEach(div => {
        div.people.forEach(person => {
          person.exceptions.forEach(exc => {
            assigned += 1;
            underProcess += exc.underProcess;
            closedByAuditee += exc.closedByAuditee;
            closedByAuditor += exc.closedByAuditor;
          });
        });
      });
    });
    
    const summary = { assigned, underProcess, closedByAuditee, closedByAuditor };
    console.log("Dashboard summary:", summary);
    return summary;
  }
  
  // For Exception
  if (data && data.exceptions) {
    let assigned = data.exceptions.length;
    let underProcess = data.exceptions.reduce((sum, exc) => sum + exc.underProcess, 0);
    let closedByAuditee = data.exceptions.reduce((sum, exc) => sum + exc.closedByAuditee, 0);
    let closedByAuditor = data.exceptions.reduce((sum, exc) => sum + exc.closedByAuditor, 0);
    
    const summary = { assigned, underProcess, closedByAuditee, closedByAuditor };
    console.log("Exception summary:", summary);
    return summary;
  }
  
  // For Details
  if (data) {
    const summary = {
      assigned: 1,
      underProcess: data.underProcess || 0,
      closedByAuditee: data.closedByAuditee || 0,
      closedByAuditor: data.closedByAuditor || 0
    };
    console.log("Details summary:", summary);
    return summary;
  }
  
  // Default
  console.log("Default summary");
  return { assigned: 0, underProcess: 0, closedByAuditee: 0, closedByAuditor: 0 };
}