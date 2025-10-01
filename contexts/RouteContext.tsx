import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BusRoute, BusStop } from '../types';
import { MOCK_ROUTES, MOCK_STOPS } from '../constants';

interface RouteContextType {
  routes: BusRoute[];
  addRoute: (routeData: Omit<BusRoute, 'id'>) => void;
  updateRoute: (updatedRoute: BusRoute) => void;
  deleteRoute: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

// Levenshtein distance function for finding the closest string match.
const levenshtein = (s1: string, s2: string): number => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) {
            costs[s2.length] = lastValue;
        }
    }
    return costs[s2.length];
};

// Helper to resolve a destination string into a route.
const resolveRouteForDestination = (destination: string): { stops: string[], finalStopName: string, matchFound: boolean } => {
    const normalizedDestination = destination.trim().toLowerCase();
    let destinationStop: BusStop | null = null;
    let matchFound = false;

    // 1. Try for an exact or partial match
    if (normalizedDestination) {
        destinationStop = MOCK_STOPS.find(s => s.name.toLowerCase() === normalizedDestination) ||
                          MOCK_STOPS.find(s => s.name.toLowerCase().includes(normalizedDestination));
    }
    
    // 2. If no direct match, find the closest match using Levenshtein distance
    if (!destinationStop && normalizedDestination) {
        let minDistance = Infinity;
        let bestMatch: BusStop | null = null;

        MOCK_STOPS.forEach(stop => {
            const distance = levenshtein(normalizedDestination, stop.name);
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = stop;
            }
        });
        
        // Heuristic to ensure the match is reasonably close
        if (bestMatch && minDistance < normalizedDestination.length / 2 + 3) {
             destinationStop = bestMatch;
        }
    }

    // 3. If a destination stop is determined, build the route ending there
    if (destinationStop) {
      matchFound = true;
      const otherStops = MOCK_STOPS.filter(stop => stop.id !== destinationStop!.id);
      const shuffled = [...otherStops].sort(() => 0.5 - Math.random());
      const numOtherStops = Math.floor(Math.random() * 3) + 2; // 2 to 4 other stops
      const selectedStopIds = shuffled.slice(0, numOtherStops).map(stop => stop.id);
      
      return {
        stops: [...selectedStopIds, destinationStop.id],
        finalStopName: destinationStop.name,
        matchFound,
      };
    }
    
    // 4. Fallback: if no destination is provided or no good match is found, create a completely random route
    const shuffled = [...MOCK_STOPS].sort(() => 0.5 - Math.random());
    const numStops = Math.floor(Math.random() * 3) + 3; // 3 to 5 stops total
    const selectedStops = shuffled.slice(0, numStops);
    const lastStop = selectedStops[selectedStops.length - 1];

    return {
        stops: selectedStops.map(stop => stop.id),
        finalStopName: lastStop ? lastStop.name : 'Destino Aleatório',
        matchFound: false,
    };
};

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<BusRoute[]>(() => {
    try {
      const localData = localStorage.getItem('seguibus-routes');
      return localData ? JSON.parse(localData) : MOCK_ROUTES;
    } catch (error) {
      console.error("Could not parse routes from localStorage", error);
      return MOCK_ROUTES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('seguibus-routes', JSON.stringify(routes));
    } catch (error) {
      console.error("Could not save routes to localStorage", error);
    }
  }, [routes]);


  const addRoute = (routeData: Omit<BusRoute, 'id'>) => {
    const { stops, finalStopName, matchFound } = resolveRouteForDestination(routeData.destination);
    
    const newRoute: BusRoute = {
      name: routeData.name,
      // If a match was found for the user's input, we preserve their original text.
      // Otherwise, we use the name of the final stop from the generated random route.
      destination: matchFound ? routeData.destination : finalStopName,
      stops: stops,
      id: new Date().toISOString(), // Simple unique ID generation
      isFavorite: false,
    };
    setRoutes(prevRoutes => [...prevRoutes, newRoute]);
  };

  const updateRoute = (updatedRoute: BusRoute) => {
    const { stops, finalStopName, matchFound } = resolveRouteForDestination(updatedRoute.destination);
    
    const newUpdatedRoute: BusRoute = {
      ...updatedRoute,
      stops: stops,
      destination: matchFound ? updatedRoute.destination : finalStopName,
    };

    setRoutes(prevRoutes =>
      prevRoutes.map(route => (route.id === newUpdatedRoute.id ? newUpdatedRoute : route))
    );
  };

  const deleteRoute = (id: string) => {
    setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== id));
  };
  
  const toggleFavorite = (id: string) => {
    setRoutes(prevRoutes =>
      prevRoutes.map(route =>
        route.id === id ? { ...route, isFavorite: !route.isFavorite } : route
      )
    );
  };


  return (
    <RouteContext.Provider value={{ routes, addRoute, updateRoute, deleteRoute, toggleFavorite }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoutes = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoutes must be used within a RouteProvider');
  }
  return context;
};