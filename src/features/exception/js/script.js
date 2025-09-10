// Helper functions for exception management
export function findPerson(deptName, divName, personName, data) {
  const dept = data.departments.find(d => d.name === deptName);
  if (!dept) return null;
  const div = dept.divisions.find(d => d.name === divName);
  if (!div) return null;
  return div.people.find(p => p.name === personName);
}

export function findExceptionById(id, data) {
  for (const dept of data.departments) {
    for (const div of dept.divisions) {
      for (const person of div.people) {
        for (const exc of person.exceptions) {
          if (exc.id === id) {
            return exc;
          }
        }
      }
    }
  }
  return null;
}

export function generateDashboardData(data) {
  return {
    assigned: data.assigned,
    underProcess: data.underProcess,
    closedByAuditee: data.closedByAuditee,
    closedByAuditor: data.closedByAuditor,
    departments: data.departments
  };
}