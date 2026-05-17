const fs = require('fs');
const path = require('path');

const calculatorsFilePath = path.join(__dirname, 'src', 'data', 'calculators.ts');
let content = fs.readFileSync(calculatorsFilePath, 'utf8');

// Replace picsum seeds back to local paths
content = content.replace(/image:\s*'https:\/\/picsum\.photos\/seed\/([^/]+)\/400\/250'/g, (match, seed) => {
  let finalName = seed + '.png';
  if (seed === 'tax-regime-calculator-online') {
    finalName = 'Old vs New Tax Regime Calculator.png';
  } else if (seed === 'loan-optimizer-online') {
    finalName = 'Loan Optimization Calculator.png';
  } else if (seed === 'lic-surrender-value-calculator') {
    // some might be duplicates, but we just want to point to the correct image we generated
    finalName = 'lic-surrender-value-calculator.png';
  }
  return `image: '/images/${finalName}'`;
});

fs.writeFileSync(calculatorsFilePath, content, 'utf8');
console.log('Restored all calculator image paths to point to dedicated local assets.');
