// compile.js - Run with: node compile.js
// Compiles sarms-app.js (JSX) to sarms-compiled.js (plain JS)
// No global installs needed - everything goes in this folder

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const input  = path.join(__dirname, 'sarms-app.js');
const output = path.join(__dirname, 'sarms-compiled.js');

// Check input file exists
if (!fs.existsSync(input)) {
  console.error('ERROR: sarms-app.js not found.');
  console.error('Make sure sarms-app.js is in the same folder as compile.js');
  process.exit(1);
}

console.log('');
console.log('==============================================');
console.log('  SARMS Compiler');
console.log('==============================================');
console.log('');
console.log('Step 1/2: Installing Babel (needs internet)...');
console.log('This takes about 1 minute...');
console.log('');

try {
  execSync(
    'npm install --save-dev @babel/core @babel/cli @babel/preset-react @babel/preset-env',
    { stdio: 'inherit', cwd: __dirname, timeout: 180000 }
  );
} catch (e) {
  console.error('');
  console.error('npm install failed. Check your internet connection and try again.');
  process.exit(1);
}

console.log('');
console.log('Step 2/2: Compiling JSX to JavaScript...');
console.log('');

const babelBin = path.join(__dirname, 'node_modules', '.bin', 'babel');

try {
  execSync(
    `"${babelBin}" "${input}" --out-file "${output}" --presets @babel/preset-react,@babel/preset-env --no-babelrc`,
    { stdio: 'inherit', cwd: __dirname, timeout: 180000 }
  );
} catch (e) {
  console.error('Compilation failed:', e.message);
  process.exit(1);
}

// Verify output was created
if (!fs.existsSync(output)) {
  console.error('ERROR: sarms-compiled.js was not created.');
  process.exit(1);
}

const size = (fs.statSync(output).size / 1024).toFixed(0);

console.log('');
console.log('==============================================');
console.log(`  SUCCESS!  sarms-compiled.js created (${size} KB)`);
console.log('==============================================');
console.log('');
console.log('NEXT STEPS:');
console.log('');
console.log('1. Copy these files to C:\\xampp\\htdocs\\sarms-react\\');
console.log('   - sarms-compiled.js   (from this folder)');
console.log('   - index-compiled.html (rename it to index.html)');
console.log('');
console.log('2. Copy api\\db.php to C:\\xampp\\htdocs\\sarms-react\\api\\db.php');
console.log('');
console.log('3. Open browser: http://localhost/sarms-react');
console.log('');
console.log('   Login: admin@school.com / admin@2024');
console.log('');
