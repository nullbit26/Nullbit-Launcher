/**
 * NULLBIT Launcher — Renderer logic
 */

// ────────────────────────────────────────────
//  Click glitch ripple
// ────────────────────────────────────────────
const RIPPLE_CHARS = '0123456789ABCDEF#@!%&*';

let lastRipple = 0;
document.addEventListener('click', (e) => {
  // 10/10 premium glitch on all buttons
  const btn = e.target.closest('button, .btn-launch, .btn-clear, .btn-log-action, .btn-save, .btn-action');
  if (btn && btn.textContent.trim() && btn.id !== 'btn-launch') {
    applyGlitchEffect(btn);
  }
  if (e.target.closest('.log-resize-handle, .log-box, input, textarea, select')) return;
  const now = Date.now();
  if (now - lastRipple < 150) return;
  lastRipple = now;
  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX + (Math.random() - 0.5) * 28}px;
      top: ${e.clientY + (Math.random() - 0.5) * 28}px;
      font-family: 'Courier New', monospace;
      font-size: ${10 + Math.floor(Math.random() * 6)}px;
      color: #ff0000;
      text-shadow: 0 0 8px rgba(255,0,0,1), 0 0 14px rgba(255,0,0,0.6);
      pointer-events: none;
      z-index: 99999;
      letter-spacing: 2px;
      transform: translate(-50%, -50%);
      white-space: nowrap;
    `;
    el.textContent = Array.from({length: 2 + Math.floor(Math.random()*2)},
      () => RIPPLE_CHARS[Math.floor(Math.random() * RIPPLE_CHARS.length)]).join('');
    document.body.appendChild(el);

    let ticks = 0;
    const maxTicks = 6 + Math.floor(Math.random() * 5);
    const iv = setInterval(() => {
      if (!el.isConnected) { clearInterval(iv); return; }
      ticks++;
      el.textContent = Array.from({length: 2 + Math.floor(Math.random()*2)},
        () => RIPPLE_CHARS[Math.floor(Math.random() * RIPPLE_CHARS.length)]).join('');
      const progress = ticks / maxTicks;
      el.style.opacity = (1 - progress).toFixed(2);
      el.style.transform = `translate(-50%, calc(-50% - ${progress * 18}px))`;
      if (ticks >= maxTicks) { clearInterval(iv); el.remove(); }
    }, 40 + Math.floor(Math.random() * 20));
  }
});

// ────────────────────────────────────────────
//  Boot sequence
// ────────────────────────────────────────────
const BOOT_SEQUENCE = [
  { text: 'NULLBIT SYSTEMS v3.0 — INITIALIZING...', cls: 'log-sys',  pause: 0   },
  { text: 'LOADING TACTICAL ENGINE..................OK', cls: 'log-raw', pause: 280 },
  { text: 'CHECKING LICENSE MODULE..................OK', cls: 'log-raw', pause: 280 },
  { text: '[ SYSTEM READY ]', cls: 'log-ok',  pause: 260 },
  { text: 'NULLBIT LAUNCHER READY', cls: 'log-sys',  pause: 200 },
];

function typeLogLine(text, cls, cb, pendingDiv) {
  const box = logBox();
  const div = pendingDiv || document.createElement('div');
  if (!pendingDiv) {
    div.className = 'log-line ' + cls;
    box.appendChild(div);
  }
  box.scrollTop = box.scrollHeight;
  let i = 0;
  const iv = setInterval(() => {
    div.textContent = text.slice(0, i + 1);
    box.scrollTop = box.scrollHeight;
    i++;
    if (i >= text.length) { clearInterval(iv); if (cb) setTimeout(cb, 80); }
  }, 28);
  return div;
}

function runBootSequence() {
  const box = logBox();
  let idx = 0;
  let firstDiv = null;

  function next() {
    if (idx >= BOOT_SEQUENCE.length) {
      // Remove dots from first line (initializing done)
      if (firstDiv) firstDiv.querySelectorAll('.sys-dot').forEach(d => d.remove());
      return;
    }
    const { text, cls, pause } = BOOT_SEQUENCE[idx++];
    setTimeout(() => {
      if (idx === 1) {
        // First line — add animated dots after typing
        const div = document.createElement('div');
        div.className = 'log-line ' + cls;
        div.dataset.pending = '1';
        box.appendChild(div);
        firstDiv = div;
        let i = 0;
        const clean = text.replace(/\.+$/, '');
        const iv = setInterval(() => {
          div.textContent = clean.slice(0, i + 1);
          box.scrollTop = box.scrollHeight;
          i++;
          if (i >= clean.length) {
            clearInterval(iv);
            div.innerHTML = clean + '<span class="sys-dot d1">.</span><span class="sys-dot d2">.</span><span class="sys-dot d3">.</span>';
            setTimeout(next, 80);
          }
        }, 28);
      } else {
        typeLogLine(text, cls, next);
      }
    }, pause);
  }
  next();
}

// ────────────────────────────────────────────
//  Dynamic background tickers
// ────────────────────────────────────────────
const TICKER_TEXTS = [
  '1·0·1·1·0·0·1·0·...·1·1·0·1·0·0·1·...·1·0·1·0·1·0·1·...·1·0·0·1·0·1·1·0·...·1·0·0·1·1·0·1·0',
  '0xA3F2·····0x1C8E·····0xFF20·····0xDEAD·····0xBEEF·····0xC0DE·····0xF00D·····0xA3F2·····0x1C8E',
  '·01··00··11··10··01·····11··00··10··01·····00··11··10··01··11·····00··10··01··00··11·····10·',
  'THREAT···0.000···SURVIVAL···0.000···RESOURCE···0.000···NAV=NULL···PVP=NULL···CORE=STANDBY',
  '·1·0·1·1·0·0·1·0·1·1·0·1·0·0·1·1·0·1·0·1·0·1·0·1·1·0·0·1·0·1·1·0·1·0·0·1·1·0·1·0·1·1·',
  'SYS···0xNULL···ERR=0···WARN=0···OK=0···UPTIME=00:00···MEM=0KB···CPU=0%···PING=0ms',
  '0xFF···0x00···0xA1···0xB2···0xC3···0xD4···0xE5···0xF6···0x07···0x18···0x29···0x3A',
  '........·........·........·........·........·........·........·........·........',
  '· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·',
  '▪ · · ▪ · · · ▪ · · ▪ · ▪ · · · ▪ · · · ▪ · ▪ · · ▪ · · · ▪ · · ▪ · · ▪ · · ·',
];
const TICKER_COLORS = [
  'rgba(192,57,43,0.30)', 'rgba(192,57,43,0.22)', 'rgba(192,57,43,0.18)',
  'rgba(192,57,43,0.26)', 'rgba(192,57,43,0.14)', 'rgba(192,57,43,0.20)',
  'rgba(220,50,50,0.28)', 'rgba(180,40,40,0.16)', 'rgba(200,60,60,0.24)',
];

let tickersActivated = false;
function activateTickers() {
  if (tickersActivated) return;
  tickersActivated = true;
  const overlay = document.getElementById('log-ticker-overlay');
  if (overlay) overlay.classList.add('active');
}

function buildTickers() {
  const overlay = document.getElementById('log-ticker-overlay');
  if (!overlay) return;
  overlay.innerHTML = '';
  const count = 20;
  const maxTop = 560;
  for (let i = 0; i < count; i++) {
    const text  = TICKER_TEXTS[Math.floor(Math.random() * TICKER_TEXTS.length)];
    const color = TICKER_COLORS[Math.floor(Math.random() * TICKER_COLORS.length)];
    const top   = Math.floor(Math.random() * maxTop);
    const dur   = (8 + Math.random() * 12).toFixed(1);
    const delay = -(Math.random() * 14).toFixed(1);
    const isDot = text.includes('▪') || text.startsWith('·') || text.startsWith('.');
    const div = document.createElement('div');
    div.className = 'log-bg-ticker' + (isDot ? ' dot-line' : '');
    div.style.cssText = `color:${color};top:${top}px;animation-duration:${dur}s;animation-delay:${delay}s`;
    const span = document.createElement('span');
    span.style.cssText = `animation-duration:${dur}s;animation-delay:${delay}s`;
    span.textContent = text;
    div.appendChild(span);
    overlay.appendChild(div);

    // Live char flicker
    const HEX = '0123456789ABCDEF';
    setInterval(() => {
      if (!span.isConnected) return;
      const arr = text.split('');
      const idx = Math.floor(Math.random() * arr.length);
      if (arr[idx] !== ' ' && arr[idx] !== '·' && arr[idx] !== '▪' && arr[idx] !== '.') {
        arr[idx] = HEX[Math.floor(Math.random() * 16)];
        span.textContent = arr.join('');
        setTimeout(() => { if (span.isConnected) span.textContent = text; }, 90);
      }
    }, 500 + Math.random() * 1200);
  }
}

// ────────────────────────────────────────────
//  Log resize
// ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runBootSequence();
  buildTickers();
  setInterval(buildTickers, 30000);

  const handle = document.getElementById('log-resize');
  const box    = document.getElementById('log-box');
  if (!handle || !box) return;
  let dragging = false, startY = 0, startH = 0;
  handle.addEventListener('mousedown', e => {
    dragging = true;
    startY = e.clientY;
    startH = box.offsetHeight;
    document.body.style.cursor = 'ns-resize';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const newH = Math.max(80, Math.min(600, startH + (e.clientY - startY)));
    box.style.height = newH + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (dragging) buildTickers();
    dragging = false;
    document.body.style.cursor = '';
  });
});

// ────────────────────────────────────────────
//  Tab switching
// ────────────────────────────────────────────
const NAV_GLITCH_CHARS = '!@#$%^&*<>[]{}|\\/?~';
// 10/10 premium glitch effect - instant restart, wave infection, smooth decay
function applyGlitchEffect(el) {
  const span = el.querySelector('span') || el;
  const original = span.dataset.original || (span.dataset.original = span.textContent);
  // Clear all pending animations
  if (span._restoreTimeout) clearTimeout(span._restoreTimeout);
  if (span._restoreInterval) clearInterval(span._restoreInterval);
  if (span._buildInterval) clearInterval(span._buildInterval);
  // 10/10: instant full glitch reset - no smooth transition, pure chaos
  const chars = original.split('');
  const glitched = chars.map(c => c === ' ' ? ' ' : NAV_GLITCH_CHARS[Math.floor(Math.random() * NAV_GLITCH_CHARS.length)]);
  let infected = 0;
  const nonSpaceCount = chars.filter(c => c !== ' ').length;
  // Hard glitch flash on start
  span.textContent = glitched.join('');
  span.style.textShadow = '4px 0 rgba(255,0,0,1), -4px 0 rgba(0,200,255,0.9)';
  setTimeout(() => {
    span._buildInterval = setInterval(() => {
      infected++;
      const revealCount = Math.floor((infected / 5) * nonSpaceCount);
      span.textContent = chars.map((c, i) => {
        if (c === ' ') return ' ';
        const charIndex = chars.slice(0, i).filter(x => x !== ' ').length;
        return charIndex < revealCount ? glitched[i] : c;
      }).join('');
      span.style.textShadow = `${Math.min(infected, 4)}px 0 rgba(255,0,0,0.95), -${Math.min(infected, 4)}px 0 rgba(0,200,255,0.85)`;
      if (infected >= 5) {
        clearInterval(span._buildInterval);
        span._buildInterval = null;
        // Hold full glitch, wait for clicks to stop
        span._restoreTimeout = setTimeout(() => {
          // Premium decay: characters restore one by one with random glitch flickers
          let restored = 0;
          const totalSteps = chars.length * 2; // Each char gets 2 chances before restoring
          span._restoreInterval = setInterval(() => {
            restored++;
            const progress = restored / totalSteps;
            if (restored >= totalSteps) {
              span.textContent = original;
              span.style.textShadow = '';
              clearInterval(span._restoreInterval);
              span._restoreInterval = null;
              return;
            }
            // Wave restoration with occasional glitch flickers
            span.textContent = chars.map((c, i) => {
              if (c === ' ') return ' ';
              const charProgress = (restored - i * 0.3) / (totalSteps * 0.7);
              if (charProgress > 1) return c; // Fully restored
              if (charProgress < 0) {
                // Still glitched
                return Math.random() < 0.8 ? glitched[i] : NAV_GLITCH_CHARS[Math.floor(Math.random() * NAV_GLITCH_CHARS.length)];
              }
              // Transition zone: flicker between glitch and original
              const flickerProb = 0.6 - charProgress * 0.5;
              return Math.random() < flickerProb
                ? NAV_GLITCH_CHARS[Math.floor(Math.random() * NAV_GLITCH_CHARS.length)]
                : c;
            }).join('');
            const shadowIntensity = Math.max(0, 1 - progress * 1.4);
            span.style.textShadow = shadowIntensity > 0
              ? `${Math.round(shadowIntensity * 4)}px 0 rgba(255,0,0,${shadowIntensity}), -${Math.round(shadowIntensity * 4)}px 0 rgba(0,200,255,${shadowIntensity * 0.8})`
              : '';
          }, 25);
        }, 180); // 180ms hold before starting restore
      }
    }, 28);
  }, 30); // Brief flash before wave starts
}

function _doSwitchTab(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  applyGlitchEffect(el);
  const target = document.getElementById('tab-' + el.dataset.tab);
  if (target) {
    target.classList.add('active', 'tab-enter');
    requestAnimationFrame(() => requestAnimationFrame(() => target.classList.remove('tab-enter')));
  }
  // Take snapshot of Neural fields when ENTERING Neural tab
  if (el.dataset.tab === 'neural') {
    _neuralSnapshot = {};
    // NEURAL_ID_MAP may not exist yet if called early; guard with typeof
    if (typeof NEURAL_ID_MAP !== 'undefined') {
      Object.keys(NEURAL_ID_MAP).forEach(elId => {
        const fld = document.getElementById(elId);
        if (fld) _neuralSnapshot[elId] = fld.value;
      });
    }
    // also snapshot active preset card
    const activeCard = document.querySelector('.preset-card.active');
    _neuralSnapshot.__activePreset = activeCard ? activeCard.id.replace('preset-', '') : null;
    _neuralDirty = false;
    _updateNeuralDirty();
  }
  // Keep core group open if config or neural is active
  _syncCoreAccordion(el.dataset.tab);
}

function _syncCoreAccordion(tabName) {
  const group = document.getElementById('nav-group-core');
  if (!group) return;
  if (botRunning || tabName === 'config' || tabName === 'neural') {
    group.classList.add('open');
  } else {
    group.classList.remove('open');
  }
}

function toggleCoreAccordion(e) {
  const group = document.getElementById('nav-group-core');
  if (!group) return;
  group.classList.toggle('open');
  e.stopPropagation();
}

function switchTab(el) {
  const currentTab = document.querySelector('.nav-item.active');
  const leavingNeural = currentTab && currentTab.dataset.tab === 'neural';
  if (leavingNeural && _neuralDirty && el.dataset.tab !== 'neural') {
    _showNeuralGuard(el);
    return;
  }
  // If clicking CORE ACCESS header — also toggle accordion
  if (el.dataset.tab === 'config') {
    const group = document.getElementById('nav-group-core');
    if (group) group.classList.add('open');
  }
  _doSwitchTab(el);
}

function _showNeuralGuard(pendingEl) {
  const overlay = document.getElementById('neural-guard-overlay');
  const saveBtn = document.getElementById('ngm-save-btn');
  const discardBtn = document.getElementById('ngm-discard-btn');
  const ver = document.getElementById('ngm-version');
  if (!overlay || !saveBtn || !discardBtn) return;
  if (ver && _config) ver.textContent = _config.bot_version || _config.version || '?';

  // Use snapshot taken at Neural tab entry (before any preset changes)
  const snapshot = { ..._neuralSnapshot };

  // Remove ALL previous listeners by replacing nodes with clones
  const newSaveBtn = saveBtn.cloneNode(true);
  const newDiscardBtn = discardBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
  discardBtn.parentNode.replaceChild(newDiscardBtn, discardBtn);

  // re-trigger animation
  overlay.style.display = 'none';
  void overlay.offsetWidth;
  overlay.style.display = 'block';

  const onSave = async () => {
    cleanup();
    await saveNeuralConfig();
    _doSwitchTab(pendingEl);
  };
  const onDiscard = () => {
    cleanup();
    // restore snapshot — undo all preset/field changes made during this session
    Object.entries(snapshot).forEach(([elId, val]) => {
      if (elId === '__activePreset') return;
      const fld = document.getElementById(elId);
      if (fld) fld.value = val;
    });
    // restore active preset card highlight
    document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
    if (snapshot.__activePreset) {
      const card = document.getElementById('preset-' + snapshot.__activePreset);
      if (card) card.classList.add('active');
    }
    // also roll back _config.neural in memory so stale values aren't saved later
    if (_config && typeof NEURAL_ID_MAP !== 'undefined') {
      _config.neural = _config.neural || {};
      Object.entries(NEURAL_ID_MAP).forEach(([elId, key]) => {
        const val = snapshot[elId];
        if (val !== undefined) {
          const v = parseFloat(val);
          _config.neural[key] = Number.isFinite(v) ? v : val;
        }
      });
    }
    _syncTuningFromAdvanced();
    _neuralDirty = false;
    _updateNeuralDirty();
    _doSwitchTab(pendingEl);
  };
  const onOverlay = (e) => {
    if (e.target === overlay) onDiscard();
  };

  function cleanup() {
    overlay.style.display = 'none';
    document.getElementById('ngm-save-btn').removeEventListener('click', onSave);
    document.getElementById('ngm-discard-btn').removeEventListener('click', onDiscard);
    overlay.removeEventListener('click', onOverlay);
  }

  document.getElementById('ngm-save-btn').addEventListener('click', onSave);
  document.getElementById('ngm-discard-btn').addEventListener('click', onDiscard);
  overlay.addEventListener('click', onOverlay);
}

// ────────────────────────────────────────────
//  Log helpers
// ────────────────────────────────────────────
const LOG_MAX = 300;
const logBox = () => document.getElementById('log-box');

// Strip ANSI escape codes
function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*[mGKHF]/g, '')
            .replace(/\[\d+m/g, '');
}

// Random glitch char substitution for raw lines
const GLITCH_CHARS = ['#','@','_','!','?','█','▓','▒','░','$','%','&'];
function glitchify(text, intensity = 0.08) {
  return text.split('').map(c => {
    if (c === ' ' || Math.random() > intensity) return c;
    return Math.random() < 0.5 ? GLITCH_CHARS[Math.floor(Math.random()*GLITCH_CHARS.length)] : c;
  }).join('');
}

// Clean up bot output lines for display
function transformLine(line) {
  // Replace title line
  line = line.replace(/AI\s*Bot\s*[-–]?\s*License\s*Verification/i, 'ACCESSING AI CORE AUTHORIZATION...');
  // Replace box-drawing chars with styled equivalents
  line = line.replace(/[\u2500-\u257F\u2550-\u256C]+/g, s => '─'.repeat(Math.min(s.length, 40)));
  // Replace emoji/icons with ASCII tags
  line = line.replace(/✓|✅/g, '[OK]');
  line = line.replace(/✗|❌|✘|×/g, '[!!]');
  line = line.replace(/⚠|⚠️/g, '[!!]');
  line = line.replace(/📄|📁|📂|🗂/g, '[FILE]');
  line = line.replace(/[^\x00-\x7F\u2500-\u257F\u2550-\u256C\u2588-\u259F]/g, '');
  return line.trim();
}

function appendLog(text, cls = 'log-raw') {
  hideIdleOverlay();
  const box = logBox();
  const lines = stripAnsi(text).split('\n').filter(l => l.trim());
  lines.forEach(rawLine => {
    const line = transformLine(rawLine);
    if (!line) return;
    const lineClass = classifyLine(line, cls);
    const div = document.createElement('div');
    div.className = 'log-line ' + lineClass;

    const isLicenseFailed = /license.*fail|fail.*license/i.test(line);
    const isAuthLine = /ACCESSING AI CORE/i.test(line);

    if (isLicenseFailed) {
      div.className = 'log-line log-license-fail';
      div.textContent = '[ !! ] ' + line.replace(/^\[!!\]\s*/,'');
      // Aggressive glitch loop
      const orig = div.textContent;
      const iv = setInterval(() => {
        if (!div.isConnected) { clearInterval(iv); return; }
        div.textContent = glitchify(orig, 0.18);
        setTimeout(() => { if (div.isConnected) div.textContent = orig; }, 80);
      }, 400 + Math.random() * 300);
    } else if (isAuthLine) {
      div.className = 'log-line log-auth';
      // Remove dots from ALL previous pending/auth lines (real terminal behavior)
      box.querySelectorAll('.log-line.log-auth, .log-line[data-pending]').forEach(prev => {
        if (prev !== div) {
          // Remove dots completely, keep only clean text
          const text = prev.textContent.replace(/\.+$/, '');
          prev.textContent = text;
          prev.querySelectorAll('.auth-dot, .sys-dot').forEach(d => d.remove());
          delete prev.dataset.pending;
        }
      });
      // Add dots only to current (active) line
      const clean = line.replace(/\.+$/, '');
      div.innerHTML = clean + '<span class="auth-dot d1">.</span><span class="auth-dot d2">.</span><span class="auth-dot d3">.</span>';
    } else if (lineClass === 'log-raw') {
      div.textContent = glitchify(line, 0.04);
      const orig = line;
      const iv = setInterval(() => {
        if (!div.isConnected) { clearInterval(iv); return; }
        div.textContent = glitchify(orig, 0.04);
        setTimeout(() => { if (div.isConnected) div.textContent = orig; }, 120);
      }, 2000 + Math.random() * 2000);
    } else if (/\.{2,}$/.test(line)) {
      const clean = line.replace(/\.+$/, '');
      // New pending line — remove dots from ALL previous pending lines (real terminal)
      box.querySelectorAll('.log-line[data-pending], .log-line.log-auth').forEach(prev => {
        if (prev !== div) {
          // Remove dots completely, keep clean text
          const text = prev.textContent.replace(/\.+$/, '');
          prev.textContent = text;
          prev.querySelectorAll('.sys-dot, .auth-dot').forEach(d => d.remove());
          delete prev.dataset.pending;
        }
      });
      div.dataset.pending = '1';
      div.innerHTML = clean + '<span class="sys-dot d1">.</span><span class="sys-dot d2">.</span><span class="sys-dot d3">.</span>';
    } else {
      // Any non-pending line completes the last pending operation (real terminal behavior)
      const allPending = box.querySelectorAll('.log-line[data-pending]');
      if (allPending.length) {
        const last = allPending[allPending.length - 1];
        const text = last.textContent.replace(/\.+$/, '');
        last.textContent = text;
        last.querySelectorAll('.sys-dot, .auth-dot').forEach(d => d.remove());
        delete last.dataset.pending;
      }
      // Also handle explicit OK/ERR markers
      if (/\[\s*OK\s*\]|\[\s*ERR\s*\]/i.test(line)) {
        // Already handled above, but keep regex for any edge cases
      }
      div.textContent = line;
    }
    box.appendChild(div);
    logLineCount++;
  });
  while (box.children.length > LOG_MAX) box.removeChild(box.firstChild);
  if (autoScroll) box.scrollTop = box.scrollHeight;
  updateLogCounter();
}

function classifyLine(line, fallback) {
  if (/\[ OK \]/i.test(line))   return 'log-ok';
  if (/\[ ERR \]/i.test(line))  return 'log-err';
  if (/\[ SYS \]/i.test(line))  return 'log-sys';
  if (/\[ WARN \]/i.test(line)) return 'log-warn';
  if (fallback === 'log-err')    return 'log-err';
  return 'log-raw';
}

function sysLog(msg) { appendLog(`[ SYS ] ${msg}`, 'log-sys'); }
function okLog(msg)  { appendLog(`[ OK  ] ${msg}`, 'log-ok'); }
function errLog(msg) { appendLog(`[ ERR ] ${msg}`, 'log-err'); }

// ────────────────────────────────────────────
//  Log utilities
// ────────────────────────────────────────────
let autoScroll = true;
let logLineCount = 0;

function updateLogCounter() {
  const el = document.getElementById('log-counter');
  if (el) el.textContent = logLineCount + ' lines';
}

function toggleAutoscroll() {
  autoScroll = !autoScroll;
  const btn = document.getElementById('btn-autoscroll');
  if (btn) {
    btn.classList.toggle('off', !autoScroll);
    btn.textContent = autoScroll ? '⇣ AUTO' : '⇣ OFF';
  }
}

function copyLog() {
  const box = logBox();
  const lines = [...box.querySelectorAll('.log-line')].map(d => d.textContent).join('\n');
  navigator.clipboard.writeText(lines).then(() => {
    const btn = document.querySelector('[onclick="copyLog()"]');
    if (btn) {
      const orig = btn.dataset.original || btn.textContent;
      btn.textContent = '✓ COPIED';
      btn.dataset.original = '✓ COPIED';
      setTimeout(() => {
        btn.textContent = orig;
        btn.dataset.original = orig;
      }, 1500);
    }
  });
}

function clearLog() {
  logLineCount = 0;
  updateLogCounter();
  const box = logBox();
  box.innerHTML = '';
  box.insertAdjacentHTML('afterbegin', `
    <div class="log-idle-overlay" id="log-idle">
      <div class="log-idle-ticker">NULLBIT_AI :: TACTICAL_ENGINE_OFFLINE :: AWAITING_CONNECTION :: BOT_STATUS=IDLE :: NO_THREATS_DETECTED :: SYSTEM_STANDBY</div>
      <div class="log-idle-ticker">COMBAT_MODULE=OFFLINE :: RESOURCE_SCORE=0.00 :: SURVIVAL_SCORE=0.00 :: THREAT_SCORE=0.00 :: WATCHDOG=INACTIVE</div>
      <div class="log-idle-ticker">INITIALIZE_BOT_TO_BEGIN :: PRESS_LAUNCH :: NULLBIT_v3.0 :: CORE_SYSTEMS_READY :: WAITING_FOR_SIGNAL...</div>
      <div class="log-idle-ticker">ENCRYPTION=AES256 :: AUTH=KEYAUTH :: LICENSE_CHECK=PENDING :: SECURE_CHANNEL=OPEN :: NULLBIT_SECURE</div>
      <div class="log-idle-dots">AWAITING INPUT . . .</div>
    </div>`);
}

function hideIdleOverlay() {
  const overlay = document.getElementById('log-idle');
  if (overlay) overlay.remove();
}

// ────────────────────────────────────────────
//  Bot status
// ────────────────────────────────────────────
let botRunning = false;

const CRACK_TEXTS = [
  '0xDEAD::0xBEEF::NULL::ERR::0xFF20::SYS_HALT::CORE_DUMP::0xC0DE::SIGNAL_LOST::REINIT',
  'if(threat>0){flee()}else{gather()}//NULLBIT_ENGINE::v3::TACTICAL::ONLINE::0xA3F2',
  'PROCESS_ID=4782::STATE=TRANSITION::MEM=0xFFFF::CPU=98%::WATCHDOG=RESET::BOOT',
  '01001110 01010101 01001100 01001100 01000010 01001001 01010100::DECODE::OK',
  'AUTH_TOKEN::KEYAUTH::VERIFIED::SESSION=0xF4A2::ENCRYPT::AES256::HANDSHAKE::OK',
];

const RAIN_CHARS = '0123456789ABCDEF01';
let rainIntervals = [];

function buildRainCols(mode) {
  const rain = document.getElementById('g-rain');
  if (!rain) return;
  rain.innerHTML = '';
  rainIntervals.forEach(clearInterval);
  rainIntervals = [];

  const colCount = 2 + Math.floor(Math.random() * 2);
  const rowCount = Math.floor(window.innerHeight / 15);

  for (let c = 0; c < colCount; c++) {
    const col = document.createElement('div');
    col.className = 'g-rain-col';
    col.style.animationDelay = (c * 0.05) + 's';

    // Random X position in center zone, spaced so columns don't overlap
    const xMin = window.innerWidth * 0.35 + c * (window.innerWidth * 0.1);
    const xRange = window.innerWidth * 0.06;
    col.style.position = 'absolute';
    col.style.left = Math.round(xMin + Math.random() * xRange) + 'px';
    col.style.top = '0';

    const goDown = Math.random() > 0.5;
    const speed = 35 + Math.floor(Math.random() * 30);

    // Build char array
    const chars = [];
    for (let r = 0; r < rowCount; r++) {
      chars.push(RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]);
    }

    // Render
    const render = () => {
      col.innerHTML = chars.map(ch => `<span>${ch}</span>`).join('');
    };
    render();
    rain.appendChild(col);

    // Scroll: shift array up or down
    const scrollIv = setInterval(() => {
      if (goDown) {
        chars.unshift(RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]);
        chars.pop();
      } else {
        chars.push(RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]);
        chars.shift();
      }
      // Also randomise a few chars in place for flicker
      for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        chars[idx] = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
      }
      render();
    }, speed);
    rainIntervals.push(scrollIv);
  }
}

function triggerGlitchFlash(mode = 'launch') {
  const el = document.getElementById('glitch-flash');
  const crackEl = document.getElementById('g-crack-text');
  if (!el) return;
  el.className = 'glitch-flash';
  void el.offsetWidth;
  if (crackEl) crackEl.textContent = CRACK_TEXTS[Math.floor(Math.random() * CRACK_TEXTS.length)];
  buildRainCols(mode);
  el.classList.add(mode);
  setTimeout(() => {
    el.className = 'glitch-flash';
    rainIntervals.forEach(clearInterval);
    rainIntervals = [];
  }, 700);
}

let uptimeInterval = null;
let uptimeStart = null;
function startUptime() {
  uptimeStart = Date.now();
  const el = document.getElementById('status-uptime');
  if (uptimeInterval) clearInterval(uptimeInterval);
  uptimeInterval = setInterval(() => {
    if (!el) return;
    const s = Math.floor((Date.now() - uptimeStart) / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${sec}`;
  }, 1000);
}
function stopUptime() {
  if (uptimeInterval) { clearInterval(uptimeInterval); uptimeInterval = null; }
  const el = document.getElementById('status-uptime');
  if (el) el.textContent = '00:00:00';
}

// Universal function to stop ALL animated dots
function stopAllDots() {
  // Stop auth dots
  document.querySelectorAll('.auth-dot').forEach(dot => {
    dot.style.animation = 'none';
    dot.style.opacity = '1';
  });
  // Stop sys dots (pending operations)
  document.querySelectorAll('.sys-dot').forEach(dot => {
    dot.style.animation = 'none';
    dot.style.opacity = '1';
  });
}

function setBotRunning(running, force = false) {
  // Guard against duplicate calls with same state
  if (!force && botRunning === running) return;
  
  botRunning = running;
  _syncCoreAccordion(document.querySelector('.nav-item.active')?.dataset?.tab || '');
  const btn    = document.getElementById('btn-launch');
  const label  = document.getElementById('btn-launch-text');
  const tbWrap = document.getElementById('titlebar-status');
  const tbTxt  = document.getElementById('tb-status-text');

  triggerGlitchFlash(running ? 'launch' : 'stop');
  _triggerNeuralIconState(running);
  _triggerLogoState(running);

  if (running) {
    if (btn) {
      btn.classList.add('running');
      btn.classList.remove('pulse');
      // Clear glitch effect dataset to prevent old text restoration
      if (btn.dataset) delete btn.dataset.original;
    }
    // Force text update - always set to STOP BOT when running
    if (label) {
      // Kill all pending glitch restore timers so they don't overwrite our text
      if (label._restoreTimeout) { clearTimeout(label._restoreTimeout); label._restoreTimeout = null; }
      if (label._restoreInterval) { clearInterval(label._restoreInterval); label._restoreInterval = null; }
      if (label._buildInterval) { clearInterval(label._buildInterval); label._buildInterval = null; }
      delete label.dataset.original;
      label.style.textShadow = '';
      label.textContent = '■ STOP BOT';
    }
    startUptime();
    if (tbWrap) tbWrap.className = 'titlebar-status online';
    if (tbTxt)  tbTxt.textContent = 'ONLINE';
    stopAllDots();
  } else {
    if (btn) {
      btn.classList.remove('running');
      btn.classList.add('pulse');
    }
    if (label) {
      if (label._restoreTimeout) { clearTimeout(label._restoreTimeout); label._restoreTimeout = null; }
      if (label._restoreInterval) { clearInterval(label._restoreInterval); label._restoreInterval = null; }
      if (label._buildInterval) { clearInterval(label._buildInterval); label._buildInterval = null; }
      delete label.dataset.original;
      label.style.textShadow = '';
      label.textContent = '▶ LAUNCH BOT';
    }
    stopUptime();
    resetBotStatusWidget();
    _offlineStatusBar();
    if (tbWrap) tbWrap.className = 'titlebar-status offline';
    if (tbTxt)  tbTxt.textContent = 'OFFLINE';
  }
}

function _triggerNeuralIconState(running) {
  const icon = document.querySelector('.nav-item.nav-sub .nav-icon');
  if (!icon) return;
  icon.classList.remove('neural-icon-boot', 'neural-icon-online', 'neural-icon-offline');
  if (running) {
    icon.classList.add('neural-icon-boot');
    setTimeout(() => {
      icon.classList.remove('neural-icon-boot');
      icon.classList.add('neural-icon-online');
    }, 1800);
  } else {
    icon.classList.add('neural-icon-offline');
    setTimeout(() => icon.classList.remove('neural-icon-offline'), 1200);
  }
}

function _triggerLogoState(running) {
  const logo = document.querySelector('.sidebar-logo');
  if (!logo) return;
  logo.classList.remove('logo-boot', 'logo-online', 'logo-offline', 'logo-active');
  void logo.offsetWidth;
  if (running) {
    logo.classList.add('logo-boot');
    setTimeout(() => {
      logo.classList.remove('logo-boot');
      logo.classList.add('logo-online');
      setTimeout(() => {
        logo.classList.remove('logo-online');
        logo.classList.add('logo-active');
      }, 400);
    }, 900);
  } else {
    logo.classList.add('logo-offline');
    setTimeout(() => logo.classList.remove('logo-offline'), 1400);
  }
}

// ────────────────────────────────────────────
//  Toast notifications
// ────────────────────────────────────────────
function showToast(msg, type = 'ok', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { ok: '▶', err: '✖', warn: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '●'}</span>
    <span class="toast-msg">${msg}</span>
    <div class="toast-bar" style="animation-duration:${duration}ms"></div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

// ── License validation ──
function validateLicense(key) {
  if (!key || key.length < 10) return { valid: false, reason: 'EMPTY_KEY' };
  // Format: XXXX-XXXX-XXXX-XXXX or any 16+ chars
  const clean = key.replace(/-/g, '');
  if (clean.length < 16) return { valid: false, reason: 'TOO_SHORT' };
  // Check expiration (demo: keys valid for 30 days from first use)
  // In production: check online with your server
  return { valid: true };
}

function updateLicenseStatus(key) {
  const statusEl = document.getElementById('license-status');
  if (!statusEl) return;
  const validation = validateLicense(key);
  if (validation.valid) {
    statusEl.textContent = 'LICENSED';
    statusEl.classList.add('valid');
  } else {
    statusEl.textContent = 'UNLICENSED';
    statusEl.classList.remove('valid');
  }
}

let isToggling = false;
async function toggleBot() {
  if (isToggling) return;
  isToggling = true;

  // Validate license before launch
  const licenseKey = document.getElementById('cfg-license')?.value?.trim();
  const validation = validateLicense(licenseKey);
  if (!validation.valid) {
    errLog(`LICENSE ERROR: ${validation.reason} — Enter valid key in CORE ACCESS`);
    showToast('LICENSE INVALID — CHECK CORE ACCESS', 'err', 5000);
    isToggling = false;
    return;
  }

  const btn = document.getElementById('btn-launch');
  if (btn) {
    btn.classList.remove('btn-firing');
    void btn.offsetWidth;
    btn.classList.add('btn-firing');
    setTimeout(() => btn.classList.remove('btn-firing'), 400);
  }
  try {
    if (botRunning) {
      sysLog('STOPPING BOT...');
      const r = await launcher.stopBot();
      if (r.error) {
        errLog('STOP ERROR: ' + r.error);
        showToast('STOP ERROR: ' + r.error, 'err', 4000);
      }
    } else {
      sysLog('INITIALIZING BOT...');
      const r = await launcher.launchBot();
      if (r.error) {
        errLog('LAUNCH ERROR: ' + r.error);
        if (r.error === 'EXE_NOT_FOUND') {
          errLog('AIBot.exe not found. Place it in the same folder as the launcher.');
          if (r.path) errLog('Looking at: ' + r.path);
        }
        showToast('LAUNCH FAILED: ' + r.error, 'err', 5000);
      } else {
        okLog('BOT PROCESS STARTED');
        showToast('BOT ONLINE', 'ok', 3000);
        resetSessionCounters();
        setBotRunning(true);
        setTimeout(() => _bootStatusBar(), 2000);
      }
    }
  } finally {
    isToggling = false;
  }
}

// ────────────────────────────────────────────
//  Tactical score parsing & Diagnostics
//  Bot prints JSON lines: {"type":"scores","threatScore":0.3,...}
// ────────────────────────────────────────────
function tryParseScores(text) {
  const lines = text.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    try {
      const obj = JSON.parse(t);
      switch (obj.type) {
        case 'scores':
          updateScores(obj);
          updateDiagScores(obj);
          break;
        case 'combat':
          updateCombatDiag(obj);
          break;
        case 'watchdog':
          updateWatchdogDiag(obj);
          break;
        case 'resource':
          updateResourceDiag(obj);
          break;
        case 'status':
          updateBotStatus(obj);
          break;
        case 'inv':
          updateInventoryUI(obj);
          break;
        case 'override':
          updateOverrideDiag(obj);
          break;
        case 'error':
          addGlitchLog(obj);
          break;
      }
    } catch (_) {}
  }
}

const CHART_MAX = 80;
const chartHistory = { threat: [], survival: [], resource: [] };

function updateScores({ threatScore = 0, survivalScore = 0, resourceScore = 0 }) {
  const set = (id, val) => {
    const pct = Math.min(100, Math.max(0, Math.round(val * 100)));
    document.getElementById('bar-' + id).style.width = pct + '%';
    document.getElementById('val-' + id).textContent = val.toFixed(2);
  };
  set('threat',   threatScore);
  set('survival', survivalScore);
  set('resource', resourceScore);

  chartHistory.threat.push(threatScore);
  chartHistory.survival.push(survivalScore);
  chartHistory.resource.push(resourceScore);
  if (chartHistory.threat.length > CHART_MAX) {
    chartHistory.threat.shift();
    chartHistory.survival.shift();
    chartHistory.resource.shift();
  }
  drawChart();
}

const STATE_CLASS_MAP = {
  'IDLE':       'state-idle',
  'GATHERING':  'state-gather',
  'COMBAT':     'state-combat',
  'FLEE':       'state-flee',
  'FOLLOWING':  'state-follow',
  'GUARDING':   'state-follow',
};

function updateBotStatus({ hp = 0, maxHp = 20, food = 0, state = 'IDLE' }) {
  const hpVal   = document.getElementById('bsw-hp-val');
  const foodVal = document.getElementById('bsw-food-val');
  const badge   = document.getElementById('bsw-state-badge');
  if (!hpVal) return;
  // Stop dots animation when real data arrives
  if (_statusDotsTimer) { clearInterval(_statusDotsTimer); _statusDotsTimer = null; }

  const hpPct = Math.min(100, Math.max(0, (hp / maxHp) * 100));

  hpVal.textContent   = `${Math.round(hp)} / ${Math.round(maxHp)}`;
  foodVal.textContent = Math.round(food);

  hpVal.classList.remove('hp-high', 'hp-mid', 'hp-crit');
  if (hpPct > 60)      hpVal.classList.add('hp-high');
  else if (hpPct > 30) hpVal.classList.add('hp-mid');
  else                 hpVal.classList.add('hp-crit');

  if (badge) {
    badge.textContent = state;
    badge.className = 'lst-state ' + (STATE_CLASS_MAP[state] || 'state-idle');
  }
}

function resetBotStatusWidget() {
  const hpVal   = document.getElementById('bsw-hp-val');
  const foodVal = document.getElementById('bsw-food-val');
  const badge   = document.getElementById('bsw-state-badge');
  if (hpVal)   { hpVal.textContent = '—'; hpVal.className = 'lst-val lst-hp'; }
  if (foodVal) foodVal.textContent = '—';
  if (badge)   { badge.textContent = 'OFFLINE'; badge.className = 'lst-state state-offline'; }
}

let _statusBootTimer = null;
let _statusDotsTimer = null;

function _offlineStatusBar() {
  const bar = document.getElementById('bot-statusbar');
  if (!bar) return;
  if (_statusBootTimer) { clearTimeout(_statusBootTimer); _statusBootTimer = null; }
  if (_statusDotsTimer) { clearInterval(_statusDotsTimer); _statusDotsTimer = null; }
  // Play shutdown animation then hide
  bar.classList.remove('bot-booting', 'bot-online', 'bot-offline');
  bar.classList.add('bot-shutdown');
  setTimeout(() => {
    bar.classList.remove('bot-shutdown');
    bar.classList.add('bot-offline');
  }, 650);
}

function _bootStatusBar() {
  const bar     = document.getElementById('bot-statusbar');
  const hpVal   = document.getElementById('bsw-hp-val');
  const foodVal = document.getElementById('bsw-food-val');
  const segEl   = document.getElementById('inv-segments');
  if (!bar) return;

  // Fields empty until dots start, inv stays as diamonds — inv segments stay as diamonds
  if (hpVal)   hpVal.textContent   = '';
  if (foodVal) foodVal.textContent = '';
  if (segEl)   segEl.textContent   = '▱▱▱▱▱▱▱▱▱▱▱▱';

  // Trigger appear animation
  bar.classList.remove('bot-offline', 'bot-online', 'bot-shutdown');
  bar.classList.add('bot-booting');

  // Start animating dots 1s after panel appears (after appear anim)
  setTimeout(() => {
    let dots = 0;
    _statusDotsTimer = setInterval(() => {
      dots = (dots + 1) % 3;
      const variants = ['\xb7  ', '\xb7\xb7 ', '\xb7\xb7\xb7'];
      const d = variants[dots];
      if (hpVal)   hpVal.textContent   = d;
      if (foodVal) foodVal.textContent = d;
    }, 350);
  }, 1000);

  // Switch to online after appear animation (0.6s)
  _statusBootTimer = setTimeout(() => {
    bar.classList.remove('bot-booting');
    bar.classList.add('bot-online');
  }, 650);
}


function drawChart() {
  const canvas = document.getElementById('score-chart');
  if (!canvas) return;
  const W = canvas.offsetWidth;
  if (!W) return;
  canvas.width = W;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const COLORS = {
    threat:   '#e03a3a',
    survival: '#3ae07a',
    resource: '#4a9eff',
  };

  for (const [key, color] of Object.entries(COLORS)) {
    const data = chartHistory[key];
    if (data.length < 2) continue;
    if (data.every(v => v === 0)) continue;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    for (let i = 0; i < data.length; i++) {
      const x = (i / (CHART_MAX - 1)) * W;
      const y = H - data[i] * (H - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const y = Math.round((H / 4) * i) + 0.5;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

// ────────────────────────────────────────────
//  DIAGNOSTICS Panel Updates
// ────────────────────────────────────────────

function updateInventoryUI({ fillRatio = 0, freeSlots = 0, usedSlots = 0, totalSlots = 36 }) {
  const fillPct = Math.min(100, Math.max(0, fillRatio * 100));
  
  // Update ASCII segments (12 blocks)
  const segEl  = document.getElementById('inv-segments');
  const barText = document.getElementById('inv-bar-text');
  if (segEl) {
    const TOTAL_SEGS = 12;
    const filled = Math.round(fillRatio * TOTAL_SEGS);
    segEl.textContent = '▰'.repeat(filled) + '▱'.repeat(TOTAL_SEGS - filled);
    segEl.classList.remove('high', 'critical');
    if (fillRatio >= 0.9) segEl.classList.add('critical');
    else if (fillRatio >= 0.75) segEl.classList.add('high');
  }
  if (barText) barText.textContent = `${usedSlots}/${totalSlots}`;
  
  // Update stats
  const freeEl = document.getElementById('inv-free');
  const usedEl = document.getElementById('inv-used');
  const ratioEl = document.getElementById('inv-ratio');
  const badge = document.getElementById('inv-status-badge');
  
  if (freeEl) freeEl.textContent = freeSlots;
  if (usedEl) usedEl.textContent = usedSlots;
  if (ratioEl) ratioEl.textContent = (fillRatio * 100).toFixed(0) + '%';
  if (badge) {
    badge.textContent = usedSlots >= totalSlots ? 'INV FULL' : usedSlots + ' / ' + totalSlots;
    badge.classList.add('online');
  }
}

function updateDiagScores({ threatScore = 0, survivalScore = 0, resourceScore = 0, status }) {
  const setBar = (id, val, color) => {
    const bar = document.getElementById('diag-' + id + '-bar');
    const valEl = document.getElementById('diag-' + id + '-val');
    if (bar) bar.style.width = Math.min(100, Math.max(0, val * 100)) + '%';
    if (valEl) valEl.textContent = val.toFixed(2);
  };
  setBar('threat', threatScore);
  setBar('survival', survivalScore);
  setBar('resource', resourceScore);
  
  // Update tactical status (default to LIVE if scores received and no explicit status)
  const statusEl = document.getElementById('diag-tactical-status');
  if (statusEl) {
    const effectiveStatus = status || 'LIVE';
    statusEl.textContent = effectiveStatus;
    statusEl.className = 'diag-status ' + (effectiveStatus === 'LIVE' ? 'ok' : 'offline');
  }
}

let _lastCombatMode = null;
function updateCombatDiag({ mode, targetDist, weapon, lastAction, status }) {
  if (mode && mode !== _lastCombatMode) {
    if (mode === 'COMBAT')                      _session.combat++;
    if (mode === 'FLEE' && _lastCombatMode !== 'FLEE') _session.fled++;
    _updateSessionUI();
  }
  _lastCombatMode = mode;

  const set = (id, val) => {
    const el = document.getElementById('diag-combat-' + id);
    if (el) el.textContent = val || '—';
  };
  set('mode', mode);
  set('dist', targetDist ? targetDist.toFixed(1) + 'm' : null);
  set('weapon', weapon);
  set('action', lastAction);
  
  const statusEl = document.getElementById('diag-combat-status');
  if (statusEl) {
    const effectiveStatus = status || (mode ? 'ACTIVE' : 'IDLE');
    statusEl.textContent = effectiveStatus;
    const statusClass = effectiveStatus.toLowerCase();
    statusEl.className = 'diag-status ' + statusClass;
  }
}

function updateWatchdogDiag({ lastCheck, lockHolder, pathStatus, status }) {
  const set = (id, val) => {
    const el = document.getElementById('diag-watchdog-' + id);
    if (el) el.textContent = val || '—';
  };
  set('last', lastCheck);
  set('lock', lockHolder);
  set('path', pathStatus);
  
  const statusEl = document.getElementById('diag-watchdog-status');
  if (statusEl) {
    // JSON received means watchdog is working, show ACTIVE not OFFLINE
    const effectiveStatus = status || 'ACTIVE';
    statusEl.textContent = effectiveStatus;
    const statusClass = effectiveStatus.toLowerCase();
    statusEl.className = 'diag-status ' + statusClass;
  }
}

const _session = { trees: 0, ores: 0, combat: 0, fled: 0, _prevTrees: 0, _prevOres: 0 };

function resetSessionCounters() {
  _session.trees = 0; _session.ores = 0;
  _session.combat = 0; _session.fled = 0;
  _session._prevTrees = 0; _session._prevOres = 0;
  _updateSessionUI();
}

function _updateSessionUI() {
  const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  s('sess-trees', _session.trees);
  s('sess-ores',  _session.ores);
  s('sess-combat', _session.combat);
  s('sess-fled',  _session.fled);
}

function updateResourceDiag({ trees, ores, fallbacks, dangerStops, status, summary }) {
  // accumulate session deltas
  const dt = (trees  || 0) - _session._prevTrees;
  const do_ = (ores  || 0) - _session._prevOres;
  if (dt > 0) { _session.trees += dt; }
  if (do_ > 0) { _session.ores += do_; }
  _session._prevTrees = trees || 0;
  _session._prevOres  = ores  || 0;
  _updateSessionUI();

  const set = (id, val) => {
    const el = document.getElementById('diag-' + id);
    if (el) el.textContent = val !== undefined ? val : '0';
  };
  set('trees', trees);
  set('ores', ores);
  set('fallbacks', fallbacks);
  set('danger-stops', dangerStops);
  
  const statusEl = document.getElementById('diag-resource-status');
  if (statusEl) {
    // JSON received means resource system is working, show STANDBY not OFFLINE
    const effectiveStatus = status || ((trees > 0 || ores > 0) ? 'GATHERING' : 'STANDBY');
    statusEl.textContent = effectiveStatus;
    const statusClass = effectiveStatus.toLowerCase();
    statusEl.className = 'diag-status ' + statusClass;
  }
  
  if (summary) {
    const summaryEl = document.getElementById('diag-expedition-summary');
    const contentEl = document.getElementById('diag-summary-content');
    if (summaryEl) summaryEl.style.display = 'block';
    if (contentEl) contentEl.textContent = summary;
  }
}

let glitchLogCount = 0;
function addGlitchLog({ message, timestamp, type }) {
  const container = document.getElementById('diag-glitch-log');
  const countEl = document.getElementById('diag-error-count');
  if (!container) return;
  
  // Remove empty message
  const empty = container.querySelector('.diag-empty');
  if (empty) empty.remove();
  
  glitchLogCount++;
  if (countEl) {
    countEl.textContent = glitchLogCount;
    countEl.dataset.count = glitchLogCount;
    countEl.classList.add('has-errors');
  }
  
  const item = document.createElement('div');
  item.className = 'diag-glitch-item';
  const time = timestamp || new Date().toLocaleTimeString();
  item.innerHTML = `<span class="timestamp">[${time}]</span> ${message}`;
  
  container.insertBefore(item, container.firstChild);
  
  // Keep only last 50 items
  while (container.children.length > 50) {
    container.removeChild(container.lastChild);
  }
}

function updateOverrideDiag({ active, until, reason }) {
  const section = document.getElementById('diag-override-section');
  const timeEl = document.getElementById('diag-override-time');
  const reasonEl = document.getElementById('diag-override-reason');
  
  if (section) section.style.display = active ? 'block' : 'none';
  if (timeEl) timeEl.textContent = until || '—';
  if (reasonEl) reasonEl.textContent = reason || 'Manual command issued';
}

// ────────────────────────────────────────────
//  Config
// ────────────────────────────────────────────
let _config = null;

async function loadConfigUI() {
  const r = await launcher.loadConfig();
  if (r.error) { errLog('CONFIG: ' + r.error); return; }
  _config = r.data;

  const mc  = _config.minecraft || {};
  const bot = _config.bot || {};

  setVal('cfg-license',      _config.license_key || '');
  updateLicenseStatus(_config.license_key);
  setVal('cfg-host',         mc.host     || '');
  setVal('cfg-port',         mc.port     || 25565);
  setVal('cfg-version',      mc.version  || '');
  setVal('cfg-auth',         mc.auth     || 'offline');
  setVal('cfg-username',     mc.username || '');
  setVal('cfg-password',     mc.password || '');
  setVal('cfg-allowed-user', bot.allowed_user || '');

  // AI Config
  const ai = _config.ai || {};
  setVal('cfg-openai-key',     ai.openai_api_key || '');
  setVal('cfg-assistant-id',   ai.assistant_id   || '');

  // System Config
  const system = _config.system || {};
  document.getElementById('cfg-auto-restart').checked = system.auto_restart !== false;
  document.getElementById('cfg-check-updates').checked = system.check_updates !== false;

  // Neural Config
  const neural = _config.neural || {};
  const nSetVal = (id, val, def) => {
    const el = document.getElementById(id);
    if (el) el.value = (val !== undefined && val !== null) ? val : def;
  };
  nSetVal('n-combatFleeCriticalHp',             neural.combatFleeCriticalHp,             6);
  nSetVal('n-combatFleeSafeHp',                 neural.combatFleeSafeHp,                 12);
  nSetVal('n-combatFleeRetreatScoreThreshold',  neural.combatFleeRetreatScoreThreshold,  2.5);
  nSetVal('n-combatFleeNavDistance',            neural.combatFleeNavDistance,            10);
  nSetVal('n-combatFleeImmediateDangerBlocks',  neural.combatFleeImmediateDangerBlocks,  11);
  nSetVal('n-combatFleeRetreatHpWeight',        neural.combatFleeRetreatHpWeight,        1.0);
  nSetVal('n-combatFleeRetreatPressureWeight',  neural.combatFleeRetreatPressureWeight,  0.58);
  nSetVal('n-pvpAttackCooldown',                neural.pvpAttackCooldown,                600);
  nSetVal('n-pvpIdealDistance',                 neural.pvpIdealDistance,                 2.9);
  nSetVal('n-pvpKiteHpThreshold',               neural.pvpKiteHpThreshold,               8);
  nSetVal('n-pvpEngageSafeHp',                  neural.pvpEngageSafeHp,                  15);
  nSetVal('n-pathThinkTimeoutMs',               neural.pathThinkTimeoutMs,               24000);
  nSetVal('n-stuckCheckTicks',                  neural.stuckCheckTicks,                  11);
  nSetVal('n-followDistance',                   neural.followDistance,                   3);
  nSetVal('n-guardMobDistance',                 neural.guardMobDistance,                 10);
  nSetVal('n-branchLength',                     neural.branchLength,                     32);
  nSetVal('n-maxBranches',                      neural.maxBranches,                      8);
  nSetVal('n-oreScanRadius',                    neural.oreScanRadius,                    6);
  nSetVal('n-torchInterval',                    neural.torchInterval,                    8);
  nSetVal('n-aiCooldownMs',                     neural.aiCooldownMs,                     4000);
  nSetVal('n-aiTimeoutMs',                      neural.aiTimeoutMs,                      12000);
  nSetVal('n-openAiThreadResetAfterMessages',   neural.openAiThreadResetAfterMessages,   0);
  nSetVal('n-gatherGuardSurvivalThreatCount',   neural.gatherGuardSurvivalThreatCount,   3);
  nSetVal('n-gatherGuardSurvivalLowHp',         neural.gatherGuardSurvivalLowHp,         8);
  nSetVal('n-gatherGuardFightMaxThreats',        neural.gatherGuardFightMaxThreats,       2);
  nSetVal('n-gatherGuardFightMinHpRatio',        neural.gatherGuardFightMinHpRatio,       0.6);
  nSetVal('n-gatherGuardFightMaxEngageDist',     neural.gatherGuardFightMaxEngageDist,    12);
  _neuralDirty = false;
  _updateNeuralDirty();

  const badge = document.getElementById('version-badge');
  badge.textContent = 'v' + (_config.bot_version || _config.version || '?');
  
  // Update launcher version badge
  const launcherBadge = document.getElementById('launcher-version');
  if (launcherBadge) {
    launcherBadge.textContent = 'v' + LAUNCHER_VERSION;
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

async function saveConfig() {
  if (!_config) { errLog('CONFIG NOT LOADED'); return; }

  _config.license_key = document.getElementById('cfg-license').value.trim();
  updateLicenseStatus(_config.license_key);
  _config.minecraft = _config.minecraft || {};
  _config.minecraft.host     = document.getElementById('cfg-host').value.trim();
  _config.minecraft.port     = parseInt(document.getElementById('cfg-port').value) || 25565;
  _config.minecraft.version  = document.getElementById('cfg-version').value.trim();
  _config.minecraft.auth     = document.getElementById('cfg-auth').value;
  _config.minecraft.username = document.getElementById('cfg-username').value.trim();
  _config.minecraft.password = document.getElementById('cfg-password').value;
  _config.bot = _config.bot || {};
  _config.bot.allowed_user   = document.getElementById('cfg-allowed-user').value.trim();

  // AI Config
  _config.ai = _config.ai || {};
  _config.ai.openai_api_key = document.getElementById('cfg-openai-key').value.trim();
  _config.ai.assistant_id   = document.getElementById('cfg-assistant-id').value.trim();

  const r = await launcher.saveConfig(_config);
  const status = document.getElementById('cfg-status');
  if (r.ok) {
    status.textContent = '[ OK ] Config saved.';
    status.className   = 'cfg-status ok';
  } else {
    status.textContent = '[ ERR ] ' + r.error;
    status.className   = 'cfg-status err';
  }
  setTimeout(() => { status.textContent = ''; }, 3000);
}

async function saveSystemConfig() {
  if (!_config) { errLog('CONFIG NOT LOADED'); return; }

  // System Config
  _config.system = _config.system || {};
  _config.system.auto_restart = document.getElementById('cfg-auto-restart').checked;
  _config.system.check_updates = document.getElementById('cfg-check-updates').checked;

  const r = await launcher.saveConfig(_config);
  const status = document.getElementById('system-cfg-status');
  if (r.ok) {
    status.textContent = '[ OK ] System settings saved.';
    status.className   = 'cfg-status ok';
  } else {
    status.textContent = '[ ERR ] ' + r.error;
    status.className   = 'cfg-status err';
  }
  setTimeout(() => { status.textContent = ''; }, 3000);
}

// ────────────────────────────────────────────
//  Neural Mode Switcher
// ────────────────────────────────────────────
function switchNeuralMode(mode, btn) {
  ['presets','tuning','advanced'].forEach(m => {
    const panel = document.getElementById('neural-panel-' + m);
    const b = document.getElementById('nmt-' + m);
    if (panel) panel.style.display = m === mode ? '' : 'none';
    if (b) b.classList.toggle('active', m === mode);
  });
}

// ────────────────────────────────────────────
//  Presets
// ────────────────────────────────────────────
const NEURAL_PRESETS = {
  defensive: {
    combatFleeCriticalHp: 10, combatFleeSafeHp: 16,
    combatFleeRetreatScoreThreshold: 1.5, combatFleeNavDistance: 14,
    combatFleeImmediateDangerBlocks: 8, combatFleeRetreatHpWeight: 1.5,
    combatFleeRetreatPressureWeight: 1.0, pvpAttackCooldown: 800,
    pvpIdealDistance: 3.5, pvpKiteHpThreshold: 12, pvpEngageSafeHp: 18,
    pathThinkTimeoutMs: 30000, stuckCheckTicks: 8, followDistance: 4,
    guardMobDistance: 14, branchLength: 24, maxBranches: 6,
    oreScanRadius: 6, torchInterval: 8, aiCooldownMs: 5000,
    aiTimeoutMs: 15000, openAiThreadResetAfterMessages: 0,
    gatherGuardSurvivalThreatCount: 2, gatherGuardSurvivalLowHp: 10,
    gatherGuardFightMaxThreats: 1, gatherGuardFightMinHpRatio: 0.75,
    gatherGuardFightMaxEngageDist: 8,
  },
  balanced: { ...null },
  aggressive: {
    combatFleeCriticalHp: 4, combatFleeSafeHp: 8,
    combatFleeRetreatScoreThreshold: 3.5, combatFleeNavDistance: 8,
    combatFleeImmediateDangerBlocks: 14, combatFleeRetreatHpWeight: 0.6,
    combatFleeRetreatPressureWeight: 0.4, pvpAttackCooldown: 450,
    pvpIdealDistance: 2.5, pvpKiteHpThreshold: 5, pvpEngageSafeHp: 10,
    pathThinkTimeoutMs: 18000, stuckCheckTicks: 14, followDistance: 2,
    guardMobDistance: 7, branchLength: 40, maxBranches: 10,
    oreScanRadius: 8, torchInterval: 10, aiCooldownMs: 3000,
    aiTimeoutMs: 10000, openAiThreadResetAfterMessages: 0,
    gatherGuardSurvivalThreatCount: 4, gatherGuardSurvivalLowHp: 5,
    gatherGuardFightMaxThreats: 3, gatherGuardFightMinHpRatio: 0.45,
    gatherGuardFightMaxEngageDist: 16,
  },
  ghost: {
    combatFleeCriticalHp: 14, combatFleeSafeHp: 18,
    combatFleeRetreatScoreThreshold: 0.8, combatFleeNavDistance: 18,
    combatFleeImmediateDangerBlocks: 6, combatFleeRetreatHpWeight: 2.0,
    combatFleeRetreatPressureWeight: 1.5, pvpAttackCooldown: 900,
    pvpIdealDistance: 4, pvpKiteHpThreshold: 14, pvpEngageSafeHp: 20,
    pathThinkTimeoutMs: 40000, stuckCheckTicks: 6, followDistance: 5,
    guardMobDistance: 18, branchLength: 20, maxBranches: 4,
    oreScanRadius: 4, torchInterval: 6, aiCooldownMs: 6000,
    aiTimeoutMs: 18000, openAiThreadResetAfterMessages: 0,
    gatherGuardSurvivalThreatCount: 2, gatherGuardSurvivalLowHp: 12,
    gatherGuardFightMaxThreats: 1, gatherGuardFightMinHpRatio: 0.9,
    gatherGuardFightMaxEngageDist: 6,
  },
};
// balanced is set after NEURAL_DEFAULTS is declared below

function applyPreset(name) {
  const preset = NEURAL_PRESETS[name];
  if (!preset) return;
  Object.entries(NEURAL_ID_MAP).forEach(([elId, key]) => {
    const el = document.getElementById(elId);
    if (el && preset[key] !== undefined) el.value = preset[key];
  });
  // highlight active card
  document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById('preset-' + name);
  if (card) card.classList.add('active');
  _neuralDirty = true;
  _updateNeuralDirty();
  // sync tuning sliders to match preset
  _syncTuningFromAdvanced();
}

// ────────────────────────────────────────────
//  Tuning Sliders
// ────────────────────────────────────────────
const TUNING_MAP = {
  aggression: {
    // 1=passive(defensive), 10=aggressive
    params: (v) => ({
      pvpAttackCooldown:               _lerp(v, 1, 10, 850, 450),
      pvpKiteHpThreshold:              _lerp(v, 1, 10, 12, 4),
      pvpEngageSafeHp:                 _lerp(v, 1, 10, 18, 9),
      combatFleeRetreatScoreThreshold: _lerp(v, 1, 10, 1.2, 3.8),
      combatFleeRetreatHpWeight:       _lerp(v, 1, 10, 1.6, 0.5),
    })
  },
  survival: {
    // 1=cautious(safe), 10=reckless(risky)
    params: (v) => ({
      combatFleeCriticalHp:            _lerp(v, 1, 10, 12, 3),
      combatFleeSafeHp:                _lerp(v, 1, 10, 17, 7),
      combatFleeNavDistance:           _lerp(v, 1, 10, 16, 6),
      combatFleeImmediateDangerBlocks: _lerp(v, 1, 10, 7, 14),
      combatFleeRetreatPressureWeight: _lerp(v, 1, 10, 1.2, 0.3),
    })
  },
  gather: {
    // 1=careful(safe), 10=bold(risky)
    params: (v) => ({
      gatherGuardSurvivalThreatCount:  Math.round(_lerp(v, 1, 10, 2, 5)),
      gatherGuardSurvivalLowHp:        Math.round(_lerp(v, 1, 10, 12, 4)),
      gatherGuardFightMaxThreats:      Math.round(_lerp(v, 1, 10, 1, 4)),
      gatherGuardFightMinHpRatio:      _lerp(v, 1, 10, 0.85, 0.35),
      gatherGuardFightMaxEngageDist:   Math.round(_lerp(v, 1, 10, 7, 18)),
    })
  },
  mobility: {
    // 1=thorough(safe), 10=fast(risky)
    params: (v) => ({
      pathThinkTimeoutMs: Math.round(_lerp(v, 1, 10, 20000, 8000)),
      stuckCheckTicks:    Math.round(_lerp(v, 1, 10, 8, 18)),
      followDistance:     Math.round(_lerp(v, 1, 10, 5, 2)),
      guardMobDistance:   Math.round(_lerp(v, 1, 10, 16, 6)),
    })
  },
};

function _lerp(v, inMin, inMax, outMin, outMax) {
  const t = (v - inMin) / (inMax - inMin);
  const result = outMin + t * (outMax - outMin);
  return Math.round(result * 100) / 100;
}

function _updateTuningFill(id, value) {
  const fill = document.getElementById('tuning-fill-' + id);
  const range = document.getElementById('tuning-' + id);
  if (!fill || !range) return;
  const pct = ((value - range.min) / (range.max - range.min)) * 100;
  fill.style.width = pct + '%';
}

function _tuningHeatUpdate(id, v) {
  const fill   = document.getElementById('tuning-fill-' + id);
  const valEl  = document.getElementById('tuning-val-' + id);
  const row    = document.getElementById('tuning-' + id)?.closest('.tuning-row');
  if (!fill || !valEl || !row) return;

  // Heat color: 1-3 cyan, 4-6 yellow, 7-9 orange, 10 red
  let fillColor, valColor, glowColor;
  if (v <= 3) {
    const t = (v - 1) / 2;
    fillColor  = `linear-gradient(90deg, rgba(0,180,255,0.3), rgba(${lerpc(0,255,t)},${lerpc(200,200,t)},${lerpc(255,0,t)},1))`;
    valColor   = `rgb(${lerpc(0,245,t)},${lerpc(200,197,t)},${lerpc(255,24,t)})`;
    glowColor  = `rgba(0,180,255,0.7)`;
  } else if (v <= 6) {
    const t = (v - 4) / 3;
    fillColor  = `linear-gradient(90deg, rgba(255,200,0,0.3), rgba(245,197,24,1))`;
    valColor   = `rgb(245,197,24)`;
    glowColor  = `rgba(245,197,24,0.6)`;
  } else if (v <= 9) {
    const t = (v - 7) / 2;
    fillColor  = `linear-gradient(90deg, rgba(255,150,0,0.3), rgba(${lerpc(255,224,t)},${lerpc(150,58,t)},0,1))`;
    valColor   = `rgb(${lerpc(255,224,t)},${lerpc(150,58,t)},0)`;
    glowColor  = `rgba(255,100,0,0.7)`;
  } else {
    fillColor  = `linear-gradient(90deg, rgba(224,58,58,0.3), rgba(224,58,58,1))`;
    valColor   = `rgb(224,58,58)`;
    glowColor  = `rgba(224,58,58,0.9)`;
  }

  fill.style.background  = fillColor;
  valEl.style.color      = valColor;
  valEl.style.textShadow = `0 0 8px ${glowColor}`;

  // Overdrive / Minimum label
  row.classList.remove('tuning-flash-max', 'tuning-flash-min');
  let badge = row.querySelector('.tuning-extreme-badge');
  if (v === 10 || v === 1) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'tuning-extreme-badge';
      row.querySelector('.tuning-header').appendChild(badge);
    }
    badge.textContent = v === 10 ? '[ OVERDRIVE ]' : '[ MINIMUM ]';
    badge.className = 'tuning-extreme-badge ' + (v === 10 ? 'badge-max' : 'badge-min');
    void badge.offsetWidth;
    badge.classList.add('badge-active');
    clearTimeout(badge._hide);
    badge._hide = setTimeout(() => badge.classList.remove('badge-active'), 1800);
  } else if (badge) {
    badge.classList.remove('badge-active');
  }
}

function lerpc(a, b, t) { return Math.round(a + (b - a) * Math.max(0, Math.min(1, t))); }

function onTuningChange(id, value) {
  const v = Number(value);
  document.getElementById('tuning-val-' + id).textContent = v;
  _updateTuningFill(id, v);
  _tuningHeatUpdate(id, v);
  const map = TUNING_MAP[id];
  if (!map) return;
  const params = map.params(v);
  Object.entries(params).forEach(([key, val]) => {
    const elId = Object.keys(NEURAL_ID_MAP).find(k => NEURAL_ID_MAP[k] === key);
    if (elId) {
      const el = document.getElementById(elId);
      if (el) el.value = val;
    }
  });
  _neuralDirty = true;
  _updateNeuralDirty();
}

function _clampTuning(v) { return Math.max(1, Math.min(10, Math.round(v))); }

function _setTuningSlider(id, v) {
  const clamped = _clampTuning(v);
  const el = document.getElementById('tuning-' + id);
  const lbl = document.getElementById('tuning-val-' + id);
  if (el) el.value = clamped;
  if (lbl) lbl.textContent = clamped;
  _updateTuningFill(id, clamped);
  _tuningHeatUpdate(id, clamped);
}

function _syncTuningFromAdvanced() {
  const aggr = document.getElementById('n-pvpAttackCooldown');
  if (aggr) _setTuningSlider('aggression', _lerp(Number(aggr.value), 850, 450, 1, 10));

  const surv = document.getElementById('n-combatFleeCriticalHp');
  if (surv) _setTuningSlider('survival', _lerp(Number(surv.value), 12, 3, 1, 10));

  const gath = document.getElementById('n-gatherGuardSurvivalLowHp');
  if (gath) _setTuningSlider('gather', _lerp(Number(gath.value), 12, 4, 1, 10));

  const mob = document.getElementById('n-pathThinkTimeoutMs');
  if (mob) _setTuningSlider('mobility', _lerp(Number(mob.value), 20000, 8000, 1, 10));
}

// ────────────────────────────────────────────
//  Neural Config
// ────────────────────────────────────────────

NEURAL_PRESETS.balanced = null; // placeholder — set below
const NEURAL_DEFAULTS = {
  combatFleeCriticalHp: 6, combatFleeSafeHp: 12,
  combatFleeRetreatScoreThreshold: 2.5, combatFleeNavDistance: 10,
  combatFleeImmediateDangerBlocks: 11, combatFleeRetreatHpWeight: 1.0,
  combatFleeRetreatPressureWeight: 0.58, pvpAttackCooldown: 600,
  pvpIdealDistance: 2.9, pvpKiteHpThreshold: 8, pvpEngageSafeHp: 15,
  pathThinkTimeoutMs: 24000, stuckCheckTicks: 11, followDistance: 3,
  guardMobDistance: 10, branchLength: 32, maxBranches: 8,
  oreScanRadius: 6, torchInterval: 8, aiCooldownMs: 4000,
  aiTimeoutMs: 12000, openAiThreadResetAfterMessages: 0,
  gatherGuardSurvivalThreatCount: 3, gatherGuardSurvivalLowHp: 8,
  gatherGuardFightMaxThreats: 2, gatherGuardFightMinHpRatio: 0.6,
  gatherGuardFightMaxEngageDist: 12,
};
NEURAL_PRESETS.balanced = { ...NEURAL_DEFAULTS };

const NEURAL_ID_MAP = {
  'n-combatFleeCriticalHp':            'combatFleeCriticalHp',
  'n-combatFleeSafeHp':                'combatFleeSafeHp',
  'n-combatFleeRetreatScoreThreshold': 'combatFleeRetreatScoreThreshold',
  'n-combatFleeNavDistance':           'combatFleeNavDistance',
  'n-combatFleeImmediateDangerBlocks': 'combatFleeImmediateDangerBlocks',
  'n-combatFleeRetreatHpWeight':       'combatFleeRetreatHpWeight',
  'n-combatFleeRetreatPressureWeight': 'combatFleeRetreatPressureWeight',
  'n-pvpAttackCooldown':               'pvpAttackCooldown',
  'n-pvpIdealDistance':                'pvpIdealDistance',
  'n-pvpKiteHpThreshold':              'pvpKiteHpThreshold',
  'n-pvpEngageSafeHp':                 'pvpEngageSafeHp',
  'n-pathThinkTimeoutMs':              'pathThinkTimeoutMs',
  'n-stuckCheckTicks':                 'stuckCheckTicks',
  'n-followDistance':                  'followDistance',
  'n-guardMobDistance':                'guardMobDistance',
  'n-branchLength':                    'branchLength',
  'n-maxBranches':                     'maxBranches',
  'n-oreScanRadius':                   'oreScanRadius',
  'n-torchInterval':                   'torchInterval',
  'n-aiCooldownMs':                    'aiCooldownMs',
  'n-aiTimeoutMs':                     'aiTimeoutMs',
  'n-openAiThreadResetAfterMessages':  'openAiThreadResetAfterMessages',
  'n-gatherGuardSurvivalThreatCount':  'gatherGuardSurvivalThreatCount',
  'n-gatherGuardSurvivalLowHp':        'gatherGuardSurvivalLowHp',
  'n-gatherGuardFightMaxThreats':      'gatherGuardFightMaxThreats',
  'n-gatherGuardFightMinHpRatio':      'gatherGuardFightMinHpRatio',
  'n-gatherGuardFightMaxEngageDist':   'gatherGuardFightMaxEngageDist',
};

let _neuralDirty = false;
let _neuralSnapshot = {}; // snapshot of Neural fields taken on tab entry — used by DISCARD

function _updateNeuralDirty() {
  const btn = document.getElementById('btn-save-neural');
  const dot = document.getElementById('neural-unsaved-dot');
  if (_neuralDirty) {
    if (btn) { btn.classList.add('neural-unsaved'); btn.textContent = 'SAVE'; }
    if (dot) dot.classList.add('visible');
  } else {
    if (btn) { btn.classList.remove('neural-unsaved'); btn.textContent = 'SAVE'; }
    if (dot) dot.classList.remove('visible');
  }
}

function initNeuralDirtyTracking() {
  Object.keys(NEURAL_ID_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      _neuralDirty = true;
      _updateNeuralDirty();
    });
  });
}

function resetNeuralDefaults() {
  Object.entries(NEURAL_ID_MAP).forEach(([elId, key]) => {
    const el = document.getElementById(elId);
    if (el) el.value = NEURAL_DEFAULTS[key];
  });
  // sync preset cards — BALANCED = defaults
  document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
  const balancedCard = document.getElementById('preset-balanced');
  if (balancedCard) balancedCard.classList.add('active');
  // sync tuning sliders
  _syncTuningFromAdvanced();
  _neuralDirty = true;
  _updateNeuralDirty();
}

async function saveNeuralConfig() {
  if (!_config) { errLog('CONFIG NOT LOADED'); return; }
  const nGetNum = (id) => {
    const el = document.getElementById(id);
    if (!el) return undefined;
    const v = parseFloat(el.value);
    return Number.isFinite(v) ? v : undefined;
  };
  _config.neural = {};
  Object.entries(NEURAL_ID_MAP).forEach(([elId, key]) => {
    _config.neural[key] = nGetNum(elId);
  });
  const r = await launcher.saveConfig(_config);
  const btn = document.getElementById('btn-save-neural');
  if (r.ok) {
    _neuralDirty = false;
    _updateNeuralDirty();
    sysLog('[ OK ] Neural config saved.');
  } else {
    if (btn) { btn.textContent = 'ERROR'; setTimeout(() => _updateNeuralDirty(), 2000); }
    errLog('[ ERR ] ' + r.error);
  }
}

// ────────────────────────────────────────────
//  Update
// ────────────────────────────────────────────
let _updateInfo = null;

async function checkUpdate() {
  const box = document.getElementById('update-state');
  box.className = 'update-state';
  box.textContent = 'CHECKING...';

  const r = await launcher.checkUpdate();
  if (r.error) {
    box.className = 'update-state error';
    box.textContent = '[ ERR ] ' + r.error;
    return;
  }

  _updateInfo = r;
  const current = _config?.bot_version || _config?.version || '0.0.0';
  const newer = semverGt(r.version, current);

  if (newer) {
    box.className = 'update-state new-version';
    box.textContent = `NEW VERSION AVAILABLE: ${current} → ${r.version}`;
    document.getElementById('btn-dl').style.display = '';
    // Also show bot update row in the launcher update banner if it's visible
    showBotUpdateInBanner(current, r.version, r.htmlUrl);
  } else {
    box.className = 'update-state up-to-date';
    box.textContent = `UP TO DATE — v${current}`;
  }

  document.getElementById('patch-notes').textContent = r.notes || '(no notes)';
}

async function doUpdate() {
  if (!_updateInfo?.downloadUrl) { errLog('NO DOWNLOAD URL'); return; }

  document.getElementById('btn-dl').style.display = 'none';
  const wrap = document.getElementById('progress-wrap');
  wrap.style.display = '';

  launcher.onUpdateProgress(({ pct, downloaded, total }) => {
    const safePct = isFinite(pct) ? Math.round(pct) : 0;
    document.getElementById('progress-fill').style.width = safePct + '%';
    const toMB = b => (b && isFinite(b)) ? (b / 1024 / 1024).toFixed(1) : '?';
    const sizeStr = (downloaded || total)
      ? `  ${toMB(downloaded)} / ${toMB(total)} MB`
      : '';
    document.getElementById('progress-label').textContent =
      `DOWNLOADING... ${safePct}%${sizeStr}`;
  });

  const r = await launcher.downloadUpdate({ url: _updateInfo.downloadUrl, fileSize: _updateInfo.fileSize });

  launcher.removeAllListeners('update-progress');
  wrap.style.display = 'none';

  if (r.ok) {
    if (_config) {
      const oldVer = _config.bot_version || '—';
      _config.bot_version = _updateInfo.version;
      await launcher.saveConfig(_config);
      okLog('BOT UPDATED TO v' + _updateInfo.version);
      showRestartModal(oldVer, _updateInfo.version);
    } else {
      okLog('BOT UPDATED TO v' + _updateInfo.version);
      showRestartModal('—', _updateInfo.version);
    }
  } else {
    errLog('UPDATE FAILED: ' + r.error);
  }
}

// Simple semver gt: returns true if a > b
function semverGt(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false;
}

// ────────────────────────────────────────────
//  Launcher Update Check
// ────────────────────────────────────────────
const LAUNCHER_VERSION = '3.0.24';

async function checkLauncherUpdate() {
  try {
    sysLog('[UPDATER] Checking for launcher updates...');
    // Use native NSIS autoUpdater
    const r = await launcher.nsisCheckUpdate();
    if (r.portable) {
      sysLog('[UPDATER] Portable mode — skipping');
      return;
    }
    if (r.error) {
      sysLog('[UPDATER] Check failed: ' + r.error);
      return;
    }
    // autoUpdater fires 'auto-update-available' event if update found
    // handled by onAutoUpdateAvailable listener below
    if (!r.available) {
      sysLog('[UPDATER] Up to date');
    }
  } catch (e) {
    sysLog('[UPDATER] Check failed: ' + e.message);
  }
}

function showLauncherUpdate(version, url) {
  const banner = document.getElementById('launcher-update-banner');
  const verEl = document.getElementById('launcher-new-version');
  const linkEl = document.getElementById('launcher-update-link');
  const launcherRow = document.getElementById('launcher-update-row');
  if (!banner) return;

  if (verEl) verEl.textContent = 'v' + version;
  if (linkEl) { linkEl.dataset.url = url || ''; linkEl.href = '#'; }
  if (launcherRow) launcherRow.style.display = 'flex';
  banner.style.display = 'flex';
  // If bot update was already detected, show it in the banner too
  if (_updateInfo && _config) {
    const current = _config.bot_version || _config.version || '0.0.0';
    if (semverGt(_updateInfo.version, current)) {
      showBotUpdateInBanner(current, _updateInfo.version, _updateInfo.htmlUrl);
    }
  }
}

function showBotUpdateInBanner(oldVer, newVer, url) {
  const row = document.getElementById('bot-update-row');
  const verEl = document.getElementById('bot-new-version');
  const linkEl = document.getElementById('bot-update-link');
  const launcherRow = document.getElementById('launcher-update-row');
  const banner = document.getElementById('launcher-update-banner');
  if (!row) return;
  if (verEl) verEl.textContent = oldVer + ' → ' + newVer;
  if (linkEl) {
    if (url) { linkEl.dataset.url = url; linkEl.href = '#'; linkEl.style.display = ''; }
    else linkEl.style.display = 'none';
  }
  row.style.display = 'flex';
  // Hide launcher row if there is no launcher update pending
  const launcherVerEl = document.getElementById('launcher-new-version');
  if (launcherRow && (!launcherVerEl || !launcherVerEl.textContent.trim())) {
    launcherRow.style.display = 'none';
  }
  // Show banner if not already visible
  if (banner && banner.style.display === 'none') banner.style.display = 'flex';
}

function dismissLauncherUpdate() {
  const banner = document.getElementById('launcher-update-banner');
  if (!banner) return;
  banner.classList.add('banner-hiding');
  setTimeout(() => {
    banner.style.display = 'none';
    banner.classList.remove('banner-hiding');
    // Reset rows for next show
    const launcherRow = document.getElementById('launcher-update-row');
    const botRow = document.getElementById('bot-update-row');
    if (launcherRow) launcherRow.style.display = 'flex';
    if (botRow) botRow.style.display = 'none';
  }, 360);
}

async function installBotUpdateInline() {
  if (!_updateInfo?.downloadUrl) {
    // Fallback — switch to update tab
    switchTab(document.querySelector('[data-tab=update]'));
    dismissLauncherUpdate();
    return;
  }

  const botRow = document.getElementById('bot-update-row');
  const progressRow = document.getElementById('bot-banner-progress');
  const bar = document.getElementById('bot-banner-bar');
  const pct = document.getElementById('bot-banner-pct');
  const btn = document.getElementById('bot-install-btn');

  if (btn) btn.disabled = true;
  if (botRow) botRow.style.display = 'none';
  if (progressRow) progressRow.style.display = 'flex';

  launcher.onUpdateProgress(({ pct: p }) => {
    const safe = Math.min(100, Math.round(p || 0));
    if (bar) bar.style.width = safe + '%';
    if (pct) pct.textContent = safe + '%';
  });

  try {
    const r = await launcher.downloadUpdate({ url: _updateInfo.downloadUrl, fileSize: _updateInfo.fileSize });
    launcher.removeAllListeners('update-progress');

    if (r.ok) {
      if (pct) pct.textContent = '100%';
      if (bar) bar.style.width = '100%';
      if (_config) {
        const oldVer = _config.bot_version || '—';
        _config.bot_version = _updateInfo.version;
        await launcher.saveConfig(_config);
        showRestartModal(oldVer, _updateInfo.version);
      }
      dismissLauncherUpdate();
    } else {
      errLog('[BOT UPDATE] Failed: ' + r.error);
      if (progressRow) progressRow.style.display = 'none';
      if (botRow) botRow.style.display = 'flex';
      if (btn) btn.disabled = false;
    }
  } catch (e) {
    launcher.removeAllListeners('update-progress');
    errLog('[BOT UPDATE] Error: ' + e.message);
    if (progressRow) progressRow.style.display = 'none';
    if (botRow) botRow.style.display = 'flex';
    if (btn) btn.disabled = false;
  }
}

let _downloadProgressCleanup = null;

// Cyberpunk loading messages
const CYBER_MESSAGES = [
  'INITIALIZING UPLOAD',
  'CONNECTING TO SERVER',
  'DOWNLOADING PACKAGES',
  'VERIFYING INTEGRITY',
  'OPTIMIZING DATA',
  'FINALIZING UPDATE'
];

let _installInProgress = false;

async function installLauncherUpdate() {
  if (_installInProgress) return; // prevent double-click
  _installInProgress = true;

  const btn = document.getElementById('launcher-install-btn');
  if (btn) btn.disabled = true;

  const normalContent = document.getElementById('update-normal-content');
  const downloadState = document.getElementById('update-download-state');
  const loadingText = document.getElementById('cyber-loading-text');
  const progressBar = document.getElementById('cyber-progress-bar');
  const percentText = document.getElementById('cyber-progress-percent');
  const sizeText = document.getElementById('cyber-glitch-numbers');

  if (!normalContent || !downloadState) { _installInProgress = false; return; }

  // Switch to cyberpunk download state
  normalContent.style.display = 'none';
  downloadState.style.display = 'flex';

  // If update already downloaded — install immediately
  if (_launcherUpdateReady) {
    sysLog('[UPDATER] UPDATE READY — INSTALLING NOW...');
    if (loadingText) loadingText.textContent = 'INSTALLING UPDATE';
    if (progressBar) progressBar.style.width = '100%';
    if (percentText) percentText.textContent = '100%';
    stopAllDots();
    setTimeout(async () => {
      await launcher.nsisInstallUpdate();
    }, 800);
    return;
  }

  sysLog('[UPDATER] DOWNLOADING NEW LAUNCHER...');

  // Clean up any stale listeners before registering new ones
  launcher.removeUpdateListeners();

  // Progress updates
  launcher.onAutoUpdateProgress((percent) => {
    const p = Math.round(percent);
    if (progressBar) progressBar.style.width = p + '%';
    if (percentText) percentText.textContent = p + '%';
    const msgIndex = Math.min(Math.floor(p / 18), CYBER_MESSAGES.length - 1);
    if (loadingText) loadingText.textContent = CYBER_MESSAGES[msgIndex];
    if (sizeText) sizeText.textContent = `${(Math.random()*30+10).toFixed(2)} MB / ~45.00 MB`;
  });

  // Handle updater errors — show in log and restore UI
  launcher.onAutoUpdateError((errMsg) => {
    errLog('[UPDATER] ERROR: ' + errMsg);
    showToast('UPDATE ERROR: ' + errMsg, 'err', 6000);
    launcher.removeUpdateListeners();
    if (normalContent) normalContent.style.display = 'flex';
    if (downloadState) downloadState.style.display = 'none';
    if (btn) btn.disabled = false;
    _installInProgress = false;
  });

  // Fire once when download completes — then install
  launcher.onAutoUpdateReadyOnce(() => {
    _launcherUpdateReady = true;
    launcher.removeUpdateListeners();
    if (loadingText) loadingText.textContent = 'INSTALLATION COMPLETE';
    if (progressBar) progressBar.style.width = '100%';
    if (percentText) percentText.textContent = '100%';
    sysLog('[UPDATER] DOWNLOAD COMPLETE — INSTALLING...');
    stopAllDots();
    setTimeout(async () => {
      await launcher.nsisInstallUpdate();
    }, 1200);
  });

  try {
    const r = await launcher.nsisDownloadUpdate();
    if (r?.error) {
      errLog('[UPDATER] DOWNLOAD FAILED: ' + r.error);
      launcher.removeUpdateListeners();
      normalContent.style.display = 'flex';
      downloadState.style.display = 'none';
      if (btn) btn.disabled = false;
      _installInProgress = false;
    }
  } catch (e) {
    errLog('[UPDATER] CRITICAL ERROR: ' + e.message);
    launcher.removeUpdateListeners();
    normalContent.style.display = 'flex';
    downloadState.style.display = 'none';
    if (btn) btn.disabled = false;
    _installInProgress = false;
  }
}

// ────────────────────────────────────────────
//  IPC subscriptions
// ────────────────────────────────────────────

// Native NSIS autoUpdater events
let _launcherUpdateReady = false; // true once update-downloaded fires

launcher.onAutoUpdateAvailable((info) => {
  sysLog(`[UPDATER] New launcher version: v${info.version}`);
  _launcherUpdateReady = false;
  const releaseUrl = `https://github.com/nullbit26/Nullbit-Launcher/releases/tag/v${info.version}`;
  showLauncherUpdate(info.version, releaseUrl);
});

launcher.onAutoUpdateReady((info) => {
  sysLog('[UPDATER] Update downloaded and ready to install');
  _launcherUpdateReady = true;
});

launcher.onBotLog(({ level, text }) => {
  activateTickers();
  tryParseScores(text);
  appendLog(text, level === 'stderr' ? 'log-err' : 'log-raw');
});

let autoRestartTimer = null;
let autoRestartAttempts = 0;
const AUTO_RESTART_DELAY = 10;
const AUTO_RESTART_MAX   = 3;

launcher.onBotStatus(({ running, exitCode }) => {
  setBotRunning(running);
  
  // Reset diagnostics when bot stops
  if (!running) {
    updateDiagScores({ threatScore: 0, survivalScore: 0, resourceScore: 0, status: 'OFFLINE' });
    updateCombatDiag({ mode: '—', targetDist: null, weapon: '—', lastAction: '—', status: 'OFFLINE' });
    updateWatchdogDiag({ lastCheck: '—', lockHolder: 'NONE', pathStatus: '—', status: 'OFFLINE' });
    updateResourceDiag({ trees: 0, ores: 0, fallbacks: 0, dangerStops: 0, status: 'OFFLINE' });
    // Reset inventory
    const invBadge = document.getElementById('inv-status-badge');
    if (invBadge) {
      invBadge.textContent = 'OFFLINE';
      invBadge.classList.remove('online');
    }
    
    if (exitCode === 0) {
      okLog('BOT STOPPED NORMALLY');
      showToast('BOT STOPPED', 'warn', 3000);
      autoRestartAttempts = 0;
      if (autoRestartTimer) { clearInterval(autoRestartTimer); autoRestartTimer = null; }
      stopAllDots(); // Stop dots when bot stops normally
    } else {
      // Check if auto-restart is enabled
      const autoRestartEnabled = _config?.system?.auto_restart !== false;
      if (!autoRestartEnabled) {
        errLog(`BOT CRASHED (code: ${exitCode}) — AUTO-RESTART DISABLED`);
        showToast('BOT CRASHED — AUTO-RESTART OFF', 'err', 5000);
        return;
      }
      if (autoRestartAttempts >= AUTO_RESTART_MAX) {
        errLog(`BOT CRASHED — AUTO-RESTART LIMIT REACHED (${AUTO_RESTART_MAX} attempts). Stop manually.`);
        showToast(`RESTART LIMIT REACHED — MANUAL START REQUIRED`, 'err', 6000);
        autoRestartAttempts = 0;
        return;
      }
      autoRestartAttempts++;
      errLog(`BOT CRASHED (code: ${exitCode}) — RESTART ${autoRestartAttempts}/${AUTO_RESTART_MAX} IN ${AUTO_RESTART_DELAY}s...`);
      showToast(`BOT CRASHED — RESTART ${autoRestartAttempts}/${AUTO_RESTART_MAX} IN ${AUTO_RESTART_DELAY}s`, 'err', AUTO_RESTART_DELAY * 1000 + 500);
      let countdown = AUTO_RESTART_DELAY;
      if (autoRestartTimer) { clearInterval(autoRestartTimer); autoRestartTimer = null; }
      autoRestartTimer = setInterval(async () => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(autoRestartTimer);
          autoRestartTimer = null;
          sysLog('AUTO-RESTART: LAUNCHING BOT...');
          const r = await launcher.launchBot();
          if (r.error) {
            errLog('AUTO-RESTART FAILED: ' + r.error);
            showToast('AUTO-RESTART FAILED', 'err', 4000);
          } else {
            showToast(`BOT AUTO-RESTARTED (${autoRestartAttempts}/${AUTO_RESTART_MAX})`, 'ok', 3000);
          }
        } else {
          sysLog(`AUTO-RESTART IN ${countdown}s...`);
        }
      }, 1000);
    }
  }
});

// ── Hotkeys ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'F1' && !e.repeat) { e.preventDefault(); toggleBot(); }
});

// ────────────────────────────────────────────
//  Cyberpunk Missing Bot Modal (2077 Style)
// ────────────────────────────────────────────

let _scrambleInterval = null;

function showMissingBotModal() {
  const modal = document.getElementById('missing-bot-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  
  // Cyberpunk HACKING text scramble for WELCOME
  const welcomeText = modal.querySelector('.cyber-mega-glitch');
  if (welcomeText) {
    // Clear any previous scramble
    if (_scrambleInterval) {
      clearInterval(_scrambleInterval);
      _scrambleInterval = null;
    }
    
    // Force reset and start fresh scramble
    welcomeText.textContent = 'XXXXXXX';
    welcomeText.style.opacity = '1';
    welcomeText.style.textShadow = 'none';
    
    // Small delay then scramble
    setTimeout(() => {
      _scrambleInterval = scrambleText(welcomeText, 'WELCOME');
    }, 100);
  }
  
  sysLog('[SYSTEM] CRITICAL: AIBOT.EXE not detected');
  sysLog('[SYSTEM] Neural link cannot be established');
}

// Cyberpunk HACKING text scramble - characters decode one by one
function scrambleText(element, finalText) {
  const chars = '!<>-_\\/[]{}—=+*^?#@$%&';
  const state = finalText.split('').map(() => chars[Math.floor(Math.random() * chars.length)]);
  let revealed = 0;
  let cycles = 0;
  const maxCycles = 40;
  
  // Show initial random text immediately
  element.textContent = state.join('');
  
  const interval = setInterval(() => {
    cycles++;
    
    // Scramble unrevealed characters
    for (let i = revealed; i < finalText.length; i++) {
      state[i] = chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Always update display to show scrambling
    element.textContent = state.join('');
    
    // Reveal characters progressively (faster at start, slower at end)
    const revealChance = 0.12 + (revealed / finalText.length) * 0.3;
    if (Math.random() < revealChance && revealed < finalText.length) {
      state[revealed] = finalText[revealed];
      element.textContent = state.join(''); // Update immediately on reveal
      
      // Flash effect on reveal
      element.style.textShadow = '0 0 15px #e0aa3a';
      setTimeout(() => element.style.textShadow = 'none', 60);
      
      revealed++;
    }
    element.setAttribute('data-text', state.join(''));
    
    // Done or timeout
    if (revealed >= finalText.length || cycles > maxCycles) {
      clearInterval(interval);
      element.textContent = finalText;
      element.setAttribute('data-text', finalText);
      
      // Final "lock in" flash
      element.style.textShadow = '0 0 30px #e0aa3a, 0 0 60px rgba(224,58,58,0.5)';
      setTimeout(() => element.style.textShadow = 'none', 200);
      
      // Rare subtle flicker after settling
      setInterval(() => {
        if (Math.random() > 0.92) {
          element.style.opacity = '0.8';
          setTimeout(() => element.style.opacity = '1', 50);
        }
      }, 4000);
    }
  }, 60);
  
  return interval; // Return so it can be cleared
}

async function dismissMissingBot() {
  const modal = document.getElementById('missing-bot-modal');
  const content = modal?.querySelector('.cyber-modal-overlay');
  
  if (modal && content) {
    // Simple smooth fade out
    content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    content.style.opacity = '0';
    content.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      modal.style.display = 'none';
      content.style.opacity = '1';
      content.style.transform = 'scale(1)';
    }, 300);
  }
  
  // Open launcher directory for manual install
  sysLog('[SYSTEM] Opening launcher directory...');
  try {
    const result = await launcher.openLauncherDir();
    if (result?.ok) {
      sysLog('[OK] Folder opened: ' + result.path);
    } else {
      sysLog('[ERROR] Failed to open folder: ' + (result?.error || 'Unknown error'));
      // Fallback: try to copy path to clipboard or show in log
      sysLog('[INFO] Please manually open: ' + (result?.path || 'launcher directory'));
    }
  } catch (e) {
    sysLog('[ERROR] openLauncherDir failed: ' + e.message);
  }
  
  sysLog('[INFO] Place AIBot.exe in the opened folder and restart launcher');
  showToast('MANUAL INSTALL', 'Place AIBot.exe in launcher folder and restart', 'warning');
}

async function downloadBot() {
  sysLog('[SYSTEM] Initiating bot download sequence...');
  
  // Show progress UI
  const progressEl = document.getElementById('bot-download-progress');
  const actionsEl = document.getElementById('bot-modal-actions');
  
  if (progressEl) progressEl.style.display = 'block';
  if (actionsEl) actionsEl.style.display = 'none';
  
  const progressBar = document.getElementById('bot-dl-bar');
  const progressPercent = document.getElementById('bot-dl-percent');
  const progressStatus = document.getElementById('bot-dl-status');
  const progressGlitch = document.getElementById('bot-dl-glitch-text');
  const progressSpeed = document.getElementById('bot-dl-speed');
  const progressSize = document.getElementById('bot-dl-size');
  
  let progress = 0;
  
  // Listen for real download progress
  launcher.onBotDownloadProgress?.((percent) => {
    progress = percent;
    if (progressBar) progressBar.style.width = percent.toFixed(1) + '%';
    if (progressPercent) progressPercent.textContent = percent.toFixed(0) + '%';
  });
  
  // Animate status messages
  const messages = ['CONNECTING...', 'DOWNLOADING...', 'INSTALLING...', 'FINALIZING...'];
  const glitchMsgs = ['INITIALIZING NEURAL LINK', 'DOWNLOADING PACKAGES', 'ASSEMBLING CORE', 'NEURAL LINK ESTABLISHED'];
  let msgIdx = 0;
  
  const msgInterval = setInterval(() => {
    if (progressStatus) progressStatus.textContent = messages[msgIdx] || 'COMPLETE';
    if (progressGlitch) progressGlitch.textContent = glitchMsgs[msgIdx] || 'SYSTEM READY';
    msgIdx = Math.min(Math.floor(progress / 25), 3);
  }, 500);
  
  // Start real download
  try {
    // Track download for speed calculation
    let startTime = Date.now();
    const totalSize = 540; // Approximate MB (will be estimated)
    
    // Animate progress while waiting for real download
    let lastProgress = 0;
    const animInterval = setInterval(() => {
      // Only animate if real progress hasn't updated recently
      if (lastProgress === progress && progress < 95) {
        progress += 0.5;
        if (progressBar) progressBar.style.width = progress.toFixed(1) + '%';
        if (progressPercent) progressPercent.textContent = progress.toFixed(0) + '%';
      }
      lastProgress = progress;
      
      // Calculate and display speed/size
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const downloaded = (progress / 100) * totalSize;
      const speed = elapsed > 0 ? (downloaded / elapsed) : 0;
      
      if (progressSpeed) progressSpeed.textContent = speed.toFixed(2) + ' MB/s';
      if (progressSize) progressSize.textContent = downloaded.toFixed(2) + ' / ' + totalSize.toFixed(2) + ' MB';
      
      // Update messages based on progress
      msgIdx = Math.min(Math.floor(progress / 25), 3);
      if (progressStatus) progressStatus.textContent = messages[msgIdx] || 'COMPLETE';
      if (progressGlitch) progressGlitch.textContent = glitchMsgs[msgIdx] || 'SYSTEM READY';
    }, 200);
    
    // Listen for real download progress
    launcher.onBotDownloadProgress?.((percent) => {
      progress = percent;
      lastProgress = percent;
      
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // seconds
      const downloaded = (percent / 100) * totalSize;
      const speed = elapsed > 0 ? (downloaded / elapsed) : 0;
      
      if (progressBar) progressBar.style.width = percent.toFixed(1) + '%';
      if (progressPercent) progressPercent.textContent = percent.toFixed(0) + '%';
      if (progressSpeed) progressSpeed.textContent = speed.toFixed(2) + ' MB/s';
      if (progressSize) progressSize.textContent = downloaded.toFixed(2) + ' / ' + totalSize.toFixed(2) + ' MB';
    });
    
    const result = await launcher.downloadBot();
    clearInterval(animInterval);
    clearInterval(msgInterval);
    
    if (result?.ok) {
      // Force 100%
      if (progressBar) progressBar.style.width = '100%';
      if (progressPercent) progressPercent.textContent = '100%';
      
      sysLog('[SYSTEM] AIBOT.EXE downloaded successfully');
      sysLog('[SYSTEM] Bot version: ' + (result.version || 'unknown'));
      
      // Stop all animated dots when download completes
      stopAllDots();

      // Save version to config so checkUpdate won't re-trigger
      if (result.version && _config) {
        _config.bot_version = result.version;
        await launcher.saveConfig(_config);
        sysLog('[SYSTEM] Bot version saved to config: ' + result.version);
      }
      
      // Update version badge in UI
      const botVersionBadge = document.getElementById('version-badge');
      if (botVersionBadge && result.version) {
        botVersionBadge.textContent = 'v' + result.version;
      }
      
      // Smooth close missing-bot modal then show restart modal
      setTimeout(() => {
        const modal = document.getElementById('missing-bot-modal');
        const content = modal?.querySelector('.cyber-modal-overlay');
        if (content) {
          content.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          content.style.opacity = '0';
          content.style.transform = 'scale(0.95)';
          setTimeout(() => {
            modal.style.display = 'none';
            showRestartModal('—', result.version || '—');
          }, 350);
        } else {
          showRestartModal('—', result.version || '—');
        }
      }, 800);
    } else {
      clearInterval(animInterval);
      clearInterval(msgInterval);
      const errMsg = result?.error || 'Unknown error';
      sysLog('[ERROR] Bot download failed: ' + errMsg);
      if (progressStatus) progressStatus.textContent = 'ERROR';
      if (progressGlitch) progressGlitch.textContent = 'DOWNLOAD FAILED';
      if (progressBar) progressBar.style.background = '#ff003c';
      showToast('DOWNLOAD ERROR: ' + errMsg, 'err', 8000);
      setTimeout(() => {
        if (progressEl) progressEl.style.display = 'none';
        if (actionsEl) actionsEl.style.display = 'flex';
      }, 3000);
    }
  } catch (e) {
    clearInterval(msgInterval);
    const errMsg = e.message || String(e);
    sysLog('[ERROR] Download error: ' + errMsg);
    if (progressStatus) progressStatus.textContent = 'ERROR';
    if (progressGlitch) progressGlitch.textContent = 'DOWNLOAD FAILED';
    if (progressBar) progressBar.style.background = '#ff003c';
    showToast('DOWNLOAD ERROR: ' + errMsg, 'err', 8000);
    setTimeout(() => {
      if (progressEl) progressEl.style.display = 'none';
      if (actionsEl) actionsEl.style.display = 'flex';
    }, 3000);
  }
}

// Simulation fallback
function simulateDownload() {
  const progressBar = document.getElementById('bot-dl-bar');
  const progressPercent = document.getElementById('bot-dl-percent');
  const progressStatus = document.getElementById('bot-dl-status');
  const progressGlitch = document.getElementById('bot-dl-glitch-text');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      setTimeout(() => {
        const modal = document.getElementById('missing-bot-modal');
        const content = modal?.querySelector('.cyber-modal-overlay');
        if (content) {
          content.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          content.style.opacity = '0';
          content.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            modal.style.display = 'none';
            showToast('BOT INSTALLED', 'AIBot.exe ready. Launch when ready.', 'success');
          }, 400);
        }
      }, 600);
    }
    
    if (progressBar) progressBar.style.width = progress.toFixed(1) + '%';
    if (progressPercent) progressPercent.textContent = progress.toFixed(0) + '%';
    if (progressStatus) progressStatus.textContent = progress < 50 ? 'DOWNLOADING...' : 'INSTALLING...';
    if (progressGlitch) progressGlitch.textContent = progress < 50 ? 'DOWNLOADING PACKAGES' : 'ASSEMBLING CORE';
  }, 100);
}

// Check if bot exists on startup
async function checkBotExists() {
  try {
    const result = await launcher.botExists();
    if (!result?.exists) {
      setTimeout(() => showMissingBotModal(), 1000);
    } else {
      // Update version badge if bot exists — use config version as source of truth
      const botVersion = document.getElementById('version-badge');
      if (botVersion) {
        const ver = result.version || _config?.bot_version || _config?.version || null;
        botVersion.textContent = ver ? 'v' + ver : 'v—';
      }
    }
  } catch (e) {
    // Show modal for testing if IPC fails
    console.log('[DEBUG] Bot check failed, showing modal:', e.message);
    setTimeout(() => showMissingBotModal(), 2000);
  }
}

// ────────────────────────────────────────────
//  Init
// ────────────────────────────────────────────
(async () => {
  await loadConfigUI();
  initNeuralDirtyTracking();
  _syncTuningFromAdvanced();
  ['aggression','survival','gather','mobility'].forEach(id => {
    const v = Number(document.getElementById('tuning-' + id)?.value || 5);
    _updateTuningFill(id, v);
    _tuningHeatUpdate(id, v);
  });
  const s = await launcher.botStatus();
  setBotRunning(s.running, true);
  _syncCoreAccordion(document.querySelector('.nav-item.active')?.dataset?.tab || '');
  
  // Initialize statusbar state
  if (!s.running) _offlineStatusBar();

  // Initialize diagnostics to OFFLINE
  updateDiagScores({ threatScore: 0, survivalScore: 0, resourceScore: 0, status: 'OFFLINE' });
  updateCombatDiag({ mode: '—', targetDist: null, weapon: '—', lastAction: '—', status: 'OFFLINE' });
  updateWatchdogDiag({ lastCheck: '—', lockHolder: 'NONE', pathStatus: '—', status: 'OFFLINE' });
  updateResourceDiag({ trees: 0, ores: 0, fallbacks: 0, dangerStops: 0, status: 'OFFLINE' });
  // Initialize inventory
  const invBadge = document.getElementById('inv-status-badge');
  if (invBadge) {
    invBadge.textContent = 'OFFLINE';
    invBadge.classList.remove('online');
  }
  
  // Check if bot exists (show cyberpunk modal if missing)
  checkBotExists();
  // Check for launcher updates after 2s delay, then every 30 minutes
  setTimeout(() => {
    checkLauncherUpdate();
    // Periodic check every 30 minutes
    setInterval(checkLauncherUpdate, 30 * 60 * 1000);
  }, 2000);
})();

// ────────────────────────────────────────────
//  Restart Modal
// ────────────────────────────────────────────
function showRestartModal(oldVersion, newVersion) {
  const modal = document.getElementById('restart-modal');
  const oldEl = document.getElementById('restart-ver-old');
  const newEl = document.getElementById('restart-ver-new');
  if (!modal) return;

  if (oldEl) oldEl.textContent = oldVersion !== '—' ? 'v' + oldVersion : 'v—';
  if (newEl) newEl.textContent = newVersion !== '—' ? 'v' + newVersion : 'v—';

  modal.style.display = 'flex';
  // Trigger glitch on title
  const title = document.getElementById('restart-title-text');
  if (title) {
    setTimeout(() => applyGlitchEffect(title), 200);
    setInterval(() => applyGlitchEffect(title), 4000);
  }
}

function doRelaunch() {
  const btn = document.querySelector('.restart-btn');
  if (btn) {
    btn.disabled = true;
    const span = btn.querySelector('.cyber-btn-text');
    if (span) span.textContent = '[ RESTARTING... ]';
  }
  setTimeout(() => launcher.relaunch(), 400);
}
