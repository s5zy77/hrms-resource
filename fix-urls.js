const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./frontend/src');
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Replace fetch('/api/...
  content = content.replace(/fetch\('\/api\//g, "fetch('https://hrms-resource.onrender.com/api/");
  
  // Replace fetch(`/api/...
  content = content.replace(/fetch\(`\/api\//g, "fetch(`https://hrms-resource.onrender.com/api/");
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    changedFiles++;
  }
});

console.log(`Done. Changed ${changedFiles} files.`);
