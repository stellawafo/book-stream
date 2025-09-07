let currentBookId = null;

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  alert('Inscription réussie');
}

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.userId);
  loadBooks();
}

async function loadBooks() {
  const res = await fetch('/books');
  const books = await res.json();
  const selector = document.getElementById('bookSelector');
  selector.innerHTML = '';
  books.forEach(book => {
    const option = document.createElement('option');
    option.value = book._id;
    option.textContent = `${book.title} - ${book.author}`;
    selector.appendChild(option);
  });
}

async function startStreaming() {
  currentBookId = document.getElementById('bookSelector').value;
  const res = await fetch(`/books/${currentBookId}`);
  const text = await res.text();
  document.getElementById('bookContent').textContent = text;
  getAverageRating();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function readAloud() {
  const text = document.getElementById('bookContent').textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

async function submitRating() {
  const score = parseInt(document.getElementById('rating').value);
  const userId = localStorage.getItem('userId');
  const res = await fetch(`/books/${currentBookId}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, score })
  });
  const data = await res.json();
  document.getElementById('averageRating').textContent = `Moyenne : ${data.average}`;
}

async function getAverageRating() {
  const res = await fetch(`/books/${currentBookId}/average`);
  const data = await res.json();
  document.getElementById('averageRating').textContent = `Moyenne : ${data.average}`;
}

async function addFavorite() {
  const userId = localStorage.getItem('userId');
  await fetch('/user/favorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bookId: currentBookId })
  });
  alert('Ajouté aux favoris');
}
