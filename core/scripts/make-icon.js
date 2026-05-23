const fs = require('fs');
const path = require('path');

// Simple ICO generator for PNG source
// Creates multi-resolution ICO file

const PNG_PATH = path.join(__dirname, '../../renderer/splash-logo.png');
const ICO_PATH = path.join(__dirname, '../assets/icon.ico');

// ICO header constants
const ICO_HEADER_SIZE = 6;
const ICO_ENTRY_SIZE = 16;
const SIZES = [256, 128, 64, 48, 32, 16];

function createICO(pngBuffer) {
  const numImages = SIZES.length;
  let offset = ICO_HEADER_SIZE + (numImages * ICO_ENTRY_SIZE);
  
  // Calculate total size
  const imageDataSize = pngBuffer.length;
  const totalSize = offset + (imageDataSize * numImages);
  
  const icoBuffer = Buffer.alloc(totalSize);
  
  // ICO Header
  icoBuffer.writeUInt16LE(0, 0); // Reserved
  icoBuffer.writeUInt16LE(1, 2); // Type: ICO
  icoBuffer.writeUInt16LE(numImages, 4); // Count
  
  // Write entries and copy PNG data for each size
  let currentOffset = offset;
  
  for (let i = 0; i < numImages; i++) {
    const size = SIZES[i];
    const entryOffset = ICO_HEADER_SIZE + (i * ICO_ENTRY_SIZE);
    
    // Entry
    icoBuffer.writeUInt8(size > 255 ? 0 : size, entryOffset); // Width
    icoBuffer.writeUInt8(size > 255 ? 0 : size, entryOffset + 1); // Height
    icoBuffer.writeUInt8(0, entryOffset + 2); // Colors (0 = >256)
    icoBuffer.writeUInt8(0, entryOffset + 3); // Reserved
    icoBuffer.writeUInt16LE(1, entryOffset + 4); // Color planes
    icoBuffer.writeUInt16LE(32, entryOffset + 6); // Bits per pixel
    icoBuffer.writeUInt32LE(imageDataSize, entryOffset + 8); // Size
    icoBuffer.writeUInt32LE(currentOffset, entryOffset + 12); // Offset
    
    // Copy PNG data
    pngBuffer.copy(icoBuffer, currentOffset);
    currentOffset += imageDataSize;
  }
  
  return icoBuffer;
}

// Read PNG and create ICO
const pngBuffer = fs.readFileSync(PNG_PATH);
const icoBuffer = createICO(pngBuffer);
fs.writeFileSync(ICO_PATH, icoBuffer);

console.log(`Created icon.ico with ${SIZES.length} sizes: ${SIZES.join(', ')}`);
console.log(`Output: ${ICO_PATH}`);
