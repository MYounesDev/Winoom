import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// Sayfalar
import HomePage from './HomePage';
import TeacherPage from './TeacherPage';
import StudentPage from './StudentPage';
import AdminPage from './AdminPage';

function App() {
  return (
    <Router>
      <div>
        {/* Ana sayfa butonları */}
        <nav>
          <Link to="/teacher"><button>Öğretmen Sayfası</button></Link>
          <Link to="/student"><button>Öğrenci Sayfası</button></Link>
          <Link to="/admin"><button>Admin Sayfası</button></Link>
        </nav>

        {/* Sayfalar */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
