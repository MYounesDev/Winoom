import React, { useState } from 'react';
import { Home, BookCopy,University, NotebookPen, Calendar, Settings, Presentation, Menu } from 'lucide-react';
import '@/styles/Sidebar.css';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateToHome = () => {
    // Navigation logic to home page
    console.log("Navigating to home page");
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-toggle">
        <button onClick={toggleSidebar} className="toggle-button">
          <Menu size={24} />
        </button>
      </div>
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="logo-container" onClick={navigateToHome}>
          <div className="pulsing-light"></div>
          <h1 className="app-name">Winoom</h1>
          <div className="pulsing-light"></div>
        </div>
        
        <div className="separator"></div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item">
              <Home size={20} />
              <span>Home</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item">
              <Presentation size={20} />
              <span>Class</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item">
              <NotebookPen size={20} />
              <span>Homework</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item">
              <University size={20} />
              <span>Lessons</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item">
              <BookCopy size={20} />
              <span>Books</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item">
              <Calendar size={20} />
              <span>Calendar</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item">
              <Settings size={20} />
              <span>Settings</span>
              <div className="glow-effect"></div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 