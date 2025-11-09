#!/usr/bin/env ts-node
/**
 * Table of Contents Sync
 * 
 * Syncs table of contents in markdown files
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const PROJECT_ROOT = path.resolve(__dirname, '../..');

function generateTOC(content: string): string {
  const lines = content.split('\n');
  const headings: { level: number; text: string; anchor: string }[] = [];
  
  for (const line of lines) {
    const match = line.match(/^(#{2,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const anchor = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({ level, text, anchor });
    }
  }
  
  if (headings.length === 0) {
    return '';
  }
  
  let toc = '## Table of Contents\n\n';
  
  for (const heading of headings) {
    const indent = '  '.repeat(heading.level - 2);
    toc += `${indent}- [${heading.text}](#${heading.anchor})\n`;
  }
  
  return toc + '\n';
}

async function syncTOC(filePath: string): Promise<boolean> {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if file has TOC marker
  if (!content.includes('<!-- TOC -->')) {
    return false;
  }
  
  const toc = generateTOC(content);
  
  // Replace existing TOC
  const updated = content.replace(
    /<!-- TOC -->[\s\S]*?<!-- \/TOC -->/,
    `<!-- TOC -->\n${toc}<!-- /TOC -->`
  );
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    return true;
  }
  
  return false;
}

async function main() {
  console.log('🔄 Syncing table of contents...\n');
  
  const docs = await glob('docs/**/*.md', { cwd: PROJECT_ROOT });
  let updated = 0;
  
  for (const doc of docs) {
    const fullPath = path.join(PROJECT_ROOT, doc);
    const wasUpdated = await syncTOC(fullPath);
    
    if (wasUpdated) {
      console.log(`✅ Updated: ${doc}`);
      updated++;
    }
  }
  
  console.log(`\n📊 Updated ${updated} file(s)`);
  
  if (updated === 0) {
    console.log('ℹ️  No files with TOC markers found (add <!-- TOC -->...<!-- /TOC --> to enable auto-sync)');
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { generateTOC, syncTOC };
