// Automated syntax checker for seerah HTML file
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seerah-v2.html');

console.log('🔍 Testing:', filePath);

// Read file
const content = fs.readFileSync(filePath, 'utf8');

// Extract JavaScript from <script> tags
const scriptMatches = content.match(/<script>([\s\S]*?)<\/script>/g);

if (!scriptMatches) {
  console.error('❌ No <script> tags found!');
  process.exit(1);
}

let allPassed = true;

scriptMatches.forEach((scriptTag, index) => {
  const jsCode = scriptTag.replace(/<\/?script>/g, '').trim();
  
  console.log(`\n📦 Testing script block ${index + 1} (${jsCode.length} chars)...`);
  
  try {
    // Try to parse the JavaScript
    new Function(jsCode);
    console.log(`✅ Script block ${index + 1}: Valid syntax`);
  } catch (error) {
    console.error(`❌ Script block ${index + 1}: Syntax error!`);
    console.error('Error:', error.message);
    
    // Try to find line number
    const lines = jsCode.split('\n');
    const errorLine = error.message.match(/line (\d+)/);
    if (errorLine) {
      const lineNum = parseInt(errorLine[1]);
      console.error(`Line ${lineNum}:`, lines[lineNum - 1]);
    }
    
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n✅ All script blocks passed syntax validation!');
  process.exit(0);
} else {
  console.log('\n❌ Syntax errors found!');
  process.exit(1);
}
