const fs = require('fs');
const { execSync } = require('child_process');

// Define command line argument options
const argOptions = {
  '-s': 'replaceString1',
  '-i': 'inputFilePath',
  '-o': 'outputFilePath',
  '-a': 'autoReplaceString',
};

// Parse command line arguments
const args = process.argv.slice(2);
const argMap = {};
let lastKey = null;
for (const arg of args) {
  if (argOptions[arg]) {
    lastKey = argOptions[arg];
    argMap[lastKey] = null;
  } else if (lastKey) {
    argMap[lastKey] = arg;
    lastKey = null;
  }
}
// Get command line arguments
const autoReplaceString = argMap['autoReplaceString'];
const replaceString1 = argMap['replaceString1'];
let inputFilePath;
let outputFilePath;
if(!autoReplaceString) {
    inputFilePath = argMap['inputFilePath'];
    outputFilePath = argMap['outputFilePath'];
} else {
    inputFilePath = "libcocos2dcpp.so";
    outputFilePath = "libcocos2dcpp.so";
}

if (!replaceString1 || replaceString1.length !== 33) {
  console.log('Usage: replace.exe -s [gdps full url (33 chars)] [-a ANDROID STRING (com.YOURNAM.geometryjump)] [-i [input file path]] [-o [output file path]]');
  process.exit(1);
}

// Encode replaceString1 to base64 to get replaceString2
const replaceString2 = Buffer.from(replaceString1).toString('base64');

// Read the contents of the file
const fileContent = fs.readFileSync(inputFilePath, 'binary');

// Replace the search strings with the new values
let nc;
if (autoReplaceString) {
    nc = fileContent.replace(/robtopx/g, autoReplaceString).replace(/http:\/\/www\.boomlings\.com\/database/g, replaceString1).replace(/aHR0cDovL3d3dy5ib29tbGluZ3MuY29tL2RhdGFiYXNl/g, replaceString2);
} else {
  nc = fileContent.replace(/http:\/\/www\.boomlings\.com\/database/g, replaceString1).replace(/aHR0cDovL3d3dy5ib29tbGluZ3MuY29tL2RhdGFiYXNl/g, replaceString2);
}
// Write the modified content to a new file
fs.writeFileSync(outputFilePath, nc, 'binary');
console.log(`Successfully replaced strings in ${inputFilePath}. The modified file is saved as ${outputFilePath}.`);
