import fs from 'fs';
import path from 'path';

// Clean local JSON database if present, then execute seed script
const dbPath = path.join(process.cwd(), 'data', 'careerai-db.json');
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('✓ Stale local demo database cleared.');
  } catch (err) {
    console.warn('Could not unlink local db file:', err);
  }
}

// Import and run seed script
import('./seedDemoData.js').catch(async () => {
  // If running via tsx
  await import('./seedDemoData.ts');
});
