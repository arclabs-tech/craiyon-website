const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'craiyon.db');

if (!fs.existsSync(dbPath)) {
  console.log('No existing database found at', dbPath);
  process.exit(0);
}

const db = new Database(dbPath);

function columnExists(table, column) {
  const stmt = db.prepare(`PRAGMA table_info(${table})`);
  const rows = stmt.all();
  return rows.some(r => r.name === column);
}

// Add column helper
function addColumnIfMissing(table, column, definition) {
  if (columnExists(table, column)) {
    console.log(`Column ${column} already exists on ${table}`);
    return;
  }
  console.log(`Adding column ${column} to ${table}`);
  db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
}

try {
  addColumnIfMissing('submissions', 'negative_prompt', "TEXT NOT NULL DEFAULT ''");
  addColumnIfMissing('generated_images', 'negative_prompt', "TEXT NOT NULL DEFAULT ''");
  console.log('Migration complete.');
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
} finally {
  db.close();
}
