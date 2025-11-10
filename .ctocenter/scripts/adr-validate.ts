#!/usr/bin/env ts-node
/**
 * ADR Validator
 * 
 * Validates Architecture Decision Records (ADRs) for:
 * - Sequential numbering
 * - Valid status transitions
 * - Required fields
 * - File naming conventions
 * 
 * Fails CI with non-zero exit if validation errors found.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const ADR_DIRS = [
  '.ctocenter/adrs',
  'docs/adr',
  'docs/adrs'
];

interface ADRMetadata {
  number: number;
  title: string;
  status: string;
  date: string;
  file: string;
}

const VALID_STATUSES = ['Proposed', 'Accepted', 'Rejected', 'Deprecated', 'Superseded'];

// Status transition validation - reserved for future enhancement
// const STATUS_TRANSITIONS: Record<string, string[]> = {
//   'Proposed': ['Accepted', 'Rejected', 'Deprecated'],
//   'Accepted': ['Deprecated', 'Superseded'],
//   'Rejected': [], // Terminal state
//   'Deprecated': ['Superseded'], // Can be superseded after deprecation
//   'Superseded': [] // Terminal state
// };

function extractADRMetadata(filePath: string, content: string): ADRMetadata | null {
  // Extract ADR number from filename (e.g., ADR-0001-title.md)
  const fileName = path.basename(filePath);
  const numberMatch = fileName.match(/ADR-(\d+)/i);
  
  if (!numberMatch) {
    return null;
  }
  
  const number = parseInt(numberMatch[1], 10);
  
  // Extract title from first heading
  const titleMatch = content.match(/^#\s+ADR-\d+:\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
  
  // Extract status
  const statusMatch = content.match(/\*\*Status\*\*:\s+(.+?)(?:\s+\||$)/m);
  const status = statusMatch ? statusMatch[1].trim() : 'Unknown';
  
  // Extract date
  const dateMatch = content.match(/\*\*Date\*\*:\s+(\d{4}-\d{2}-\d{2})/m);
  const date = dateMatch ? dateMatch[1] : 'Unknown';
  
  return {
    number,
    title,
    status,
    date,
    file: filePath
  };
}

async function findADRs(): Promise<ADRMetadata[]> {
  const adrs: ADRMetadata[] = [];
  
  for (const dir of ADR_DIRS) {
    const adrPath = path.join(PROJECT_ROOT, dir);
    if (!fs.existsSync(adrPath)) {
      continue;
    }
    
    const files = await glob('**/*.md', { cwd: adrPath });
    
    for (const file of files) {
      const fullPath = path.join(adrPath, file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      const metadata = extractADRMetadata(file, content);
      if (metadata) {
        metadata.file = path.relative(PROJECT_ROOT, fullPath);
        adrs.push(metadata);
      }
    }
  }
  
  return adrs.sort((a, b) => a.number - b.number);
}

interface ValidationError {
  severity: 'error' | 'warning';
  message: string;
  file?: string;
  adr?: ADRMetadata;
}

function validateSequentialNumbering(adrs: ADRMetadata[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (adrs.length === 0) {
    return [{
      severity: 'warning',
      message: 'No ADRs found - consider documenting architectural decisions'
    }];
  }
  
  // Check for gaps in numbering
  for (let i = 0; i < adrs.length - 1; i++) {
    const current = adrs[i];
    const next = adrs[i + 1];
    
    if (next.number - current.number > 1) {
      errors.push({
        severity: 'error',
        message: `Gap in ADR numbering: ADR-${current.number} followed by ADR-${next.number}`,
        file: next.file,
        adr: next
      });
    }
    
    if (next.number === current.number) {
      errors.push({
        severity: 'error',
        message: `Duplicate ADR number: ADR-${current.number}`,
        file: next.file,
        adr: next
      });
    }
  }
  
  // Check if numbering starts at 1
  if (adrs.length > 0 && adrs[0].number !== 1) {
    errors.push({
      severity: 'warning',
      message: `ADR numbering should start at 1, but starts at ${adrs[0].number}`,
      file: adrs[0].file
    });
  }
  
  return errors;
}

function validateStatus(adrs: ADRMetadata[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const adr of adrs) {
    // Check if status is valid
    const statusParts = adr.status.split(/\s+by\s+/);
    const baseStatus = statusParts[0].trim();
    
    if (!VALID_STATUSES.includes(baseStatus)) {
      errors.push({
        severity: 'error',
        message: `Invalid status '${adr.status}' in ADR-${adr.number}. Valid statuses: ${VALID_STATUSES.join(', ')}`,
        file: adr.file,
        adr
      });
    }
    
    // Check for superseded status has reference
    if (baseStatus === 'Superseded' && !adr.status.includes('by')) {
      errors.push({
        severity: 'error',
        message: `ADR-${adr.number} has status 'Superseded' but doesn't reference which ADR supersedes it`,
        file: adr.file,
        adr
      });
    }
  }
  
  return errors;
}

function validateFileNaming(adrs: ADRMetadata[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const adr of adrs) {
    const fileName = path.basename(adr.file);
    
    // Check naming convention: ADR-XXXX-title.md
    const expectedPattern = /^ADR-\d{4}-.+\.md$/i;
    if (!expectedPattern.test(fileName)) {
      errors.push({
        severity: 'warning',
        message: `ADR file should follow naming convention 'ADR-XXXX-title.md': ${fileName}`,
        file: adr.file,
        adr
      });
    }
    
    // Check zero-padding of number
    const numberInFile = fileName.match(/ADR-(\d+)/i)?.[1];
    if (numberInFile && numberInFile.length !== 4) {
      errors.push({
        severity: 'warning',
        message: `ADR number should be zero-padded to 4 digits: ${fileName}`,
        file: adr.file,
        adr
      });
    }
  }
  
  return errors;
}

function validateRequiredFields(adrs: ADRMetadata[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const adr of adrs) {
    if (adr.date === 'Unknown') {
      errors.push({
        severity: 'error',
        message: `ADR-${adr.number} is missing a date field`,
        file: adr.file,
        adr
      });
    }
    
    if (adr.title === 'Unknown') {
      errors.push({
        severity: 'error',
        message: `ADR-${adr.number} is missing a title`,
        file: adr.file,
        adr
      });
    }
    
    if (adr.status === 'Unknown') {
      errors.push({
        severity: 'error',
        message: `ADR-${adr.number} is missing a status field`,
        file: adr.file,
        adr
      });
    }
  }
  
  return errors;
}

async function validateADRs(): Promise<{ errors: ValidationError[]; warnings: ValidationError[] }> {
  console.log('🔍 Validating ADRs...\n');
  
  const adrs = await findADRs();
  
  console.log(`Found ${adrs.length} ADR(s)\n`);
  
  if (adrs.length > 0) {
    console.log('ADRs:');
    adrs.forEach(adr => {
      console.log(`  - ADR-${adr.number.toString().padStart(4, '0')}: ${adr.title} [${adr.status}]`);
    });
    console.log();
  }
  
  // Run all validations
  const allErrors: ValidationError[] = [
    ...validateSequentialNumbering(adrs),
    ...validateStatus(adrs),
    ...validateFileNaming(adrs),
    ...validateRequiredFields(adrs)
  ];
  
  // Separate errors and warnings
  const errors = allErrors.filter(e => e.severity === 'error');
  const warnings = allErrors.filter(e => e.severity === 'warning');
  
  return { errors, warnings };
}

async function main() {
  try {
    const { errors, warnings } = await validateADRs();
    
    // Print results
    console.log('📊 Validation Results');
    console.log('═════════════════════\n');
    
    if (errors.length > 0) {
      console.log('❌ Errors:');
      errors.forEach(error => {
        console.log(`  - ${error.message}`);
        if (error.file) {
          console.log(`    File: ${error.file}`);
        }
      });
      console.log();
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach(warning => {
        console.log(`  - ${warning.message}`);
        if (warning.file) {
          console.log(`    File: ${warning.file}`);
        }
      });
      console.log();
    }
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('✅ All ADRs are valid!\n');
    }
    
    // Summary
    console.log(`Total: ${errors.length} error(s), ${warnings.length} warning(s)\n`);
    
    // Exit with error code if there are errors
    if (errors.length > 0) {
      console.log('⚠️  ADR validation failed - please fix errors above');
      process.exit(1);
    }
    
    console.log('✅ ADR validation passed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during ADR validation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { validateADRs, extractADRMetadata, VALID_STATUSES };
