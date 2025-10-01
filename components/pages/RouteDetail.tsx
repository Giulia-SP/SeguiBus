import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BusRoute, BusStop } from '../../types';
import { MOCK_STOPS } from '../../constants';
import { ArrowLeft, MapPin, AlertTriangle } from 'lucide-react';
import RouteMap from '../RouteMap';
import { useGeolocation } from '../useGeolocation';
import { useRoutes } from '../../contexts/RouteContext';

const RouteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { routes } = useRoutes();
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [stops, setStops] = useState<BusStop[]>([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const { location, error: locationError } = useGeolocation();

  useEffect(() => {
    const foundRoute = routes.find(r => r.id === id);
    if (foundRoute) {
      setRoute(foundRoute);
      const routeStops = MOCK_STOPS.filter(s => foundRoute.stops.includes(s.id));
       // Ensure stop order is correct
      const orderedStops = foundRoute.stops.map(stopId => routeStops.find(s => s.id === stopId)).filter(Boolean) as BusStop[];
      setStops(orderedStops);
    }
  }, [id, routes]);

  useEffect(() => {
    if (stops.length < 2) return;
    const interval = setInterval(() => {
      setCurrentStopIndex(prevIndex => (prevIndex + 1) % stops.length);
    }, 5000); // Move bus every 5 seconds
    return () => clearInterval(interval);
  }, [stops]);

  if (!route) {
    return <div className="text-center p-8">Rota não encontrada.</div>;
  }
  
  const currentStop = stops[currentStopIndex] ?? null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center mb-6 text-blue-600 dark:text-cyan-400 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o Dashboard
      </Link>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{route.name}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Destino: {route.destination}</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Acompanhamento em Tempo Real</h2>
           {locationError && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{locationError}</span>
            </div>
          )}
          <RouteMap stops={stops} currentStop={currentStop} userLocation={location} routeName={route.name}/>
        </div>

        <div>
            <h2 className="text-2xl font-bold mb-4">Paradas</h2>
            <ul className="space-y-4">
            {stops.map((stop, index) => (
                <li key={stop.id} className={`flex items-center p-3 rounded-lg transition-colors duration-500 ${index === currentStopIndex ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-transparent'}`}>
                <MapPin className={`h-6 w-6 mr-4 transition-colors duration-500 ${index === currentStopIndex ? 'text-blue-500' : 'text-gray-400'}`} />
                <div>
                    <p className={`font-semibold ${index === currentStopIndex ? 'text-blue-600 dark:text-cyan-300' : 'text-gray-800 dark:text-gray-200'}`}>{stop.name}</p>
                    {index === currentStopIndex && <p className="text-sm text-blue-500 font-bold">Ônibus aqui</p>}
                    {index > 0 && index === currentStopIndex + 1 && <p className="text-sm text-green-500">Próxima parada</p>}
                </div>
                </li>
            ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default RouteDetail;