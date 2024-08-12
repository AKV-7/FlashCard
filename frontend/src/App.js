
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Flashcard from './Flashcard';
import AdminDashboard from './AdminDashboard';
import Navbar from './Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div  style={{
          display: "flex",
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
         
        }}>

        <Routes>
          <Route path="/" element={<Flashcard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      
    </Router>
  );
};

export default App;




