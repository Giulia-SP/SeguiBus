
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BusRoute, BusStop } from '../../types';
import { ArrowLeft, Edit, Trash2, PlusCircle, Clock, X } from 'lucide-react';
import { useRoutes } from '../../contexts/RouteContext';
import { MOCK_STOPS } from '../../constants';

const CrudRoutes: React.FC = () => {
  const { routes, addRoute, updateRoute, deleteRoute } = useRoutes();
  const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (route: BusRoute) => {
    setEditingRoute(route);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // The confirmation dialog was reported as preventing deletion.
    // Removing it to ensure the feature works as requested.
    // A custom modal confirmation would be a good future enhancement.
    deleteRoute(id);
  };

  const handleAddNew = () => {
    setEditingRoute(null);
    setIsFormOpen(true);
  };

  const handleSave = (routeData: Omit<BusRoute, 'id' | 'isFavorite'>) => {
    if (editingRoute) {
      updateRoute({ ...editingRoute, ...routeData });
    } else {
      addRoute(routeData);
    }
    setIsFormOpen(false);
    setEditingRoute(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center mb-6 text-blue-600 dark:text-cyan-400 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o Dashboard
      </Link>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciar Rotas</h1>
          <button onClick={handleAddNew} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
            <PlusCircle className="h-5 w-5" />
            <span>Adicionar Rota</span>
          </button>
        </div>

        {isFormOpen ? (
          <RouteForm route={editingRoute} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destino</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paradas</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {routes.map((route) => (
                  <tr key={route.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{route.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{route.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{route.stops.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => handleEdit(route)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" aria-label={`Editar rota ${route.name}`}>
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(route.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" aria-label={`Excluir rota ${route.name}`}>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

interface RouteFormProps {
  route: BusRoute | null;
  onSave: (route: Omit<BusRoute, 'id' | 'isFavorite'>) => void;
  onCancel: () => void;
}

const RouteForm: React.FC<RouteFormProps> = ({ route, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: route?.name || '',
    destination: route?.destination || '',
    schedule: route?.schedule || {},
  });
  
  const [newTimes, setNewTimes] = useState<{[stopId: string]: string}>({});
  
  const routeStops = route?.stops.map(stopId => MOCK_STOPS.find(s => s.id === stopId)).filter(Boolean) as BusStop[] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: formData.name, destination: formData.destination, stops: route?.stops || [], schedule: formData.schedule });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTimeChange = (stopId: string, value: string) => {
    setNewTimes(prev => ({...prev, [stopId]: value}));
  };
  
  const handleAddTime = (stopId: string) => {
    const timeToAdd = newTimes[stopId];
    if (timeToAdd) {
        setFormData(prev => {
            const existingTimes = prev.schedule[stopId] || [];
            if (existingTimes.includes(timeToAdd)) return prev; // Avoid duplicates
            const updatedTimes = [...existingTimes, timeToAdd].sort();
            return {
                ...prev,
                schedule: { ...prev.schedule, [stopId]: updatedTimes },
            };
        });
        setNewTimes(prev => ({...prev, [stopId]: ''}));
    }
  };
  
  const handleRemoveTime = (stopId: string, timeToRemove: string) => {
    setFormData(prev => ({
        ...prev,
        schedule: {
            ...prev.schedule,
            [stopId]: (prev.schedule[stopId] || []).filter(t => t !== timeToRemove),
        },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Rota</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700"/>
      </div>
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destino</label>
        <input type="text" name="destination" id="destination" value={formData.destination} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700"/>
         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Alterar o destino pode alterar a lista de paradas da rota.</p>
      </div>
      
      {route && routeStops.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
           <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center"><Clock className="mr-2 h-5 w-5"/>Gerenciar Horários</h3>
            {routeStops.map(stop => (
               <div key={stop.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                   <p className="font-semibold">{stop.name}</p>
                   <div className="flex items-center gap-2 mt-2">
                       <input 
                           type="time" 
                           value={newTimes[stop.id] || ''}
                           onChange={(e) => handleTimeChange(stop.id, e.target.value)}
                           className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700"
                       />
                       <button type="button" onClick={() => handleAddTime(stop.id)} className="bg-indigo-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-indigo-600">Adicionar</button>
                   </div>
                   <div className="mt-2 flex flex-wrap gap-2">
                       {(formData.schedule[stop.id] || []).map(time => (
                           <div key={time} className="flex items-center gap-1 bg-gray-200 dark:bg-gray-600 text-sm px-2 py-1 rounded-full">
                               <span>{time}</span>
                               <button type="button" onClick={() => handleRemoveTime(stop.id, time)} className="text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                                   <X className="h-3 w-3" />
                               </button>
                           </div>
                       ))}
                   </div>
               </div>
            ))}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Salvar</button>
      </div>
    </form>
  );
};

export default CrudRoutes;