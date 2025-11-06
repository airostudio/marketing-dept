import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Casey from './pages/Casey';
import Hunter from './pages/Hunter';
import Sage from './pages/Sage';
import Analyzer from './pages/Analyzer';
import Heatley from './pages/Heatley';
import Stats from './pages/Stats';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/casey" element={<Casey />} />
          <Route path="/hunter" element={<Hunter />} />
          <Route path="/sage" element={<Sage />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/heatley" element={<Heatley />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
