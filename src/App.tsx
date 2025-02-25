import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import Home from './components/Home';
import Worship from './components/Worship';
import Poetry from './components/Poetry';
import Kite from './components/Kite';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/worship" element={<Worship />} />
        <Route path="/poetry" element={<Poetry />} />
        <Route path="/kite" element={<Kite />} />
      </Routes>
    </Router>
  );
}

export default App;
