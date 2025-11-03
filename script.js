const form = document.getElementById('auth-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const chatContainer = document.getElementById('chat-container');
const formContainer = document.querySelector('.form-container');
const userDisplay = document.getElementById('user-display');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const statusIndicator = document.getElementById('status-indicator');

let isLogin = true;
let currentUser = '';
let users = {}; // fake in-memory storage

// Toggle between login and signup
toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? 'Login' : 'Sign Up';
  submitBtn.textContent = isLogin ? 'Login' : 'Sign Up';
  toggleText.innerHTML = isLogin
    ? `Don't have an account? <span id="toggle-link">Sign up</span>`
    : `Already have an account? <span id="toggle-link">Login</span>`;
});

// Handle auth form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (isLogin) {
    if (users[username] && users[username] === password) {
      loginUser(username);
    } else {
      alert('Invalid credentials');
    }
  } else {
    if (users[username]) {
      alert('Username already exists');
    } else {
      users[username] = password;
      alert('Signup successful! Please log in.');
      isLogin = true;
      formTitle.textContent = 'Login';
      submitBtn.textContent = 'Login';
    }
  }

  form.reset();
});

// Log in and show chat
function loginUser(username) {
  currentUser = username;
  userDisplay.textContent = username;
  formContainer.classList.add('hidden');
  chatContainer.classList.remove('hidden');
  updateStatus(navigator.onLine);
}

// Send message
sendBtn.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (msg) {
    appendMessage(msg, 'sent');
    simulateReply();
    chatInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// Append message to chat
function appendMessage(msg, type) {
  const message = document.createElement('div');
  message.classList.add('message', type);
  message.textContent = `${type === 'sent' ? currentUser : 'Friend'}: ${msg}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Simulate a reply
function simulateReply() {
  setTimeout(() => {
    const replies = ['👍', 'Got it!', '😂', 'Cool!', 'Tell me more...', '😉'];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    appendMessage(reply, 'received');
  }, 1000);
}

// Emoji picker
const picker = new EmojiButton();
emojiBtn.addEventListener('click', () => {
  picker.togglePicker(emojiBtn);
});

picker.on('emoji', emoji => {
  chatInput.value += emoji;
});

// Online/offline status management
function updateStatus(isOnline) {
  if (isOnline) {
    statusIndicator.textContent = 'Online';
    statusIndicator.classList.remove('offline');
    statusIndicator.classList.add('online');
  } else {
    statusIndicator.textContent = 'Offline';
    statusIndicator.classList.remove('online');
    statusIndicator.classList.add('offline');
  }
}

// Detect online/offline using navigator.onLine and events
window.addEventListener('online', () => {
  updateStatus(true);
});
window.addEventListener('offline', () => {
  updateStatus(false);
});

// When user leaves page mark offline (simulate)
window.addEventListener('beforeunload', () => {
  updateStatus(false);
});