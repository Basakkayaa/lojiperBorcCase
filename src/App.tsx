import React from 'react';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import AddDebt from './pages/AddDebt';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route path='/Login' element={<Login />} />
          <Route path='/' element={<Home />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Dashboard' element={<Dashboard />} />
        <Route path="/AddDebt" element={<AddDebt/>} />
        </Routes>      
      </Router>
      
    </div>
  );
}

export default App;
