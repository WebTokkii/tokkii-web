import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnalyticsTracker from './components/AnalyticsTracker';
import Home from './pages/Home';
import Dinamicas from './pages/Dinamicas';
import Sobre from './pages/Sobre';
import Noticias from './pages/Noticias';
import NoticiaDetalle from './pages/NoticiaDetalle';
import EventoDetalle from './pages/EventoDetalle';
import TierList from './pages/TierList';
import Minijuegos from './pages/Minijuegos';
import Perfil from './pages/Perfil';
import Ayuda from './pages/Ayuda';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  React.useEffect(() => {
    if (window.location.hash && window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);
  return (
    <Router>
      <ScrollToTop />
      <AnalyticsTracker />
      <div className="app-wrapper">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dinamicas" element={<Dinamicas />} />
            <Route path="/dinamicas/:slug" element={<EventoDetalle />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/tierlists" element={<TierList />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:slug" element={<NoticiaDetalle />} />
            <Route path="/minijuegos" element={<Minijuegos />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
