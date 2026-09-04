const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\HomePC\\Desktop\\Awareness System';

const dirs = [
  'middleware',
  'models',
  'controllers',
  'routes',
  'config',
  'public\\css',
  'public\\js',
  'admin',
  'database'
];

dirs.forEach(dir => {
  const fullPath = path.join(basePath, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${fullPath}`);
  }
});

console.log('Setup complete!');
