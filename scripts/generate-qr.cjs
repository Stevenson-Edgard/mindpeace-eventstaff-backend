// scripts/generate-qr.cjs
// Usage: node scripts/generate-qr.cjs <url> [outputFile]

const qr = require('qr-image');
const fs = require('fs');
const path = require('path');

const url = process.argv[2] || 'https://valda-toxicological-perspiringly.ngrok-free.dev';
const outputDir = path.resolve(__dirname, '../qrcodes');
const outputFile = process.argv[3] || 'ngrok-link.png';
const outputPath = path.join(outputDir, outputFile);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const qr_png = qr.image(url, { type: 'png' });
qr_png.pipe(fs.createWriteStream(outputPath));

console.log(`QR code for ${url} saved to ${outputPath}`);
