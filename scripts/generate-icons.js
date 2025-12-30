#!/usr/bin/env node
/**
 * PWA Icon Generator Script
 * 
 * This script generates PWA icons from a source image.
 * 
 * Prerequisites:
 * - Install sharp: npm install sharp --save-dev
 * 
 * Usage:
 * - Place your source logo at public/images/logo.jpg (or update SOURCE_IMAGE)
 * - Run: node scripts/generate-icons.js
 * 
 * Alternatively, use online tools:
 * - https://realfavicongenerator.net/
 * - https://www.pwabuilder.com/imageGenerator
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_IMAGE = path.join(__dirname, '../public/images/logo.jpg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  try {
    // Check if sharp is available
    let sharp;
    try {
      sharp = (await import('sharp')).default;
    } catch (e) {
      console.log('Sharp not installed. Install with: npm install sharp --save-dev');
      console.log('');
      console.log('Alternatively, generate icons manually using:');
      console.log('- https://realfavicongenerator.net/');
      console.log('- https://www.pwabuilder.com/imageGenerator');
      console.log('');
      console.log('Required icon sizes:', ICON_SIZES.join(', '));
      return;
    }

    // Check if source image exists
    if (!fs.existsSync(SOURCE_IMAGE)) {
      console.log(`Source image not found: ${SOURCE_IMAGE}`);
      console.log('Please place your logo image at this location.');
      return;
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log('Generating PWA icons...');

    for (const size of ICON_SIZES) {
      const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
      
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated: ${outputPath}`);
    }

    console.log('');
    console.log('All icons generated successfully!');
    console.log('');
    console.log('Icons are ready for PWA use.');

  } catch (error) {
    console.error('Error generating icons:', error.message);
  }
}

generateIcons();
