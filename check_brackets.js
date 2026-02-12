const fs = require('fs');
const filePath = process.argv[2];

try {
  const content = fs.readFileSync(filePath, 'utf8');
  let open = 0;
  let lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let char of line) {
      if (char === '{') open++;
      if (char === '}') open--;
    }
    if (open < 0) {
      console.log(`Error: Extra closing bracket at line ${i + 1}`);
      break;
    }
  }
  
  if (open > 0) {
    console.log(`Error: ${open} unclosed brackets remaining at end of file.`);
  } else if (open === 0) {
    console.log("Success: Brackets are balanced.");
  }
} catch (err) {
  console.error(err);
}
