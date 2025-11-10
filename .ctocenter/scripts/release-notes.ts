#!/usr/bin/env ts-node
/**
 * Release Notes Generator
 * 
 * Generates release notes from CHANGELOG.md for a specific version
 */

import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const CHANGELOG_PATH = path.join(PROJECT_ROOT, 'CHANGELOG.md');

function extractReleaseNotes(version: string): string {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    throw new Error('CHANGELOG.md not found');
  }
  
  const changelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const lines = changelog.split('\n');
  
  const versionPattern = version.startsWith('v') ? version : `v${version}`;
  let inSection = false;
  const notes: string[] = [];
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (line.includes(versionPattern)) {
        inSection = true;
        notes.push(line);
        continue;
      } else if (inSection) {
        break;
      }
    }
    
    if (inSection && line.trim()) {
      notes.push(line);
    }
  }
  
  if (notes.length === 0) {
    throw new Error(`No release notes found for version ${version}`);
  }
  
  return notes.join('\n');
}

async function main() {
  const version = process.argv[2];
  
  if (!version) {
    console.error('Usage: npm run ctocenter:release-notes <version>');
    console.error('Example: npm run ctocenter:release-notes 1.0.0');
    process.exit(1);
  }
  
  console.log(`📄 Extracting release notes for version ${version}...\n`);
  
  try {
    const notes = extractReleaseNotes(version);
    
    console.log(notes);
    console.log('\n✅ Release notes extracted successfully');
    
    // Optionally save to file
    const outputPath = path.join(PROJECT_ROOT, 'RELEASE_NOTES.md');
    fs.writeFileSync(outputPath, notes);
    console.log(`📝 Saved to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { extractReleaseNotes };
