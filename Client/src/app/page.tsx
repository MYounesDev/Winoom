"use client";

import React from "react";
import RoleSelectionUI from "@/app/RoleSelection";

import { Toaster, toast } from "react-hot-toast";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import all page components
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import Calendar from "@/pages/Calendar";
import Class from "@/pages/Class";
import Homework from "@/pages/Homework";
import Lessons from "@/pages/Lessons";
import Books from "@/pages/Books";
import Classes from "@/pages/Classes";
import Students from "@/pages/Students";
import Notes from "@/pages/Notes";
import Reports from "@/pages/Reports";
import Teachers from "@/pages/Teachers";

const App = () => {
  return (
    <>
      <Router>
        <Toaster position="top-right" />

        <Routes>
          {/* Generel routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* Student Routes */}
          <Route path="/class" element={<Class />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/books" element={<Books />} />

          {/* Teacher/Advisor Routes */}
          <Route path="/classes" element={<Classes />} />
          <Route path="/students" element={<Students />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/teachers" element={<Teachers />} />
        </Routes>








        {/* Render the RoleSelectionUI outside of Routes */}
        <RoleSelectionUI />
      </Router>
    </>
  );
};

export default App;
