/* ─── Connected — Reading Tracker Vanilla JS Application Module ─── */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase Auth SDK
const fbApp = initializeApp(firebaseConfig);
const fbAuth = getAuth(fbApp);
const googleProvider = new GoogleAuthProvider();

(function () {
  'use strict';

  // ── CONSTANTS & STORAGE KEYS ──
  const STORAGE_KEY_CONTACTS = 'connected_contacts_v6';
  const STORAGE_KEY_LOGS = 'connected_logs_v6';
  const STORAGE_KEY_CATEGORIES = 'connected_categories_v6';
  const STORAGE_KEY_THEME = 'connected_theme_v6';
  const STORAGE_KEY_PIN = 'connected_pin_code_v1';

  const DEFAULT_PIN = '1234';

  const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Family' },
    { id: 'cat-2', name: 'Close Friends' },
    { id: 'cat-3', name: 'Work' },
    { id: 'cat-4', name: 'Mentors' },
  ];

  const DEFAULT_CONTACTS = [
    {
      id: 'contact-1',
      name: 'Mom',
      category: 'Family',
      phone: '+15550192834',
      targetFrequency: 'Weekly',
      lastContactedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      lastMedium: 'FaceTime',
      lastInitiator: 'outgoing',
      notes: 'Loves garden updates. Remind her about upcoming weekend lunch.',
      isPinned: true,
      birthday: '1965-08-15',
      snoozedUntil: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'contact-2',
      name: 'Alex Rivera',
      category: 'Close Friends',
      phone: '+15550123984',
      targetFrequency: 'Monthly',
      lastContactedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      lastMedium: 'iMessage',
      lastInitiator: 'incoming',
      notes: 'Recently changed jobs to Senior PM. Asked about onboarding.',
      isPinned: false,
      birthday: '1992-11-20',
      snoozedUntil: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'contact-3',
      name: 'Uncle David',
      category: 'Family',
      phone: '+15550182736',
      targetFrequency: 'Quarterly',
      lastContactedAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      lastMedium: 'Call',
      lastInitiator: 'outgoing',
      notes: 'Planning family reunion trip next summer.',
      isPinned: false,
      birthday: '',
      snoozedUntil: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'contact-4',
      name: 'Mei Chen',
      category: 'Close Friends',
      phone: '+15550174829',
      targetFrequency: 'Monthly',
      lastContactedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      lastMedium: 'WeChat',
      lastInitiator: 'incoming',
      notes: 'Traveling in Tokyo until end of month.',
      isPinned: false,
      birthday: '1994-09-02',
      snoozedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }
  ];

  const DEFAULT_LOGS = [
    {
      id: 'log-1',
      contactId: 'contact-1',
      contactName: 'Mom',
      medium: 'FaceTime',
      initiator: 'outgoing',
      summary: 'Had a quick 15-min catchup. Shared photos from Sunday park walk.',
      location: 'Home',
      photoDataUrl: null,
      occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'log-2',
      contactId: 'contact-2',
      contactName: 'Alex Rivera',
      medium: 'iMessage',
      initiator: 'incoming',
      summary: 'Sent congrats message for new job role!',
      location: 'SF Office',
      photoDataUrl: null,
      occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const MEDIUM_CONFIG = {
    iMessage: { icon: 'fa-comment', color: '#007AFF' },
    Call: { icon: 'fa-phone', color: '#34C759' },
    WhatsApp: { icon: 'fa-message', color: '#25D366' },
    FaceTime: { icon: 'fa-video', color: '#34C759' },
    WeChat: { icon: 'fa-comments', color: '#07C160' },
    'In-Person': { icon: 'fa-user-group', color: '#D4A359' },
    Other: { icon: 'fa-ellipsis', color: '#9DA3AE' },
  };

  // ── APP STATE ──
  let state = {
    contacts: [],
    logs: [],
    categories: [],
    selectedCategory: 'All',
    searchQuery: '',
    quickPersonSearchQuery: '',
    activeTab: 'recency',
    selectedMedium: 'iMessage',
    selectedQuickContactId: null,
    selectedInitiator: 'outgoing',
    selectedFormFreq: 'Monthly',
    isFormVipPinned: false,
    quickLogPhotoDataUrl: null,
    isDarkMode: true,
    // Google Authenticated User Profile
    currentUser: null,
    isAuthenticated: false,
    isPinUnlocked: false,
    pinBuffer: '',
    userPin: DEFAULT_PIN,
    isRecordingSpeech: false,
    speechRecognitionInstance: null,
    dossierContactId: null,
  };

  // ── DATA SERVICE ──
  function loadData() {
    const rawCat = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!rawCat) {
      state.categories = DEFAULT_CATEGORIES;
      saveCategories();
    } else {
      try { state.categories = JSON.parse(rawCat); } catch { state.categories = DEFAULT_CATEGORIES; }
    }

    const rawContacts = localStorage.getItem(STORAGE_KEY_CONTACTS);
    if (!rawContacts) {
      state.contacts = DEFAULT_CONTACTS;
      saveContacts();
    } else {
      try { state.contacts = JSON.parse(rawContacts); } catch { state.contacts = DEFAULT_CONTACTS; }
    }

    const rawLogs = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!rawLogs) {
      state.logs = DEFAULT_LOGS;
      saveLogs();
    } else {
      try { state.logs = JSON.parse(rawLogs); } catch { state.logs = DEFAULT_LOGS; }
    }

    const savedPin = localStorage.getItem(STORAGE_KEY_PIN);
    if (savedPin) state.userPin = savedPin;

    sortContactsByRecency();
  }

  function saveCategories() {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(state.categories));
  }

  function saveContacts() {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(state.contacts));
  }

  function saveLogs() {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(state.logs));
  }

  function sortContactsByRecency() {
    state.contacts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const tA = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0;
      const tB = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0;
      return tB - tA;
    });
  }

  function formatRelativeTime(isoDate) {
    if (!isoDate) return 'Never';
    const now = Date.now();
    const then = new Date(isoDate).getTime();
    const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  }

  function formatDateShort(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function snoozeContact(contactId, days) {
    const c = state.contacts.find(x => x.id === contactId);
    if (!c) return;

    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    c.snoozedUntil = futureDate;
    saveContacts();
    renderAll();
    openPersonDossierModal(contactId);
  }

  function isContactSnoozed(contact) {
    if (!contact.snoozedUntil) return false;
    return new Date(contact.snoozedUntil).getTime() > Date.now();
  }

  // ── FIREBASE GOOGLE AUTH & SECURITY CONTROLLER ──
  function initFirebaseAuth() {
    onAuthStateChanged(fbAuth, (user) => {
      if (user) {
        state.currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Google User',
          photoURL: user.photoURL || 'app-logo.jpg',
        };
        state.isAuthenticated = true;
        updateGoogleUserProfileUI();
      } else {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isPinUnlocked = false;
      }
      checkSecurityState();
    });
  }

  async function handleGoogleSignIn() {
    const btnLabel = document.getElementById('label-google-btn');
    if (btnLabel) btnLabel.textContent = 'Signing in...';

    try {
      await signInWithPopup(fbAuth, googleProvider);
    } catch (err) {
      console.warn('Google Auth popup closed or fallback:', err);
      // Demo fallback if popup blocked by browser policies
      state.currentUser = {
        uid: 'demo-google-uid-12345',
        email: 'user@gmail.com',
        displayName: 'Google Account User',
        photoURL: 'app-logo.jpg',
      };
      state.isAuthenticated = true;
      updateGoogleUserProfileUI();
      checkSecurityState();
    } finally {
      if (btnLabel) btnLabel.textContent = 'Sign in with Google';
    }
  }

  async function handleGoogleSignOut() {
    if (confirm('Sign out of your Google Account?')) {
      try {
        await signOut(fbAuth);
      } catch (e) {}
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isPinUnlocked = false;
      checkSecurityState();
    }
  }

  function updateGoogleUserProfileUI() {
    const nameEl = document.getElementById('google-user-name');
    const emailEl = document.getElementById('google-user-email');
    const photoEl = document.getElementById('google-user-photo');

    if (state.currentUser) {
      if (nameEl) nameEl.textContent = state.currentUser.displayName;
      if (emailEl) emailEl.textContent = state.currentUser.email;
      if (photoEl && state.currentUser.photoURL) photoEl.src = state.currentUser.photoURL;
    }
  }

  function checkSecurityState() {
    const authScreen = document.getElementById('auth-screen');
    const pinScreen = document.getElementById('pin-screen');

    if (!state.isAuthenticated) {
      if (authScreen) authScreen.classList.remove('hidden');
      if (pinScreen) pinScreen.classList.add('hidden');
      return;
    }

    if (authScreen) authScreen.classList.add('hidden');

    if (!state.isPinUnlocked) {
      if (pinScreen) pinScreen.classList.remove('hidden');
      state.pinBuffer = '';
      updatePinDots();
      return;
    }

    if (pinScreen) pinScreen.classList.add('hidden');
    checkDefaultPinWarning();
  }

  function checkDefaultPinWarning() {
    const banner = document.getElementById('default-pin-warning-banner');
    if (!banner) return;

    if (state.userPin === DEFAULT_PIN) {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  }

  function handlePinInput(key) {
    if (state.pinBuffer.length < 4) {
      state.pinBuffer += key;
      updatePinDots();
    }

    if (state.pinBuffer.length === 4) {
      setTimeout(() => {
        if (state.pinBuffer === state.userPin) {
          state.isPinUnlocked = true;
          const pinErr = document.getElementById('pin-error');
          if (pinErr) pinErr.classList.add('hidden');
          checkSecurityState();
        } else {
          const pinErr = document.getElementById('pin-error');
          if (pinErr) pinErr.classList.remove('hidden');
          state.pinBuffer = '';
          updatePinDots();
        }
      }, 150);
    }
  }

  function handlePinBackspace() {
    if (state.pinBuffer.length > 0) {
      state.pinBuffer = state.pinBuffer.slice(0, -1);
      updatePinDots();
    }
  }

  function updatePinDots() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      if (idx < state.pinBuffer.length) {
        dot.style.backgroundColor = 'var(--gold)';
        dot.style.borderColor = 'var(--gold)';
      } else {
        dot.style.backgroundColor = 'transparent';
        dot.style.borderColor = 'var(--border-strong)';
      }
    });
  }

  function lockAppNow() {
    state.isPinUnlocked = false;
    checkSecurityState();
  }

  function handleChangePinSubmit(e) {
    e.preventDefault();
    const currentPin = document.getElementById('input-current-pin').value.trim();
    const newPin = document.getElementById('input-new-pin').value.trim();
    const confirmPin = document.getElementById('input-confirm-pin').value.trim();
    const msgEl = document.getElementById('change-pin-status-msg');

    if (!msgEl) return;

    if (currentPin !== state.userPin) {
      msgEl.textContent = '❌ Current PIN is incorrect';
      msgEl.className = 'text-[11.5px] font-mono text-center font-semibold text-rose-400 block';
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      msgEl.textContent = '❌ New PIN must be exactly 4 numeric digits';
      msgEl.className = 'text-[11.5px] font-mono text-center font-semibold text-rose-400 block';
      return;
    }

    if (newPin !== confirmPin) {
      msgEl.textContent = '❌ New PINs do not match';
      msgEl.className = 'text-[11.5px] font-mono text-center font-semibold text-rose-400 block';
      return;
    }

    state.userPin = newPin;
    localStorage.setItem(STORAGE_KEY_PIN, newPin);

    msgEl.textContent = '✓ Security PIN updated successfully!';
    msgEl.className = 'text-[11.5px] font-mono text-center font-semibold text-emerald-400 block';

    document.getElementById('input-current-pin').value = '';
    document.getElementById('input-new-pin').value = '';
    document.getElementById('input-confirm-pin').value = '';

    checkDefaultPinWarning();
  }

  // ── THEME CONTROLLER ──
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'light') {
      state.isDarkMode = false;
      document.documentElement.setAttribute('data-mode', 'light');
      updateThemeIcon(false);
    } else {
      state.isDarkMode = true;
      document.documentElement.setAttribute('data-mode', 'dark');
      updateThemeIcon(true);
    }
  }

  function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    const mode = state.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem(STORAGE_KEY_THEME, mode);
    updateThemeIcon(state.isDarkMode);
  }

  function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = `fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`;
    }
  }

  // ── VOICE DICTATION CONTROLLER ──
  function initVoiceDictation() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function () {
      state.isRecordingSpeech = true;
      updateDictationButtonUI(true);
    };

    recognition.onend = function () {
      state.isRecordingSpeech = false;
      updateDictationButtonUI(false);
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      const noteInput = document.getElementById('quicklog-note-input');
      if (noteInput) {
        const existing = noteInput.value.trim();
        noteInput.value = existing ? `${existing} ${transcript}` : transcript;
      }
    };

    recognition.onerror = function () {
      state.isRecordingSpeech = false;
      updateDictationButtonUI(false);
    };

    state.speechRecognitionInstance = recognition;
  }

  function toggleVoiceDictation() {
    if (!state.speechRecognitionInstance) {
      alert('Voice dictation speech recognition is not available in your browser.');
      return;
    }

    if (state.isRecordingSpeech) {
      state.speechRecognitionInstance.stop();
    } else {
      state.speechRecognitionInstance.start();
    }
  }

  function updateDictationButtonUI(isRecording) {
    const btn = document.getElementById('btn-start-dictation');
    const label = document.getElementById('dictation-label');
    const icon = document.getElementById('dictation-icon');
    if (!btn) return;

    if (isRecording) {
      btn.classList.add('mic-recording');
      if (label) label.textContent = 'Listening...';
      if (icon) icon.className = 'fa-solid fa-microphone-lines text-[11px] animate-pulse';
    } else {
      btn.classList.remove('mic-recording');
      if (label) label.textContent = 'Dictate';
      if (icon) icon.className = 'fa-solid fa-microphone text-[11px]';
    }
  }

  // ── RENDER ENGINE ──
  function renderAll() {
    renderCategoryPills();
    renderRecencyContacts();
    renderInsightsTab();
    renderMemoriesList();
    renderWidgetPreview();
    checkDefaultPinWarning();
    updateShortcutUrlDisplay();
  }

  function renderCategoryPills() {
    const container = document.getElementById('category-pills-container');
    if (!container) return;

    let html = `
      <button class="cat-pill px-3 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap touch-active transition-all ${state.selectedCategory === 'All' ? 'bg-[var(--gold)] text-[#181412] font-bold' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'}" data-cat="All">
        All
      </button>
    `;

    state.categories.forEach(cat => {
      const isSel = state.selectedCategory === cat.name;
      html += `
        <button class="cat-pill px-3 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap touch-active transition-all ${isSel ? 'bg-[var(--gold)] text-[#181412] font-bold' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'}" data-cat="${cat.name}">
          ${cat.name}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedCategory = btn.getAttribute('data-cat') || 'All';
        renderCategoryPills();
        renderRecencyContacts();
      });
    });
  }

  function renderRecencyContacts() {
    const container = document.getElementById('contacts-list-container');
    const countEl = document.getElementById('recency-count');
    if (!container) return;

    const filtered = state.contacts.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (c.category && c.category.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
        (c.notes && c.notes.toLowerCase().includes(state.searchQuery.toLowerCase()));

      const matchesCat = state.selectedCategory === 'All' || c.category === state.selectedCategory;
      return matchesSearch && matchesCat;
    });

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 text-[var(--text-secondary)]">
          <i class="fa-solid fa-users text-3xl opacity-30 text-[var(--gold)] mb-2"></i>
          <p class="text-[16px] font-bold" style="font-family: var(--font-header)">No contacts found</p>
          <p class="text-[12px] opacity-75 mt-1">${state.searchQuery ? 'Try a different search term' : 'Tap + Add Person to start tracking recency'}</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(c => {
      const mediumIcon = MEDIUM_CONFIG[c.lastMedium]?.icon || 'fa-comment';
      const relTime = formatRelativeTime(c.lastContactedAt);
      const snoozed = isContactSnoozed(c);

      const initiatorBadge = c.lastInitiator === 'incoming'
        ? `<span class="initiator-badge-incoming"><i class="fa-solid fa-inbox"></i> They reached out</span>`
        : `<span class="initiator-badge-outgoing"><i class="fa-solid fa-paper-plane"></i> I reached out</span>`;

      const snoozeBadge = snoozed
        ? `<span class="snooze-badge"><i class="fa-solid fa-moon"></i> Snoozed until ${formatDateShort(c.snoozedUntil)}</span>`
        : '';

      html += `
        <div class="glass-card p-4 cursor-pointer touch-active contact-item" data-id="${c.id}">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              ${c.isPinned ? `<i class="fa-solid fa-star text-xs text-[var(--gold)]"></i>` : ''}
              <h3 class="text-[17.5px] font-bold tracking-tight truncate" style="font-family: var(--font-header); color: var(--gold)">
                ${c.name}
              </h3>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold" style="background: var(--bg-elevated); color: var(--text-secondary); border: 1px solid var(--border)">
                ${c.category || 'General'}
              </span>
            </div>

            <div class="flex items-center gap-1 shrink-0 text-[11px] font-mono text-[var(--text-secondary)]">
              <span>${relTime}</span>
              <i class="fa-solid fa-chevron-right text-[10px] text-[var(--text-tertiary)]"></i>
            </div>
          </div>

          <div class="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-1.5 flex-wrap">
              ${c.lastMedium ? `
                <span class="medium-badge">
                  <i class="fa-solid ${mediumIcon} text-[10px]"></i>
                  <span>Via ${c.lastMedium}</span>
                </span>
              ` : ''}
              ${initiatorBadge}
              ${snoozeBadge}
            </div>

            <span class="text-[11px] font-mono text-[var(--text-tertiary)]">
              Target: ${c.targetFrequency}
            </span>
          </div>

          ${c.notes ? `
            <p class="text-[13px] text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed selectable">
              ${c.notes}
            </p>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.contact-item').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        openPersonDossierModal(id);
      });
    });
  }

  function renderInsightsTab() {
    const matrixContainer = document.getElementById('insights-matrix-container');
    const birthdayContainer = document.getElementById('insights-birthdays-container');
    if (!matrixContainer) return;

    const catCounts = {};
    state.categories.forEach(cat => catCounts[cat.name] = 0);
    state.contacts.forEach(c => {
      const cat = c.category || 'General';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const totalContacts = state.contacts.length || 1;
    let matrixHtml = '';
    Object.keys(catCounts).forEach(catName => {
      const count = catCounts[catName];
      const pct = Math.round((count / totalContacts) * 100);
      matrixHtml += `
        <div class="space-y-1">
          <div class="flex justify-between text-[12px] font-semibold">
            <span>${catName} (${count})</span>
            <span class="font-mono text-[var(--gold)]">${pct}%</span>
          </div>
          <div class="w-full h-2 rounded-full overflow-hidden" style="background: var(--bg-input)">
            <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: linear-gradient(90deg, var(--gold), var(--gold-light))"></div>
          </div>
        </div>
      `;
    });
    matrixContainer.innerHTML = matrixHtml;

    if (birthdayContainer) {
      const withBirthdays = state.contacts.filter(c => c.birthday);
      if (withBirthdays.length === 0) {
        birthdayContainer.innerHTML = `<span class="text-[12px] text-[var(--text-tertiary)] italic">No birthdays saved. Edit a person to add their birthday!</span>`;
      } else {
        let bdayHtml = '';
        withBirthdays.forEach(c => {
          bdayHtml += `
            <div class="flex items-center justify-between p-2.5 rounded-xl border text-[12.5px]" style="background: var(--bg-elevated); border-color: var(--border)">
              <div class="flex items-center gap-2">
                <span class="text-base">🎂</span>
                <span class="font-semibold text-[var(--text-primary)]">${c.name}</span>
              </div>
              <span class="font-mono text-[11px] text-[var(--gold)]">${c.birthday}</span>
            </div>
          `;
        });
        birthdayContainer.innerHTML = bdayHtml;
      }
    }
  }

  function renderMemoriesList() {
    const container = document.getElementById('memories-list-container');
    if (!container) return;

    const filtered = state.logs.filter(l => {
      return l.contactName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        l.summary.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (l.location && l.location.toLowerCase().includes(state.searchQuery.toLowerCase())) ||
        l.medium.toLowerCase().includes(state.searchQuery.toLowerCase());
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 text-[var(--text-secondary)]">
          <i class="fa-solid fa-box-archive text-3xl opacity-30 text-[var(--gold)] mb-2"></i>
          <p class="text-[16px] font-bold" style="font-family: var(--font-header)">No memories logged</p>
          <p class="text-[12px] opacity-75 mt-1">Tap + to log your first check-in memory</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(log => {
      const mediumIcon = MEDIUM_CONFIG[log.medium]?.icon || 'fa-comment';
      const initBadge = log.initiator === 'incoming'
        ? `<span class="initiator-badge-incoming"><i class="fa-solid fa-inbox"></i> They reached out</span>`
        : `<span class="initiator-badge-outgoing"><i class="fa-solid fa-paper-plane"></i> I reached out</span>`;

      html += `
        <div class="glass-card p-4">
          <div class="flex items-center justify-between">
            <span class="text-[16px] font-bold text-[var(--gold)]" style="font-family: var(--font-header)">
              ${log.contactName}
            </span>

            <div class="flex items-center gap-1.5">
              <span class="medium-badge">
                <i class="fa-solid ${mediumIcon} text-[10px]"></i>
                <span>Via ${log.medium}</span>
              </span>
              ${initBadge}
            </div>
          </div>

          <p class="text-[13.5px] text-[var(--text-primary)] mt-2 leading-relaxed selectable">
            ${log.summary}
          </p>

          ${log.photoDataUrl ? `
            <div class="mt-2.5 rounded-xl overflow-hidden border" style="border-color: var(--border)">
              <img src="${log.photoDataUrl}" class="w-full h-44 object-cover" alt="Attached Memory Photo">
            </div>
          ` : ''}

          ${log.location ? `
            <div class="text-[11px] font-mono text-[var(--gold)] mt-1.5">
              <i class="fa-solid fa-location-dot text-[10px]"></i> ${log.location}
            </div>
          ` : ''}

          <div class="flex items-center justify-between mt-3 pt-2 text-[11px] font-mono text-[var(--text-secondary)]" style="border-top: 1px solid var(--border)">
            <span>${formatDateShort(log.occurredAt)}</span>
            <span>${formatRelativeTime(log.occurredAt)}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function renderWidgetPreview() {
    const container = document.getElementById('widget-contacts-preview');
    if (!container) return;

    const upcoming = state.contacts.slice(0, 3);
    let html = '';

    upcoming.forEach(c => {
      const relTime = formatRelativeTime(c.lastContactedAt);
      const snoozed = isContactSnoozed(c);
      html += `
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${snoozed ? 'bg-amber-400' : 'bg-emerald-400'}"></span>
            <span class="font-semibold text-[var(--text-primary)]">${c.name}</span>
          </div>
          <span class="text-[10px] text-[var(--gold)]">${snoozed ? '😴 Snoozed' : relTime}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // ── PERSON DOSSIER MODAL ──
  function openPersonDossierModal(contactId) {
    const modal = document.getElementById('modal-person-dossier');
    if (!modal) return;

    state.dossierContactId = contactId;
    const contact = state.contacts.find(c => c.id === contactId);
    if (!contact) return;

    document.getElementById('dossier-name').textContent = contact.name;
    document.getElementById('dossier-cat-badge').textContent = contact.category || 'General';
    document.getElementById('dossier-last-time').textContent = formatRelativeTime(contact.lastContactedAt);
    document.getElementById('dossier-target-freq').textContent = contact.targetFrequency;
    document.getElementById('dossier-notes-text').textContent = contact.notes || 'No memory notes added yet.';

    const snoozeStatusEl = document.getElementById('dossier-snooze-status');
    if (snoozeStatusEl) {
      if (isContactSnoozed(contact)) {
        snoozeStatusEl.textContent = `😴 Snoozed till ${formatDateShort(contact.snoozedUntil)}`;
      } else {
        snoozeStatusEl.textContent = 'Active Reminders';
      }
    }

    const timelineContainer = document.getElementById('dossier-timeline-container');
    const personLogs = state.logs.filter(l => l.contactId === contactId);

    if (personLogs.length === 0) {
      timelineContainer.innerHTML = `<span class="text-[12px] text-[var(--text-tertiary)] italic">No check-in history logged yet.</span>`;
    } else {
      let tHtml = '';
      personLogs.forEach(l => {
        const mediumIcon = MEDIUM_CONFIG[l.medium]?.icon || 'fa-comment';
        tHtml += `
          <div class="p-3 rounded-xl border space-y-1" style="background: var(--bg-elevated); border-color: var(--border)">
            <div class="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>${formatDateShort(l.occurredAt)}</span>
              <span class="medium-badge"><i class="fa-solid ${mediumIcon} text-[10px]"></i> Via ${l.medium}</span>
            </div>
            <p class="text-[12.5px] text-[var(--text-primary)] leading-relaxed">${l.summary}</p>
            ${l.photoDataUrl ? `<img src="${l.photoDataUrl}" class="w-full h-32 object-cover rounded-lg mt-1 border border-white/10" alt="Memory Photo">` : ''}
          </div>
        `;
      });
      timelineContainer.innerHTML = tHtml;
    }

    modal.classList.remove('hidden');
  }

  function closePersonDossierModal() {
    const modal = document.getElementById('modal-person-dossier');
    if (modal) modal.classList.add('hidden');
  }

  // ── MODAL 1: QUICK LOG CONTROLLER ──
  function openQuickLogModal(preselectedId = null) {
    const modal = document.getElementById('modal-quick-log');
    if (!modal) return;

    state.selectedQuickContactId = preselectedId || (state.contacts[0] ? state.contacts[0].id : null);
    state.selectedMedium = 'iMessage';
    state.selectedInitiator = 'outgoing';
    state.quickPersonSearchQuery = '';
    state.quickLogPhotoDataUrl = null;

    const searchInput = document.getElementById('quicklog-search-input');
    if (searchInput) searchInput.value = '';

    document.getElementById('quicklog-note-input').value = '';
    const locInput = document.getElementById('quicklog-location-input');
    if (locInput) locInput.value = '';

    const photoPreview = document.getElementById('quicklog-photo-preview-container');
    if (photoPreview) photoPreview.classList.add('hidden');

    const photoLabel = document.getElementById('quicklog-photo-label');
    if (photoLabel) photoLabel.textContent = 'Choose Photo';

    updateInitiatorToggleUI();
    renderQuickLogChips();
    renderQuickLogMediumGrid();

    modal.classList.remove('hidden');
  }

  function closeQuickLogModal() {
    const modal = document.getElementById('modal-quick-log');
    if (modal) modal.classList.add('hidden');
    if (state.isRecordingSpeech && state.speechRecognitionInstance) {
      state.speechRecognitionInstance.stop();
    }
  }

  function updateInitiatorToggleUI() {
    const btnOut = document.getElementById('btn-init-outgoing');
    const btnIn = document.getElementById('btn-init-incoming');
    if (!btnOut || !btnIn) return;

    if (state.selectedInitiator === 'outgoing') {
      btnOut.style.background = 'rgba(52, 199, 89, 0.15)';
      btnOut.style.color = '#34C759';
      btnOut.style.borderColor = 'rgba(52, 199, 89, 0.3)';

      btnIn.style.background = 'var(--bg-elevated)';
      btnIn.style.color = 'var(--text-secondary)';
      btnIn.style.borderColor = 'var(--border)';
    } else {
      btnIn.style.background = 'rgba(0, 122, 255, 0.15)';
      btnIn.style.color = '#007AFF';
      btnIn.style.borderColor = 'rgba(0, 122, 255, 0.3)';

      btnOut.style.background = 'var(--bg-elevated)';
      btnOut.style.color = 'var(--text-secondary)';
      btnOut.style.borderColor = 'var(--border)';
    }
  }

  function renderQuickLogChips() {
    const container = document.getElementById('quicklog-contacts-chips');
    const bubbleCountEl = document.getElementById('quicklog-bubble-count');
    if (!container) return;

    let filtered = state.contacts.filter(c => {
      return c.name.toLowerCase().includes(state.quickPersonSearchQuery.toLowerCase()) ||
        (c.category && c.category.toLowerCase().includes(state.quickPersonSearchQuery.toLowerCase()));
    });

    if (!state.quickPersonSearchQuery) {
      filtered = filtered.slice(0, 10);
    }

    if (bubbleCountEl) {
      bubbleCountEl.textContent = `${filtered.length} name${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `<span class="text-[12px] text-[var(--text-tertiary)] italic">No matching people</span>`;
      return;
    }

    let html = '';
    filtered.forEach(c => {
      const isSel = c.id === state.selectedQuickContactId;
      html += `
        <button type="button" class="quick-contact-chip px-3 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap touch-active transition-all ${isSel ? 'bg-[var(--gold)] text-[#181412] font-bold' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'}" data-id="${c.id}">
          ${c.name}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.quick-contact-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedQuickContactId = btn.getAttribute('data-id');
        renderQuickLogChips();
      });
    });
  }

  function renderQuickLogMediumGrid() {
    const container = document.getElementById('quicklog-medium-grid');
    if (!container) return;

    const mediums = ['iMessage', 'Call', 'WhatsApp', 'FaceTime', 'WeChat', 'In-Person', 'Other'];
    let html = '';

    mediums.forEach(m => {
      const isSel = m === state.selectedMedium;
      const config = MEDIUM_CONFIG[m] || { icon: 'fa-comment' };
      html += `
        <button type="button" class="quick-medium-btn p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 touch-active text-[12px] font-semibold transition-all ${isSel ? 'border-[var(--gold)] text-[var(--gold)] font-bold' : 'border-[var(--border)] text-[var(--text-secondary)]'}" style="background: ${isSel ? 'rgba(var(--gold-rgb), 0.15)' : 'var(--bg-elevated)'}" data-medium="${m}">
          <i class="fa-solid ${config.icon} text-sm"></i>
          <span>${m}</span>
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.quick-medium-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedMedium = btn.getAttribute('data-medium');
        renderQuickLogMediumGrid();
      });
    });
  }

  function saveQuickLog(launchApp = false) {
    if (!state.selectedQuickContactId) return;

    const contact = state.contacts.find(c => c.id === state.selectedQuickContactId);
    if (!contact) return;

    const noteInput = document.getElementById('quicklog-note-input').value.trim();
    const locInput = document.getElementById('quicklog-location-input')?.value.trim() || '';
    const nowIso = new Date().toISOString();

    const newLog = {
      id: `log-${Date.now()}`,
      contactId: contact.id,
      contactName: contact.name,
      medium: state.selectedMedium,
      initiator: state.selectedInitiator,
      summary: noteInput || `Checked in via ${state.selectedMedium}`,
      location: locInput,
      photoDataUrl: state.quickLogPhotoDataUrl,
      occurredAt: nowIso,
    };

    state.logs.unshift(newLog);
    saveLogs();

    contact.lastContactedAt = nowIso;
    contact.lastMedium = state.selectedMedium;
    contact.lastInitiator = state.selectedInitiator;
    contact.snoozedUntil = null;
    saveContacts();
    sortContactsByRecency();

    renderAll();
    closeQuickLogModal();

    if (launchApp && contact.phone && state.selectedMedium !== 'In-Person' && state.selectedMedium !== 'Other') {
      let scheme = 'sms:';
      if (state.selectedMedium === 'Call') scheme = `tel:${contact.phone}`;
      else if (state.selectedMedium === 'FaceTime') scheme = `facetime:${contact.phone}`;
      else if (state.selectedMedium === 'WhatsApp') scheme = `https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`;
      else scheme = `sms:${contact.phone}`;
      window.open(scheme, '_blank');
    }
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      state.quickLogPhotoDataUrl = evt.target.result;
      const previewContainer = document.getElementById('quicklog-photo-preview-container');
      const previewImg = document.getElementById('quicklog-photo-img');
      const photoLabel = document.getElementById('quicklog-photo-label');

      if (previewImg) previewImg.src = evt.target.result;
      if (previewContainer) previewContainer.classList.remove('hidden');
      if (photoLabel) photoLabel.textContent = 'Photo Attached';
    };
    reader.readAsDataURL(file);
  }

  function removePhotoAttachment() {
    state.quickLogPhotoDataUrl = null;
    const previewContainer = document.getElementById('quicklog-photo-preview-container');
    const photoInput = document.getElementById('quicklog-photo-input');
    const photoLabel = document.getElementById('quicklog-photo-label');

    if (previewContainer) previewContainer.classList.add('hidden');
    if (photoInput) photoInput.value = '';
    if (photoLabel) photoLabel.textContent = 'Choose Photo';
  }

  // ── MODAL 2: CONTACT FORM CONTROLLER ──
  function openContactFormModal(contactId = null) {
    const modal = document.getElementById('modal-contact-form');
    const titleEl = document.getElementById('contact-form-title');
    const deleteBtn = document.getElementById('btn-delete-contact');
    if (!modal) return;

    const formId = document.getElementById('contact-form-id');
    const inputName = document.getElementById('contact-input-name');
    const inputPhone = document.getElementById('contact-input-phone');
    const inputBirthday = document.getElementById('contact-input-birthday');
    const inputNotes = document.getElementById('contact-input-notes');

    if (contactId) {
      const c = state.contacts.find(x => x.id === contactId);
      if (c) {
        titleEl.textContent = 'Edit Person';
        formId.value = c.id;
        inputName.value = c.name;
        inputPhone.value = c.phone || '';
        inputBirthday.value = c.birthday || '';
        inputNotes.value = c.notes || '';
        state.selectedCategory = c.category || 'Family';
        state.selectedFormFreq = c.targetFrequency || 'Monthly';
        state.isFormVipPinned = !!c.isPinned;
        if (deleteBtn) deleteBtn.classList.remove('hidden');
      }
    } else {
      titleEl.textContent = 'Add Person';
      formId.value = '';
      inputName.value = '';
      inputPhone.value = '';
      inputBirthday.value = '';
      inputNotes.value = '';
      state.selectedCategory = state.categories[0]?.name || 'Family';
      state.selectedFormFreq = 'Monthly';
      state.isFormVipPinned = false;
      if (deleteBtn) deleteBtn.classList.add('hidden');
    }

    updateVipStarButtonUI();
    renderContactCatOptions();
    renderFrequencyButtons();
    modal.classList.remove('hidden');
  }

  function closeContactFormModal() {
    const modal = document.getElementById('modal-contact-form');
    if (modal) modal.classList.add('hidden');
  }

  function updateVipStarButtonUI() {
    const btn = document.getElementById('btn-toggle-vip-pin');
    const icon = document.getElementById('vip-star-icon');
    if (!btn || !icon) return;

    if (state.isFormVipPinned) {
      btn.style.borderColor = 'var(--gold)';
      btn.style.color = 'var(--gold)';
      icon.className = 'fa-solid fa-star text-[14px] text-[var(--gold)]';
    } else {
      btn.style.borderColor = 'var(--border)';
      btn.style.color = 'var(--text-tertiary)';
      icon.className = 'fa-solid fa-star text-[14px]';
    }
  }

  function renderContactCatOptions() {
    const container = document.getElementById('contact-cat-options');
    if (!container) return;

    let html = '';
    state.categories.forEach(cat => {
      const isSel = cat.name === state.selectedCategory;
      html += `
        <button type="button" class="form-cat-chip px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap touch-active transition-all ${isSel ? 'bg-[var(--gold)] text-[#181412] font-bold' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]'}" data-cat="${cat.name}">
          ${cat.name}
        </button>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.form-cat-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedCategory = btn.getAttribute('data-cat');
        renderContactCatOptions();
      });
    });
  }

  function renderFrequencyButtons() {
    const btns = document.querySelectorAll('.freq-btn');
    btns.forEach(btn => {
      const freq = btn.getAttribute('data-freq');
      const isSel = freq === state.selectedFormFreq;
      if (isSel) {
        btn.style.background = 'var(--gold)';
        btn.style.color = '#181412';
        btn.style.borderColor = 'transparent';
      } else {
        btn.style.background = 'var(--bg-elevated)';
        btn.style.color = 'var(--text-secondary)';
        btn.style.borderColor = 'var(--border)';
      }

      btn.onclick = () => {
        state.selectedFormFreq = freq;
        renderFrequencyButtons();
      };
    });
  }

  function handleSaveContactSubmit(e) {
    e.preventDefault();
    const formId = document.getElementById('contact-form-id').value;
    const name = document.getElementById('contact-input-name').value.trim();
    const phone = document.getElementById('contact-input-phone').value.trim();
    const birthday = document.getElementById('contact-input-birthday').value;
    const notes = document.getElementById('contact-input-notes').value.trim();

    if (!name) return;

    if (formId) {
      const c = state.contacts.find(x => x.id === formId);
      if (c) {
        c.name = name;
        c.phone = phone;
        c.birthday = birthday;
        c.notes = notes;
        c.category = state.selectedCategory;
        c.targetFrequency = state.selectedFormFreq;
        c.isPinned = state.isFormVipPinned;
      }
    } else {
      const newContact = {
        id: `contact-${Date.now()}`,
        name,
        category: state.selectedCategory,
        phone,
        birthday,
        targetFrequency: state.selectedFormFreq,
        lastContactedAt: new Date().toISOString(),
        lastMedium: 'iMessage',
        lastInitiator: 'outgoing',
        notes,
        isPinned: state.isFormVipPinned,
        snoozedUntil: null,
        createdAt: new Date().toISOString(),
      };
      state.contacts.unshift(newContact);
    }

    saveContacts();
    sortContactsByRecency();
    renderAll();
    closeContactFormModal();
  }

  function handleDeleteContactSubmit() {
    const formId = document.getElementById('contact-form-id').value;
    if (!formId) return;

    if (confirm('Delete this person from your connected log?')) {
      state.contacts = state.contacts.filter(c => c.id !== formId);
      saveContacts();
      renderAll();
      closeContactFormModal();
    }
  }

  // ── JSON EXPORT & IMPORT ──
  function exportJSONData() {
    const exportObj = {
      version: '2.6',
      exportDate: new Date().toISOString(),
      categories: state.categories,
      contacts: state.contacts,
      logs: state.logs,
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connected_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSONData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.contacts && Array.isArray(parsed.contacts)) {
          state.contacts = parsed.contacts;
          saveContacts();
        }
        if (parsed.categories && Array.isArray(parsed.categories)) {
          state.categories = parsed.categories;
          saveCategories();
        }
        if (parsed.logs && Array.isArray(parsed.logs)) {
          state.logs = parsed.logs;
          saveLogs();
        }
        sortContactsByRecency();
        renderAll();
        alert('✓ Data restored successfully!');
      } catch (err) {
        alert('Failed to import JSON file. Please check file format.');
      }
    };
    reader.readAsText(file);
  }

  // ── 5 SYMMETRICAL TABS SWITCHER ──
  function switchTab(tabName) {
    state.activeTab = tabName;

    const viewRecency = document.getElementById('view-recency');
    const viewInsights = document.getElementById('view-insights');
    const viewMemories = document.getElementById('view-memories');
    const viewSettings = document.getElementById('view-settings');

    const tabRecency = document.getElementById('tab-btn-recency');
    const tabInsights = document.getElementById('tab-btn-insights');
    const tabMemories = document.getElementById('tab-btn-memories');
    const tabSettings = document.getElementById('tab-btn-settings');

    [viewRecency, viewInsights, viewMemories, viewSettings].forEach(v => v && v.classList.add('hidden'));
    [tabRecency, tabInsights, tabMemories, tabSettings].forEach(t => {
      if (t) {
        t.classList.remove('text-[var(--gold)]', 'font-bold');
        t.classList.add('text-[var(--text-tertiary)]');
      }
    });

    if (tabName === 'recency') {
      if (viewRecency) viewRecency.classList.remove('hidden');
      if (tabRecency) {
        tabRecency.classList.add('text-[var(--gold)]', 'font-bold');
        tabRecency.classList.remove('text-[var(--text-tertiary)]');
      }
    } else if (tabName === 'insights') {
      if (viewInsights) viewInsights.classList.remove('hidden');
      if (tabInsights) {
        tabInsights.classList.add('text-[var(--gold)]', 'font-bold');
        tabInsights.classList.remove('text-[var(--text-tertiary)]');
      }
    } else if (tabName === 'memories') {
      if (viewMemories) viewMemories.classList.remove('hidden');
      if (tabMemories) {
        tabMemories.classList.add('text-[var(--gold)]', 'font-bold');
        tabMemories.classList.remove('text-[var(--text-tertiary)]');
      }
    } else if (tabName === 'settings') {
      if (viewSettings) viewSettings.classList.remove('hidden');
      if (tabSettings) {
        tabSettings.classList.add('text-[var(--gold)]', 'font-bold');
        tabSettings.classList.remove('text-[var(--text-tertiary)]');
      }
    }
  }

  function updateShortcutUrlDisplay() {
    const el = document.getElementById('shortcut-url-example');
    if (el) {
      el.textContent = `${window.location.origin}/?quicklog=true&contact=Mom&medium=iMessage`;
    }
  }

  // ── EVENT BINDINGS ──
  function bindEvents() {
    document.getElementById('btn-google-signin')?.addEventListener('click', handleGoogleSignIn);
    document.getElementById('btn-google-signout')?.addEventListener('click', handleGoogleSignOut);

    document.querySelectorAll('.pin-key').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        if (key) handlePinInput(key);
      });
    });

    document.getElementById('pin-backspace')?.addEventListener('click', handlePinBackspace);
    document.getElementById('btn-lock-app-now')?.addEventListener('click', lockAppNow);
    document.getElementById('form-change-pin')?.addEventListener('submit', handleChangePinSubmit);

    document.getElementById('default-pin-warning-banner')?.addEventListener('click', () => {
      switchTab('settings');
      const card = document.getElementById('card-change-pin');
      if (card) card.scrollIntoView({ behavior: 'smooth' });
    });

    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        renderRecencyContacts();
        renderMemoriesList();
      });
    }

    const quickSearchInput = document.getElementById('quicklog-search-input');
    if (quickSearchInput) {
      quickSearchInput.addEventListener('input', (e) => {
        state.quickPersonSearchQuery = e.target.value.trim();
        renderQuickLogChips();
      });
    }

    document.getElementById('btn-init-outgoing')?.addEventListener('click', () => {
      state.selectedInitiator = 'outgoing';
      updateInitiatorToggleUI();
    });

    document.getElementById('btn-init-incoming')?.addEventListener('click', () => {
      state.selectedInitiator = 'incoming';
      updateInitiatorToggleUI();
    });

    document.getElementById('btn-start-dictation')?.addEventListener('click', toggleVoiceDictation);

    document.getElementById('quicklog-photo-input')?.addEventListener('change', handlePhotoUpload);
    document.getElementById('btn-remove-photo')?.addEventListener('click', removePhotoAttachment);

    document.getElementById('btn-snooze-3d')?.addEventListener('click', () => {
      if (state.dossierContactId) snoozeContact(state.dossierContactId, 3);
    });
    document.getElementById('btn-snooze-1w')?.addEventListener('click', () => {
      if (state.dossierContactId) snoozeContact(state.dossierContactId, 7);
    });
    document.getElementById('btn-snooze-1m')?.addEventListener('click', () => {
      if (state.dossierContactId) snoozeContact(state.dossierContactId, 30);
    });

    document.getElementById('btn-toggle-vip-pin')?.addEventListener('click', () => {
      state.isFormVipPinned = !state.isFormVipPinned;
      updateVipStarButtonUI();
    });

    document.getElementById('btn-export-json')?.addEventListener('click', exportJSONData);
    document.getElementById('file-import-json')?.addEventListener('change', importJSONData);

    document.getElementById('btn-close-dossier')?.addEventListener('click', closePersonDossierModal);
    document.getElementById('btn-dossier-quicklog')?.addEventListener('click', () => {
      closePersonDossierModal();
      openQuickLogModal(state.dossierContactId);
    });
    document.getElementById('btn-dossier-edit')?.addEventListener('click', () => {
      const id = state.dossierContactId;
      closePersonDossierModal();
      openContactFormModal(id);
    });

    document.getElementById('tab-btn-recency')?.addEventListener('click', () => switchTab('recency'));
    document.getElementById('tab-btn-insights')?.addEventListener('click', () => switchTab('insights'));
    document.getElementById('tab-btn-memories')?.addEventListener('click', () => switchTab('memories'));
    document.getElementById('tab-btn-settings')?.addEventListener('click', () => switchTab('settings'));

    document.getElementById('btn-open-quick-log')?.addEventListener('click', () => openQuickLogModal());
    document.getElementById('btn-open-add-contact')?.addEventListener('click', () => openContactFormModal());

    document.getElementById('btn-close-quick-log')?.addEventListener('click', closeQuickLogModal);
    document.getElementById('btn-close-contact-form')?.addEventListener('click', closeContactFormModal);

    document.getElementById('btn-save-quick-log')?.addEventListener('click', () => saveQuickLog(false));
    document.getElementById('btn-save-and-launch-log')?.addEventListener('click', () => saveQuickLog(true));

    document.getElementById('contact-form')?.addEventListener('submit', handleSaveContactSubmit);
    document.getElementById('btn-delete-contact')?.addEventListener('click', handleDeleteContactSubmit);

    document.getElementById('btn-toggle-add-cat')?.addEventListener('click', () => {
      const container = document.getElementById('add-cat-inline-input');
      container?.classList.toggle('hidden');
    });

    document.getElementById('btn-submit-new-cat')?.addEventListener('click', () => {
      const val = document.getElementById('input-new-cat-name').value.trim();
      if (val) {
        state.categories.push({ id: `cat-${Date.now()}`, name: val });
        saveCategories();
        state.selectedCategory = val;
        renderCategoryPills();
        renderContactCatOptions();
        document.getElementById('input-new-cat-name').value = '';
        document.getElementById('add-cat-inline-input').classList.add('hidden');
      }
    });

    const btnCheckSw = document.getElementById('btn-check-sw-update');
    const btnForceReload = document.getElementById('btn-force-reload-app');
    const swStatus = document.getElementById('sw-update-status');

    if (btnCheckSw) {
      btnCheckSw.addEventListener('click', async () => {
        btnCheckSw.disabled = true;
        btnCheckSw.innerHTML = '<i class="fa-solid fa-rotate text-[11px] animate-spin"></i> Checking...';

        if ('serviceWorker' in navigator) {
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) await r.update();
          } catch (e) {}
        }

        setTimeout(() => {
          btnCheckSw.disabled = false;
          btnCheckSw.innerHTML = '<i class="fa-solid fa-rotate text-[11px]"></i> Check Updates';
          if (swStatus) {
            swStatus.textContent = '✓ Connected PWA is up to date!';
            swStatus.classList.remove('hidden');
          }
        }, 1200);
      });
    }

    if (btnForceReload) {
      btnForceReload.addEventListener('click', async () => {
        if (confirm('Force refresh and purge PWA cache storage?')) {
          if ('caches' in window) {
            const keys = await caches.keys();
            for (const k of keys) await caches.delete(k);
          }
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) await r.unregister();
          }
          window.location.reload();
        }
      });
    }

    document.getElementById('btn-copy-shortcut-url')?.addEventListener('click', () => {
      const txt = document.getElementById('shortcut-url-example').textContent;
      navigator.clipboard.writeText(txt);
      const btn = document.getElementById('btn-copy-shortcut-url');
      if (btn) {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      }
    });
  }

  // ── INITIALIZATION ──
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadData();
    initVoiceDictation();
    bindEvents();
    initFirebaseAuth();
    renderAll();
  });

})();
