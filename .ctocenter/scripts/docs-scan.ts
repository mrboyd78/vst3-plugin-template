#!/usr/bin/env ts-node
/**
 * Documentation Drift Scanner
 * 
 * Scans the repository to detect misalignment between:
 * - Code structure and documentation
 * - API changes and reference docs
 * - Configuration changes and guides
 * 
 * Outputs machine-readable JSON and fails with non-zero exit if drift detected.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface ProjectMap {
  timestamp: string;
  repository: any;
  structure: any;
  apis: any;
  documentation: any;
}

interface DriftSignal {
  timestamp: string;
  drift_detected: boolean;
  signals: {
    documentation: {
      status: string;
      last_check: string;
      issues: string[];
    };
    api_changes: {
      status: string;
      last_check: string;
      changes: string[];
    };
    dependencies: {
      status: string;
      last_check: string;
      outdated: string[];
    };
    governance: {
      status: string;
      last_check: string;
      missing_adrs: string[];
      missing_runbooks: string[];
      missing_playbooks: string[];
    };
  };
  recommendations: Array<{
    priority: string;
    category: string;
    message: string;
    action: string;
  }>;
}

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const STATE_DIR = path.join(PROJECT_ROOT, '.ctocenter/state');
const PROJECT_MAP_PATH = path.join(STATE_DIR, 'project-map.json');
const SIGNALS_PATH = path.join(STATE_DIR, 'signals.json');

async function loadProjectMap(): Promise<ProjectMap> {
  const content = fs.readFileSync(PROJECT_MAP_PATH, 'utf-8');
  return JSON.parse(content);
}

async function scanCodeStructure(): Promise<{ files: string[]; headers: string[]; sources: string[] }> {
  const headers = await glob('include/**/*.h', { cwd: PROJECT_ROOT });
  const sources = await glob('source/**/*.cpp', { cwd: PROJECT_ROOT });
  return {
    files: [...headers, ...sources],
    headers,
    sources
  };
}

async function scanDocumentation(): Promise<string[]> {
  const docs = await glob('docs/**/*.md', { cwd: PROJECT_ROOT });
  const rootDocs = await glob('*.md', { cwd: PROJECT_ROOT });
  return [...docs, ...rootDocs];
}

async function detectAPIDrift(projectMap: ProjectMap): Promise<string[]> {
  const changes: string[] = [];
  
  // Check if documented APIs still exist
  const apis = projectMap.apis?.public || {};
  
  for (const [apiName, apiInfo] of Object.entries(apis) as [string, any][]) {
    const filePath = path.join(PROJECT_ROOT, apiInfo.file);
    if (!fs.existsSync(filePath)) {
      changes.push(`API file missing: ${apiInfo.file} (${apiName})`);
    }
  }
  
  // Check for new header files not in project map
  const codeStructure = await scanCodeStructure();
  const mappedHeaders = new Set(
    Object.values(apis).map((api: any) => api.file)
  );
  
  for (const header of codeStructure.headers) {
    if (!mappedHeaders.has(header) && !header.includes('test')) {
      changes.push(`New header file not documented: ${header}`);
    }
  }
  
  return changes;
}

async function detectDocumentationDrift(projectMap: ProjectMap): Promise<string[]> {
  const issues: string[] = [];
  
  const expectedDocs = projectMap.documentation || {};
  
  // Check if expected documentation files exist
  for (const [docType, docPath] of Object.entries(expectedDocs)) {
    const fullPath = path.join(PROJECT_ROOT, docPath as string);
    if (!fs.existsSync(fullPath)) {
      issues.push(`Missing expected documentation: ${docPath} (${docType})`);
    }
  }
  
  // Check for outdated documentation (simple heuristic: last modified > 90 days)
  const docs = await scanDocumentation();
  const now = Date.now();
  const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
  
  for (const doc of docs) {
    const fullPath = path.join(PROJECT_ROOT, doc);
    const stats = fs.statSync(fullPath);
    if (stats.mtimeMs < ninetyDaysAgo) {
      // Check if related code files were modified more recently
      const relatedCode = await glob('source/**/*.cpp', { cwd: PROJECT_ROOT });
      for (const code of relatedCode) {
        const codeStats = fs.statSync(path.join(PROJECT_ROOT, code));
        if (codeStats.mtimeMs > stats.mtimeMs) {
          issues.push(`Documentation may be outdated: ${doc} (code modified more recently)`);
          break;
        }
      }
    }
  }
  
  return issues;
}

async function detectGovernanceDrift(): Promise<{
  missing_adrs: string[];
  missing_runbooks: string[];
  missing_playbooks: string[];
}> {
  const missing_adrs: string[] = [];
  const missing_runbooks: string[] = [];
  const missing_playbooks: string[] = [];
  
  // Check for ADRs (optional - warn if none exist)
  const adrPattern = '.ctocenter/adrs/**/*.md';
  const adrs = await glob(adrPattern, { cwd: PROJECT_ROOT });
  if (adrs.length === 0) {
    missing_adrs.push('No ADRs found - consider documenting architectural decisions');
  }
  
  // Check for runbooks (optional)
  const runbookPattern = '.ctocenter/runbooks/**/*.md';
  const runbooks = await glob(runbookPattern, { cwd: PROJECT_ROOT });
  if (runbooks.length === 0) {
    missing_runbooks.push('No runbooks found - consider creating operational procedures');
  }
  
  // Check for playbooks (optional)
  const playbookPattern = '.ctocenter/playbooks/**/*.md';
  const playbooks = await glob(playbookPattern, { cwd: PROJECT_ROOT });
  if (playbooks.length === 0) {
    missing_playbooks.push('No playbooks found - consider documenting processes');
  }
  
  return { missing_adrs, missing_runbooks, missing_playbooks };
}

async function detectDependencyDrift(): Promise<string[]> {
  const outdated: string[] = [];
  
  // Check CMakeLists.txt for JUCE version
  const cmakePath = path.join(PROJECT_ROOT, 'CMakeLists.txt');
  if (fs.existsSync(cmakePath)) {
    const content = fs.readFileSync(cmakePath, 'utf-8');
    
    // Simple check: warn if JUCE_DIR is hardcoded to specific path
    if (content.includes('JUCE_DIR') && content.includes('C:/Users/')) {
      outdated.push('CMakeLists.txt contains hardcoded JUCE_DIR path - should be configurable');
    }
  }
  
  return outdated;
}

async function generateSignals(): Promise<DriftSignal> {
  console.log('🔍 Scanning for documentation drift...\n');
  
  const projectMap = await loadProjectMap();
  const timestamp = new Date().toISOString();
  
  // Detect all types of drift
  const apiChanges = await detectAPIDrift(projectMap);
  const docIssues = await detectDocumentationDrift(projectMap);
  const governance = await detectGovernanceDrift();
  const depOutdated = await detectDependencyDrift();
  
  const driftDetected = 
    apiChanges.length > 0 || 
    docIssues.length > 0 || 
    depOutdated.length > 0;
  
  // Build recommendations
  const recommendations: DriftSignal['recommendations'] = [];
  
  if (apiChanges.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'api',
      message: `Detected ${apiChanges.length} API changes not reflected in documentation`,
      action: 'Update project-map.json and API reference documentation'
    });
  }
  
  if (docIssues.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'documentation',
      message: `Found ${docIssues.length} documentation issues`,
      action: 'Review and update outdated or missing documentation'
    });
  }
  
  if (governance.missing_adrs.length > 0) {
    recommendations.push({
      priority: 'low',
      category: 'governance',
      message: 'No ADRs found',
      action: 'Consider documenting architectural decisions using ADR templates'
    });
  }
  
  const signals: DriftSignal = {
    timestamp,
    drift_detected: driftDetected,
    signals: {
      documentation: {
        status: docIssues.length === 0 ? 'aligned' : 'drift-detected',
        last_check: timestamp,
        issues: docIssues
      },
      api_changes: {
        status: apiChanges.length === 0 ? 'stable' : 'changes-detected',
        last_check: timestamp,
        changes: apiChanges
      },
      dependencies: {
        status: depOutdated.length === 0 ? 'current' : 'outdated',
        last_check: timestamp,
        outdated: depOutdated
      },
      governance: {
        status: 'active',
        last_check: timestamp,
        missing_adrs: governance.missing_adrs,
        missing_runbooks: governance.missing_runbooks,
        missing_playbooks: governance.missing_playbooks
      }
    },
    recommendations
  };
  
  return signals;
}

async function main() {
  try {
    const signals = await generateSignals();
    
    // Save signals
    fs.writeFileSync(SIGNALS_PATH, JSON.stringify(signals, null, 2));
    
    // Print summary
    console.log('📊 Drift Detection Summary');
    console.log('═══════════════════════════\n');
    
    console.log(`Drift Detected: ${signals.drift_detected ? '❌ YES' : '✅ NO'}\n`);
    
    console.log('Documentation:', signals.signals.documentation.status);
    if (signals.signals.documentation.issues.length > 0) {
      signals.signals.documentation.issues.forEach(issue => {
        console.log(`  - ${issue}`);
      });
    }
    
    console.log('\nAPI Changes:', signals.signals.api_changes.status);
    if (signals.signals.api_changes.changes.length > 0) {
      signals.signals.api_changes.changes.forEach(change => {
        console.log(`  - ${change}`);
      });
    }
    
    console.log('\nDependencies:', signals.signals.dependencies.status);
    if (signals.signals.dependencies.outdated.length > 0) {
      signals.signals.dependencies.outdated.forEach(dep => {
        console.log(`  - ${dep}`);
      });
    }
    
    console.log('\nGovernance:', signals.signals.governance.status);
    if (signals.signals.governance.missing_adrs.length > 0) {
      console.log('  ADRs:', signals.signals.governance.missing_adrs[0]);
    }
    if (signals.signals.governance.missing_runbooks.length > 0) {
      console.log('  Runbooks:', signals.signals.governance.missing_runbooks[0]);
    }
    if (signals.signals.governance.missing_playbooks.length > 0) {
      console.log('  Playbooks:', signals.signals.governance.missing_playbooks[0]);
    }
    
    if (signals.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      signals.recommendations.forEach(rec => {
        console.log(`  [${rec.priority.toUpperCase()}] ${rec.message}`);
        console.log(`       → ${rec.action}`);
      });
    }
    
    console.log(`\n✅ Signals saved to: ${SIGNALS_PATH}`);
    
    // Exit with error code if drift detected
    if (signals.drift_detected) {
      console.log('\n⚠️  Drift detected - please address issues above');
      process.exit(1);
    }
    
    console.log('\n✅ No drift detected - documentation is aligned');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during drift detection:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { generateSignals, detectAPIDrift, detectDocumentationDrift };
