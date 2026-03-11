import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const maskableSizes = [192, 512];

async function generateIcons() {
  const publicDir = join(process.cwd(), 'public');
  const iconsDir = join(publicDir, 'icons');
  
  await mkdir(iconsDir, { recursive: true });
  
  // Base icon path - you should replace this with your actual logo
  const baseIcon = join(publicDir, 'logo.png');
  
  console.log('Generating PWA icons...');
  
  // Generate regular icons
  for (const size of sizes) {
    await sharp(baseIcon)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(join(iconsDir, `icon-${size}x${size}.png`));
    
    console.log(`✓ Generated icon-${size}x${size}.png`);
  }
  
  // Generate maskable icons (with padding for safe zone)
  for (const size of maskableSizes) {
    const padding = Math.floor(size * 0.1);
    const innerSize = size - (padding * 2);
    
    await sharp(baseIcon)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .png()
      .toFile(join(iconsDir, `icon-${size}x${size}-maskable.png`));
    
    console.log(`✓ Generated icon-${size}x${size}-maskable.png`);
  }
  
  // Generate favicon
  await sharp(baseIcon)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  
  console.log('✓ Generated favicon.ico');
  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
