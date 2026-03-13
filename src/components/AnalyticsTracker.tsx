import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Rastrear el cambio de página cada vez que la ubicación cambia
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null; // Este componente no renderiza nada visualmente
};

export default AnalyticsTracker;
