const express = require('express');
const cors = require('cors');  // CORS hatalarını engellemek için

const app = express();
const port = 3001;  // React uygulaması genellikle 3000'de çalışır, o yüzden 3001 kullanıyoruz

// CORS middleware kullanıyoruz
app.use(cors());
app.use(express.json()); // JSON verisi almak için

// Basit bir test API endpoint
app.get('/', (req, res) => {
  res.send('Ders Takip Uygulamasının API’sine Hoşgeldiniz!');
});

// Kullanıcılar için API endpoint
let users = [
  { id: 1, name: 'Öğrenci 1', role: 'student' },
  { id: 2, name: 'Öğretmen 1', role: 'teacher' },
  { id: 3, name: 'Danışman Hoca', role: 'advisor' },
  { id: 4, name: 'Admin', role: 'admin' }
];

// Kullanıcıları listeleme
app.get('/users', (req, res) => {
  res.json(users);
});

// Yeni kullanıcı ekleme
app.post('/users', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// Ödevler için API endpoint
let homework = [
  { id: 1, teacherId: 2, studentId: 1, description: 'Matematik Ödevi', answer: '' }
];

// Ödevleri listeleme
app.get('/homework', (req, res) => {
  res.json(homework);
});

// Öğretmenlerin ödev eklemesi için API endpoint
app.post('/homework', (req, res) => {
  const newHomework = req.body;
  homework.push(newHomework);
  res.status(201).json(newHomework);
});

// Sunucu başlatılıyor
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor...`);
});
