


import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import Home from './components/Home';
import Worship from './components/Worship';
import Poetry from './components/Poetry';
import Kite from './components/Kite';
import RainEffect from './components/RainEffect';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <RainEffect />
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
