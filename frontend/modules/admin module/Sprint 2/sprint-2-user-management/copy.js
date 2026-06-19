const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\HARSHA\\.gemini\\antigravity\\brain\\6c67d184-ff4d-4fb0-9958-105c0c207b2e\\success_illustration_1781092058328.png';
const dest = path.join(__dirname, 'src', 'assets', 'success-illustration.png');

try {
  fs.copyFileSync(src, dest);
  console.log('Successfully copied image to assets.');
} catch (err) {
  console.error('Error copying file:', err);
}
