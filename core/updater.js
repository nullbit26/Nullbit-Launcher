/**
 * NULLBIT Standalone Updater
 * Run this separately: node updater.js <parentPid> <currentExe> <newExe>
 * NO EXTERNAL DEPENDENCIES - only built-in Node modules
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');

const parentPid = parseInt(process.argv[2]);
const currentExe = process.argv[3];
const newExe = process.argv[4];
const logFile = path.join(os.tmpdir(), 'nullbit-updater.log');

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(logFile, line);
  console.log(line.trim());
}

async function waitForProcess(pid, maxSeconds = 10) {
  const start = Date.now();
  while (Date.now() - start < maxSeconds * 1000) {
    try {
      // Check if process exists (Windows)
      const check = spawn('tasklist', ['/FI', `PID eq ${pid}`, '/NH']);
      let output = '';
      check.stdout.on('data', d => output += d.toString());
      await new Promise(r => check.on('close', r));
      
      if (!output.includes(pid.toString())) {
        return true; // Process not found = exited
      }
    } catch (e) {
      // Ignore errors, assume process is gone
      return true;
    }
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  log('=== NULLBIT UPDATER STARTED ===');
  log(`Process.argv: ${JSON.stringify(process.argv)}`);
  log(`Parent PID: ${parentPid} (type: ${typeof parentPid})`);
  log(`Current: ${currentExe}`);
  log(`New: ${newExe}`);
  log(`CWD: ${process.cwd()}`);
  log(`Node version: ${process.version}`);

  // Validate arguments
  if (!parentPid || isNaN(parentPid)) {
    log('ERROR: Invalid parent PID');
    process.exit(1);
  }
  if (!currentExe || !fs.existsSync(currentExe)) {
    log(`ERROR: Current exe not found: ${currentExe}`);
    process.exit(1);
  }
  if (!newExe || !fs.existsSync(newExe)) {
    log(`ERROR: New exe not found: ${newExe}`);
    process.exit(1);
  }

  // Wait for parent to exit
  log('Waiting for parent to exit...');
  const exited = await waitForProcess(parentPid, 15);
  
  if (!exited) {
    log('WARNING: Parent did not exit in time, forcing kill...');
    try {
      spawn('taskkill', ['/F', '/PID', parentPid.toString()]);
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      log(`Kill error: ${e.message}`);
    }
  }

  const tempOld = currentExe + '.old';

  try {
    // Remove old backup
    if (fs.existsSync(tempOld)) {
      log('Removing old backup...');
      fs.unlinkSync(tempOld);
    }

    // Rename current to .old
    log('Renaming current to .old...');
    fs.renameSync(currentExe, tempOld);

    // Move new to current location
    log('Moving new exe...');
    fs.renameSync(newExe, currentExe);

    // Verify
    if (!fs.existsSync(currentExe)) {
      throw new Error('New exe not found after move!');
    }

    // Start new launcher
    log('Starting new launcher...');
    const child = spawn(currentExe, [], {
      detached: true,
      stdio: 'ignore',
      windowsHide: false
    });
    child.unref();

    log(`New launcher PID: ${child.pid}`);
    log('=== UPDATE COMPLETE ===');

    // Cleanup old after delay
    setTimeout(() => {
      try {
        if (fs.existsSync(tempOld)) {
          fs.unlinkSync(tempOld);
          log('Old version cleaned up');
        }
      } catch (e) {
        log(`Cleanup error: ${e.message}`);
      }
    }, 5000);

  } catch (e) {
    log(`CRITICAL ERROR: ${e.message}`);
    // Try to rollback
    try {
      if (!fs.existsSync(currentExe) && fs.existsSync(tempOld)) {
        log('Attempting rollback...');
        fs.renameSync(tempOld, currentExe);
        log('Rollback successful');
      }
    } catch (rollbackErr) {
      log(`Rollback failed: ${rollbackErr.message}`);
    }
  }

  // Exit updater
  setTimeout(() => process.exit(0), 1000);
}

main().catch(e => {
  console.error('Updater crashed:', e);
  process.exit(1);
});
