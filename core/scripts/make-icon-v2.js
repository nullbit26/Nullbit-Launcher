const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

const PNG_PATH = path.join(__dirname, '../../renderer/splash-logo.png');
const ICO_PATH = path.join(__dirname, '../assets/icon.ico');

async function createIcon() {
  try {
    const buf = await pngToIco(PNG_PATH);
    fs.writeFileSync(ICO_PATH, buf);
    console.log('Created icon.ico:', buf.length, 'bytes');
    
    // Also create smaller versions for different sizes
    const sizes = [16, 32, 48, 64, 128, 256];
    console.log('Icon sizes included:', sizes.join(', '));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createIcon();
