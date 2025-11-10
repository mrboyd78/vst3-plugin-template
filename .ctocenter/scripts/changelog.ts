#!/usr/bin/env ts-node
/**
 * Changelog Generator
 * 
 * Generates CHANGELOG.md from git commit history
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const CHANGELOG_PATH = path.join(PROJECT_ROOT, 'CHANGELOG.md');

interface Commit {
  hash: string;
  date: string;
  author: string;
  message: string;
  type?: string;
}

function getCommitsSinceLastTag(): Commit[] {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0 2>/dev/null || echo ""', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8'
    }).trim();
    
    const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
    
    const log = execSync(`git log ${range} --format=%H%n%ad%n%an%n%s%n---`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8'
    });
    
    const commits: Commit[] = [];
    const entries = log.split('---\n').filter(e => e.trim());
    
    for (const entry of entries) {
      const lines = entry.trim().split('\n');
      if (lines.length >= 4) {
        const message = lines[3];
        let type = 'other';
        
        if (message.match(/^feat(\(.*?\))?:/i)) type = 'feature';
        else if (message.match(/^fix(\(.*?\))?:/i)) type = 'fix';
        else if (message.match(/^docs?(\(.*?\))?:/i)) type = 'docs';
        else if (message.match(/^refactor(\(.*?\))?:/i)) type = 'refactor';
        else if (message.match(/^test(\(.*?\))?:/i)) type = 'test';
        else if (message.match(/^chore(\(.*?\))?:/i)) type = 'chore';
        
        commits.push({
          hash: lines[0],
          date: lines[1],
          author: lines[2],
          message,
          type
        });
      }
    }
    
    return commits;
  } catch (error) {
    console.error('Error getting commits:', error);
    return [];
  }
}

function generateChangelogEntry(version: string, date: string, commits: Commit[]): string {
  let entry = `## ${version} - ${date}\n\n`;
  
  const byType: Record<string, Commit[]> = {
    feature: [],
    fix: [],
    docs: [],
    refactor: [],
    test: [],
    chore: [],
    other: []
  };
  
  commits.forEach(commit => {
    const type = commit.type || 'other';
    byType[type].push(commit);
  });
  
  if (byType.feature.length > 0) {
    entry += '### ✨ Features\n\n';
    byType.feature.forEach(c => {
      entry += `- ${c.message} (${c.hash.substring(0, 7)})\n`;
    });
    entry += '\n';
  }
  
  if (byType.fix.length > 0) {
    entry += '### 🐛 Bug Fixes\n\n';
    byType.fix.forEach(c => {
      entry += `- ${c.message} (${c.hash.substring(0, 7)})\n`;
    });
    entry += '\n';
  }
  
  if (byType.docs.length > 0) {
    entry += '### 📚 Documentation\n\n';
    byType.docs.forEach(c => {
      entry += `- ${c.message} (${c.hash.substring(0, 7)})\n`;
    });
    entry += '\n';
  }
  
  if (byType.refactor.length > 0) {
    entry += '### ♻️ Refactoring\n\n';
    byType.refactor.forEach(c => {
      entry += `- ${c.message} (${c.hash.substring(0, 7)})\n`;
    });
    entry += '\n';
  }
  
  return entry;
}

async function main() {
  console.log('📝 Generating changelog...\n');
  
  const commits = getCommitsSinceLastTag();
  
  if (commits.length === 0) {
    console.log('ℹ️  No new commits since last tag');
    return;
  }
  
  console.log(`Found ${commits.length} commit(s) since last tag\n`);
  
  const version = process.argv[2] || 'Unreleased';
  const date = new Date().toISOString().split('T')[0];
  
  const entry = generateChangelogEntry(version, date, commits);
  
  // Read existing changelog or create new
  let changelog = '';
  if (fs.existsSync(CHANGELOG_PATH)) {
    changelog = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  } else {
    changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
  }
  
  // Insert new entry after header
  const lines = changelog.split('\n');
  const headerEnd = lines.findIndex(line => line.startsWith('## '));
  
  if (headerEnd === -1) {
    changelog += entry;
  } else {
    lines.splice(headerEnd, 0, entry);
    changelog = lines.join('\n');
  }
  
  fs.writeFileSync(CHANGELOG_PATH, changelog);
  
  console.log(`✅ Changelog updated: ${CHANGELOG_PATH}`);
  console.log(`\nPreview:\n${entry}`);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error generating changelog:', error);
    process.exit(1);
  });
}

export { generateChangelogEntry, getCommitsSinceLastTag };
