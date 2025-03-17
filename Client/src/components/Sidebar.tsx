"use client"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookCopy, 
  University, 
  NotebookPen, 
  Calendar, 
  Settings, 
  Presentation, 
  Menu,
  Users,
  Baby,
  ChartColumnDecreasing,
  SquareCheck
} from 'lucide-react';
import '@/styles/Sidebar.css';

// Define a type for the user role
type UserRole = 'Student' | 'Teacher' | 'Advisor' | null;

interface SidebarProps {
  userRole?: UserRole;
}

const Sidebar = ({ userRole }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Render different nav items based on the user role
  const renderNavItems = () => {
    switch (userRole) {
      case 'Student':
        return (
          <>
            <li className="nav-item" onClick={() => navigateTo('/class')}>
              <Presentation size={20} />
              <span>Class</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo('/homework')}>
              <SquareCheck size={20} />
              <span>Homework</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo('/lessons')}>
              <University size={20} />
              <span>Lessons</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo('/books')}>
              <BookCopy size={20} />
              <span>Books</span>
              <div className="glow-effect"></div>
            </li>
          </>
        );
      case 'Teacher':
        return (
          <>
            <li className="nav-item" onClick={() => navigateTo('/classes')}>
              <Presentation size={20} />
              <span>Classes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo('/students')}>
              <Baby size={20} />
              <span>Students</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo('/notes')}>
              <NotebookPen size={20} />
              <span>Notes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo('/reports')}>
              <ChartColumnDecreasing size={20} />
              <span>Reports</span>
              <div className="glow-effect"></div>
            </li>
          </>
        );
      case 'Advisor':
        return (
          <>
            <li className="nav-item" onClick={() => navigateTo('/classes')}>
              <Presentation size={20} />
              <span>Classes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo('/teachers')}>
              <Users size={20} />
              <span>Teachers</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo('/students')}>
              <Baby size={20} />
              <span>Students</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo('/notes')}>
              <NotebookPen size={20} />
              <span>Notes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo('/reports')}>
              <ChartColumnDecreasing size={20} />
              <span>Reports</span>
              <div className="glow-effect"></div>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-toggle">
        <button onClick={toggleSidebar} className="toggle-button">
          <Menu size={24} />
        </button>
      </div>
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="logo-container" onClick={() => navigateTo('/home')}>
          <div className="pulsing-light"></div>
          <h1 className="app-name">Winoom</h1>
          <div className="pulsing-light"></div>
        </div>
        
        <div className="separator"></div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item" onClick={() => navigateTo('/home')}>
              <Home size={20} />
              <span>Home</span>
              <div className="glow-effect"></div>
            </li>

            {/* Dynamic nav items based on user role */}
            {renderNavItems()}

            <li className="nav-item" onClick={() => navigateTo('/calendar')}>
              <Calendar size={20} />
              <span>Calendar</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo('/settings')}>
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