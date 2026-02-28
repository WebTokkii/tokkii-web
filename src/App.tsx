import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import Sorteos from './pages/Sorteos';
import Sobre from './pages/Sobre';
import Noticias from './pages/Noticias';
import NoticiaDetalle from './pages/NoticiaDetalle';
import TeRecomiendo from './pages/TeRecomiendo';
import EventoDetalle from './pages/EventoDetalle';
import TierList from './pages/TierList';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="app-wrapper">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:slug" element={<EventoDetalle />} />
            <Route path="/sorteos" element={<Sorteos />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/tierlist" element={<TierList />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:slug" element={<NoticiaDetalle />} />
            <Route path="/te-recomiendo" element={<TeRecomiendo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
