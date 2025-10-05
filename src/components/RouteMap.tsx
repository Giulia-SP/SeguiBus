import React, { useState } from 'react';
import { BusStop } from '../types';
import { MapPin, Bus, User } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface RouteMapProps {
  stops: BusStop[];
  currentStop: BusStop | null;
  userLocation: { lat: number, lng: number } | null;
  routeName: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ stops, currentStop, userLocation, routeName }) => {
  const { speak } = useAccessibility();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleElementClick = (id: string, text: string) => {
    speak(text);
    setActiveTooltip(prev => (prev === id ? null : id));
  };

  const allPoints = [...stops];
  if (userLocation) {
      allPoints.push({ id: 'user', name: 'Sua Localização', ...userLocation });
  }

  if (allPoints.length === 0) {
    return <div className="text-center h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">Nenhuma parada para exibir no mapa.</div>;
  }

  const latitudes = allPoints.map(p => p.lat);
  const longitudes = allPoints.map(p => p.lng);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latRange = maxLat - minLat;
  const lngRange = maxLng - minLng;
  
  const PADDING_PERCENT = 15;

  const getCoordinates = (lat: number, lng: number) => {
    const x = lngRange === 0 
      ? 50 
      : ((lng - minLng) / lngRange) * (100 - PADDING_PERCENT * 2) + PADDING_PERCENT;
    const y = latRange === 0 
      ? 50 
      : ((maxLat - lat) / latRange) * (100 - PADDING_PERCENT * 2) + PADDING_PERCENT;
    return { x: `${x}%`, y: `${y}%` };
  };

  const routePath = stops.length > 1 ? stops.map(stop => {
    const coords = getCoordinates(stop.lat, stop.lng);
    return `${parseFloat(coords.x)},${parseFloat(coords.y)}`;
  }).join(' ') : '';

  return (
    <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner border border-gray-300 dark:border-gray-600">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
         {routePath && <polyline
          points={routePath}
          fill="none"
          stroke="rgba(59, 130, 246, 0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 2"
        />}
      </svg>
      {stops.map((stop) => {
        const { x, y } = getCoordinates(stop.lat, stop.lng);
        const isCurrent = currentStop?.id === stop.id;
        const isActive = activeTooltip === stop.id;
        return (
          <div 
            key={stop.id} 
            className="absolute group" 
            style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
            onClick={() => handleElementClick(stop.id, stop.name)}
            role="button"
            aria-label={`Parada: ${stop.name}`}
          >
            <MapPin className={`h-6 w-6 transition-all duration-500 cursor-pointer group-hover:scale-125 ${isCurrent ? 'text-blue-500 scale-125' : 'text-gray-500'}`} />
            <span className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{stop.name}</span>
          </div>
        );
      })}
       {userLocation && (
        <div 
            className="absolute group" 
            style={{ 
                left: getCoordinates(userLocation.lat, userLocation.lng).x, 
                top: getCoordinates(userLocation.lat, userLocation.lng).y, 
                transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleElementClick('user', 'Sua localização atual')}
            role="button"
            aria-label="Sua localização"
        >
          <User className="h-6 w-6 text-green-600 dark:text-green-400 drop-shadow-lg" />
          <span className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap ${activeTooltip === 'user' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>Você</span>
        </div>
      )}
      {currentStop && (
        <div 
            className="absolute transition-all duration-1000 ease-in-out" 
            style={{ 
                left: getCoordinates(currentStop.lat, currentStop.lng).x, 
                top: getCoordinates(currentStop.lat, currentStop.lng).y, 
                transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleElementClick('bus', `Ônibus ${routeName} está na parada ${currentStop.name}`)}
            role="button"
            aria-label={`Ônibus ${routeName}`}
        >
          <Bus className="h-8 w-8 text-blue-600 dark:text-cyan-400 animate-pulse drop-shadow-lg cursor-pointer" />
           <span className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap ${activeTooltip === 'bus' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{routeName}</span>
        </div>
      )}
    </div>
  );
};

export default RouteMap;