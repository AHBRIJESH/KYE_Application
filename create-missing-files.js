const fs = require('fs');
const path = require('path');

// Files to create
const filesToCreate = [
  // Organization feature
  'src/features/organization/Organization.jsx',
  'src/features/organization/css/organization.css',
  'src/features/organization/js/orgLogic.js',
  'src/features/organization/data/orgUnits.json',
  
  // Help & Training feature
  'src/features/help-training/HelpTraining.jsx',
  'src/features/help-training/css/helpTraining.css',
  'src/features/help-training/js/helpTips.js',
  'src/features/help-training/data/tutorials.json',
  
  // Audit Notes feature
  'src/features/audit-notes/AuditNotes.jsx',
  'src/features/audit-notes/css/auditNotes.css',
  'src/features/audit-notes/js/auditNotesScript.js',
  'src/features/audit-notes/data/auditNotes.json',
  
  // User Master feature
  'src/features/user-master/UserMaster.jsx',
  'src/features/user-master/css/userMaster.css',
  'src/features/user-master/js/userMasterScript.js',
  'src/features/user-master/data/userRoles.json',
  
  // Reports feature
  'src/features/reports/Reports.jsx',
  'src/features/reports/css/reports.css',
  'src/features/reports/js/reportsScript.js',
  'src/features/reports/data/reportData.json',
  
  // Admin feature
  'src/features/admin/Admin.jsx',
  'src/features/admin/css/admin.css',
  'src/features/admin/js/adminScript.js',
  'src/features/admin/data/adminData.json'
];

// Content templates
const templates = {
  '.jsx': `import React from 'react'

function ComponentName() {
  return (
    <div className="component-container">
      <div className="page-header">
        <h1>Component Title</h1>
        <p>Component description</p>
      </div>
      
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        This feature is under development.
      </div>
    </div>
  )
}

export default ComponentName`,
  
  '.css': `.component-container {
  padding: 1rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-light);
  margin: 0;
}`,
  
  '.js': `// Component logic will go here`,
  
  '.json': `{}`
};

// Create directories and files
filesToCreate.forEach(filePath => {
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
  
  // Get file extension
  const ext = path.extname(filePath);
  
  // Get component name from file path
  const componentName = path.basename(filePath, path.extname(filePath));
  
  // Get template
  let template = templates[ext] || '';
  
  // Replace component name in JSX template
  if (ext === '.jsx') {
    template = template.replace(/ComponentName/g, componentName);
    template = template.replace(/Component Title/g, componentName.replace(/([A-Z])/g, ' $1').trim());
    template = template.replace(/component-container/g, `${componentName.toLowerCase()}-container`);
  }
  
  // Write file
  fs.writeFileSync(filePath, template);
  console.log(`Created file: ${filePath}`);
});

console.log('All missing files created successfully!');