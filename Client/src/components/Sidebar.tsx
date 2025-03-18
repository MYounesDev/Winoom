"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  SquareCheck,
} from "lucide-react";
import "@/styles/Sidebar.css";

// Define a type for the user role
type UserRole = "Student" | "Teacher" | "Advisor" | null;

interface SidebarProps {
  userRole?: UserRole;
}

const Sidebar = ({ userRole: propUserRole }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(propUserRole || null);
  const navigate = useNavigate();
  const location = useLocation();

  // Use effect to sync userRole from props or sessionStorage
  useEffect(() => {
    // First check props
    if (propUserRole) {
      setUserRole(propUserRole);
      sessionStorage.setItem("userRole", propUserRole);
    }
    // Then check sessionStorage if props don't have a value
    else {
      const storedRole = sessionStorage.getItem("userRole") as UserRole;
      if (storedRole) {
        setUserRole(storedRole);
      }
    }
  }, [propUserRole]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path: string) => {
    // Pass the current userRole in the state to maintain it across navigation
    navigate(path, { state: { role: userRole } });
  };

  let root = document.documentElement;
  const studentTheme = () => {
    root.style.setProperty("--primary-color", "#f3ff4f");
    root.style.setProperty("--secondary-color", "#ff9900");
    root.style.setProperty("--accent-color", "rgba(252, 255, 64, 0.89)");
    root.style.setProperty("--glow-color", "rgb(252, 194, 4)");
    root.style.setProperty("--border-color", "rgba(255, 237, 79, 0.1)");
    root.style.setProperty("--button-hover-bg", "#d7e422");
  };
  const teachTheme = () => {
    root.style.setProperty("--primary-color", "#4f8cff");
    root.style.setProperty("--secondary-color", "#c961ff");
    root.style.setProperty("--accent-color", "rgba(64, 128, 255, 0.1)");
    root.style.setProperty("--glow-color", "rgba(79, 140, 255, 0.5)");
    root.style.setProperty("--border-color", "rgba(79, 140, 255, 0.1)");
    root.style.setProperty("--button-hover-bg", "#0f3460");
  };

  // Render different nav items based on the user role
  const renderNavItems = () => {
    switch (userRole) {
      case "Student":

        studentTheme();
        
        return (
          <>
            <li className="nav-item" onClick={() => navigateTo("/class")}>
              <Presentation size={20} />
              <span>Class</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo("/homework")}>
              <SquareCheck size={20} />
              <span>Homework</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo("/lessons")}>
              <University size={20} />
              <span>Lessons</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo("/books")}>
              <BookCopy size={20} />
              <span>Books</span>
              <div className="glow-effect"></div>
            </li>
          </>
        );
      case "Teacher":

      teachTheme();

        return (
          <>
            <li className="nav-item" onClick={() => navigateTo("/classes")}>
              <Presentation size={20} />
              <span>Classes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo("/students")}>
              <Baby size={20} />
              <span>Students</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo("/notes")}>
              <NotebookPen size={20} />
              <span>Notes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo("/reports")}>
              <ChartColumnDecreasing size={20} />
              <span>Reports</span>
              <div className="glow-effect"></div>
            </li>
          </>
        );
      case "Advisor":

      teachTheme();

        return (
          <>
            <li className="nav-item" onClick={() => navigateTo("/classes")}>
              <Presentation size={20} />
              <span>Classes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo("/teachers")}>
              <Users size={20} />
              <span>Teachers</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo("/students")}>
              <Baby size={20} />
              <span>Students</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo("/notes")}>
              <NotebookPen size={20} />
              <span>Notes</span>
              <div className="glow-effect"></div>
            </li>
            <li className="nav-item" onClick={() => navigateTo("/reports")}>
              <ChartColumnDecreasing size={20} />
              <span>Reports</span>
              <div className="glow-effect"></div>
            </li>
          </>
        );
      default:
        // If no role, show nothing or a message to select a role
        return (
          <li className="nav-item text-center text-gray-500">
            <span>Please select a role</span>
          </li>
        );
    }
  };

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-toggle">
        <button onClick={toggleSidebar} className="toggle-button">
          <Menu size={24} />
        </button>
      </div>

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="logo-container" onClick={() => navigateTo("/home")}>
          <div className="pulsing-light"></div>
          <h1 className="app-name">Winoom</h1>
          <div className="pulsing-light"></div>
        </div>

        <div className="separator"></div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item" onClick={() => navigateTo("/home")}>
              <Home size={20} />
              <span>Home</span>
              <div className="glow-effect"></div>
            </li>

            {/* Dynamic nav items based on user role */}
            {renderNavItems()}

            <li className="nav-item" onClick={() => navigateTo("/calendar")}>
              <Calendar size={20} />
              <span>Calendar</span>
              <div className="glow-effect"></div>
            </li>

            <li className="nav-item" onClick={() => navigateTo("/settings")}>
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
