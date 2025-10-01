import React, { useState, useEffect } from 'react';
import { BusRoute } from '../../types';
import { useNavigate } from 'react-router-dom';
import { MapPin, Volume2, Search, MessageCircle, Route, Navigation, LocateFixed, ArrowUpDown, Star } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useVoiceCommand } from '../../contexts/VoiceCommandContext';
import { useRoutes } from '../../contexts/RouteContext';
import { useGeolocation } from '../useGeolocation';
import { MOCK_STOPS } from '../../constants';

// Helper function to calculate distance (simplified for this context)
const getDistance = (loc1: {lat: number, lng: number}, loc2: {lat: number, lng: number}) => {
  const dx = loc1.lat - loc2.lat;
  const dy = loc1.lng - loc2.lng;
  return Math.sqrt(dx * dx + dy * dy);
};


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useAccessibility();
  const { lastCommand, clearLastCommand } = useVoiceCommand();
  const { routes, toggleFavorite } = useRoutes();
  const { location } = useGeolocation();

  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>(routes);

  useEffect(() => {
    setFilteredRoutes(routes);
  }, [routes]);
  
  const handleSearch = () => {
    const fromQuery = fromLocation.trim().toLowerCase();
    const toQuery = toLocation.trim().toLowerCase();

    if (!fromQuery && !toQuery) {
      setFilteredRoutes(routes);
      return;
    }

    const filtered = routes.filter(route => {
      // Case 1: Both "From" and "To" are specified for journey planning.
      if (fromQuery && toQuery) {
        // Find the first stop that matches each query.
        const fromStop = MOCK_STOPS.find(s => s.name.toLowerCase().includes(fromQuery));
        const toStop = MOCK_STOPS.find(s => s.name.toLowerCase().includes(toQuery));

        // If either stop isn't found, the route doesn't match.
        if (!fromStop || !toStop) {
            return false;
        }

        const fromIndex = route.stops.indexOf(fromStop.id);
        const toIndex = route.stops.indexOf(toStop.id);

        // A valid journey requires both stops to be on the route in the correct order.
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      }
      
      // Case 2: Only one field is specified, searching for any route passing through a matching stop.
      const singleQuery = fromQuery || toQuery;
      // Check if any stop on the route includes the search query in its name.
      return route.stops.some(stopId => {
        const stop = MOCK_STOPS.find(s => s.id === stopId);
        return stop && stop.name.toLowerCase().includes(singleQuery);
      });
    });

    setFilteredRoutes(filtered);
  };
  
  const handleUseCurrentLocation = () => {
    if (location) {
      let closestStop = MOCK_STOPS[0];
      let minDistance = Infinity;

      MOCK_STOPS.forEach(stop => {
        const distance = getDistance(location, stop);
        if (distance < minDistance) {
          minDistance = distance;
          closestStop = stop;
        }
      });
      setFromLocation(closestStop.name);
    } else {
      alert('Não foi possível obter a localização. Por favor, habilite a permissão no seu navegador.');
    }
  };

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };
  
  const handleClearSearch = () => {
    setFromLocation('');
    setToLocation('');
    setFilteredRoutes(routes);
  };

  useEffect(() => {
    if (lastCommand?.command === 'READ_ROUTES') {
      const routesText = filteredRoutes.map(route => `${route.name}, com destino para ${route.destination}.`).join(' ');
      const fullText = routesText ? `Os ônibus encontrados são: ${routesText}` : 'Nenhum ônibus encontrado para essa rota.';
      speak(fullText);
      clearLastCommand();
    }
  }, [lastCommand, filteredRoutes, speak, clearLastCommand]);

  const handleSpeak = (text: string) => {
    speak(text);
  };
  
  const favoriteRoutes = routes.filter(route => route.isFavorite);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Navigation className="mr-3 h-7 w-7 text-purple-500" />
          Planeje sua Viagem
        </h2>
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="De: Ponto de partida"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleUseCurrentLocation} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500" aria-label="Usar localização atual">
                    <LocateFixed className="h-5 w-5" />
                </button>
            </div>
            <div className="flex justify-center items-center my-[-8px]">
              <button 
                  onClick={handleSwapLocations} 
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Inverter partida e destino"
              >
                  <ArrowUpDown className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <input
                type="text"
                placeholder="Para: Destino"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
             <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                    onClick={handleClearSearch}
                    className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:w-1/3 flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-lg text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-transform transform hover:scale-105"
                >
                    Limpar
                </button>
                <button
                    onClick={handleSearch}
                    className="w-full sm:w-auto flex-grow flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                >
                    <Search className="mr-2 h-5 w-5" />
                    Buscar Rotas
                </button>
             </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Star className="mr-3 h-7 w-7 text-yellow-500" />
          Rotas Favoritas
        </h2>
        <div className="space-y-4">
          {favoriteRoutes.length > 0 ? (
            favoriteRoutes.map(route => (
              <div key={route.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <p className="font-bold text-lg text-gray-800 dark:text-white">{route.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">Destino: {route.destination}</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => toggleFavorite(route.id)}
                    className="p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                    aria-label={route.isFavorite ? `Desfavoritar rota ${route.name}` : `Favoritar rota ${route.name}`}
                  >
                    <Star className={`h-5 w-5 ${route.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => handleSpeak(`${route.name}, destino ${route.destination}`)}
                    className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    aria-label={`Ouvir informações do ${route.name}`}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => navigate(`/route/${route.id}`)}
                    className="p-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    aria-label={`Ver rota detalhada do ${route.name}`}
                  >
                    <MapPin className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Você ainda não favoritou nenhuma rota. Toque na estrela de uma rota para adicioná-la aqui.</p>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Route className="mr-3 h-7 w-7 text-green-500" />
            Ônibus Próximos
        </h2>
        <div className="space-y-4">
          {filteredRoutes.length > 0 ? (
            filteredRoutes.map(route => (
              <div key={route.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <p className="font-bold text-lg text-gray-800 dark:text-white">{route.name}</p>
                  <p className="text-gray-600 dark:text-gray-400">Destino: {route.destination}</p>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                   <button
                    onClick={() => toggleFavorite(route.id)}
                    className="p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                    aria-label={route.isFavorite ? `Desfavoritar rota ${route.name}` : `Favoritar rota ${route.name}`}
                  >
                    <Star className={`h-5 w-5 ${route.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => handleSpeak(`${route.name}, destino ${route.destination}`)}
                    className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    aria-label={`Ouvir informações do ${route.name}`}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => navigate(`/route/${route.id}`)}
                    className="p-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    aria-label={`Ver rota detalhada do ${route.name}`}
                  >
                    <MapPin className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhuma rota encontrada para o trajeto informado.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => navigate('/communication')}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-2xl shadow-lg flex items-center justify-center space-x-4 text-xl font-bold hover:opacity-90 transition-opacity transform hover:scale-105"
        >
          <MessageCircle className="h-8 w-8" />
          <span>Comunicar</span>
        </button>
        <button 
          onClick={() => navigate('/admin/routes')}
          className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 rounded-2xl shadow-lg flex items-center justify-center space-x-4 text-xl font-bold hover:opacity-90 transition-opacity transform hover:scale-105"
        >
          <Route className="h-8 w-8" />
          <span>Gerenciar Rotas</span>
        </button>
      </div>

    </div>
  );
};

export default Dashboard;