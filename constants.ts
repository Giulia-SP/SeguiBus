import { BusStop, BusRoute, CommunicationPhrase } from './types';
import { MessageSquare, MapPin, HelpCircle, Volume2 } from 'lucide-react';

export const MOCK_STOPS: BusStop[] = [
  // São Paulo - Centro
  { id: 'stop1', name: 'Terminal Central', lat: -23.5505, lng: -46.6333 },
  { id: 'stop4', name: 'Praça da República', lat: -23.5433, lng: -46.6416 },
  { id: 'stop8', name: 'Estação de Metrô Sé', lat: -23.5507, lng: -46.6341 },
  { id: 'spc_anhan', name: 'Terminal Pq. Dom Pedro II', lat: -23.547, lng: -46.629 },
  { id: 'spc_lib', name: 'Metrô Liberdade', lat: -23.558, lng: -46.635 },
  
  // São Paulo - Zona Oeste
  { id: 'stop2', name: 'Av. Paulista, 1578', lat: -23.5614, lng: -46.6564 },
  { id: 'stop3', name: 'R. da Consolação, 2200', lat: -23.5562, lng: -46.6608 },
  { id: 'spzw_butanta', name: 'Metrô Butantã', lat: -23.571, lng: -46.705 },
  { id: 'spzw_pinheiros', name: 'Largo da Batata (Metrô Faria Lima)', lat: -23.567, lng: -46.693 },
  { id: 'spzw_usp', name: 'USP - Praça do Relógio', lat: -23.560, lng: -46.729 },
  { id: 'spzw_reboucas', name: 'Av. Rebouças, 1000', lat: -23.563, lng: -46.673 },
  
  // São Paulo - Zona Sul
  { id: 'stop6', name: 'Shopping Morumbi', lat: -23.621, lng: -46.698 },
  { id: 'stop7', name: 'Parque Ibirapuera', lat: -23.588, lng: -46.6588 },
  { id: 'spzs_jabaquara', name: 'Terminal Jabaquara', lat: -23.644, lng: -46.643 },
  { id: 'spzs_santoamaro', name: 'Largo 13 de Maio', lat: -23.650, lng: -46.705 },
  { id: 'spzs_aeroporto', name: 'Aeroporto de Congonhas', lat: -23.626, lng: -46.656 },
  
  // Taboão da Serra
  { id: 'ts_shopping', name: 'Shopping Taboão', lat: -23.623, lng: -46.799 },
  { id: 'ts_centro', name: 'Praça Nicola Vivilechio', lat: -23.606, lng: -46.776 },
  { id: 'ts_cemiterio', name: 'Cemitério da Saudade', lat: -23.601, lng: -46.769 },
  { id: 'ts_pirajussara', name: 'Largo do Pirajuçara', lat: -23.629, lng: -46.782 },
  { id: 'ts_kizaemon', name: 'Estr. Kizaemon Takeuti, 100', lat: -23.620, lng: -46.786 },
];


export const MOCK_ROUTES: BusRoute[] = [
  { 
    id: '123', 
    name: 'Linha 123 - Centro via Paulista', 
    destination: 'Terminal Central', 
    stops: ['spzw_butanta', 'spzw_reboucas', 'stop2', 'stop3', 'stop4', 'stop1'],
    schedule: {
      'spzw_butanta': ['07:00', '07:30', '08:00', '08:30'],
      'stop2': ['07:20', '07:50', '08:20', '08:50'],
      'stop1': ['07:45', '08:15', '08:45', '09:15'],
    }
  },
  { 
    id: '190', 
    name: 'Linha 190 - Taboão/Pinheiros', 
    destination: 'Largo da Batata (Metrô Faria Lima)', 
    stops: ['ts_shopping', 'ts_centro', 'spzw_butanta', 'spzw_pinheiros'],
    schedule: {
      'ts_shopping': ['06:00', '06:45', '07:30'],
      'spzw_butanta': ['06:30', '07:15', '08:00'],
      'spzw_pinheiros': ['06:45', '07:30', '08:15'],
    }
  },
   { 
    id: '212', 
    name: 'Linha 212 - Circular USP', 
    destination: 'Metrô Butantã', 
    stops: ['spzw_butanta', 'spzw_usp', 'spzw_butanta'],
  },
  { 
    id: '300', 
    name: 'Linha 300 - Jabaquara/Centro', 
    destination: 'Praça da República', 
    stops: ['spzs_jabaquara', 'spzs_aeroporto', 'stop7', 'stop4', 'stop8'],
  },
  { 
    id: '456', 
    name: 'Linha 456 - Pirajuçara/Consolação', 
    destination: 'R. da Consolação, 2200', 
    stops: ['ts_pirajussara', 'ts_shopping', 'spzw_butanta', 'spzw_pinheiros', 'spzw_reboucas', 'stop3'],
  },
  { 
    id: '511', 
    name: 'Linha 511 - Sto. Amaro/Pq. Dom Pedro', 
    destination: 'Terminal Pq. Dom Pedro II', 
    stops: ['spzs_santoamaro', 'stop6', 'stop7', 'spc_lib', 'spc_anhan'],
  },
  { 
    id: '789', 
    name: 'Linha 789 - Circular Shopping', 
    destination: 'Shopping Morumbi', 
    stops: ['stop1', 'stop4', 'stop6'],
  },
  { 
    id: '841', 
    name: 'Linha 841 - Centro (Taboão)', 
    destination: 'Praça Nicola Vivilechio', 
    stops: ['ts_pirajussara', 'ts_kizaemon', 'ts_cemiterio', 'ts_centro'],
  },
  { 
    id: '505', 
    name: 'Linha 505 - Circular Central SP', 
    destination: 'Terminal Central', 
    stops: ['stop6', 'stop7', 'stop2', 'stop3', 'stop8', 'stop1'],
  },
];


export const COMMUNICATION_PHRASES: CommunicationPhrase[] = [
    { id: 'c1', text: 'Por favor, pode me avisar quando chegar no ponto final?', icon: MessageSquare },
    { id: 'c2', text: 'Este ônibus vai para o Terminal Central?', icon: HelpCircle },
    { id: 'c3', text: 'Onde devo descer para chegar na Avenida Paulista?', icon: MapPin },
    { id: 'c4', text: 'Obrigado(a)!', icon: Volume2 },
    { id: 'c5', text: 'Com licença.', icon: MessageSquare },
    { id: 'c6', text: 'Preciso de ajuda, por favor.', icon: HelpCircle },
];