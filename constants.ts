import { BusStop, BusRoute, CommunicationPhrase } from './types';
import { MessageSquare, MapPin, HelpCircle, Volume2 } from 'lucide-react';

export const MOCK_STOPS: BusStop[] = [
  { id: 'stop1', name: 'Terminal Central', lat: -23.5505, lng: -46.6333 },
  { id: 'stop2', name: 'Av. Paulista, 1578', lat: -23.5614, lng: -46.6564 },
  { id: 'stop3', name: 'R. da Consolação, 2200', lat: -23.5562, lng: -46.6608 },
  { id: 'stop4', name: 'Praça da República', lat: -23.5433, lng: -46.6416 },
  { id: 'stop5', name: 'Bairro X - Ponto Final', lat: -23.5300, lng: -46.6200 },
  { id: 'stop6', name: 'Shopping Principal', lat: -23.5700, lng: -46.6700 },
  { id: 'stop7', name: 'Parque Ibirapuera', lat: -23.588, lng: -46.6588 },
  { id: 'stop8', name: 'Estação de Metrô', lat: -23.552, lng: -46.645 },
];

export const MOCK_ROUTES: BusRoute[] = [
  { id: '123', name: 'Ônibus 123 - Centro', destination: 'Terminal Central', stops: ['stop2', 'stop3', 'stop4', 'stop1'] },
  { id: '456', name: 'Ônibus 456 - Bairro X', destination: 'Bairro X', stops: ['stop6', 'stop2', 'stop5'] },
  { id: '789', name: 'Circular Shopping', destination: 'Shopping Principal', stops: ['stop1', 'stop4', 'stop6'] },
  { id: '101', name: 'Linha 101 - Parque', destination: 'Parque Ibirapuera', stops: ['stop8', 'stop2', 'stop7'] },
  { id: '202', name: 'Linha 202 - Consolação', destination: 'R. da Consolação', stops: ['stop1', 'stop8', 'stop4', 'stop3'] },
  { id: '303', name: 'Expresso República', destination: 'Praça da República', stops: ['stop5', 'stop8', 'stop4'] },
  { id: '505', name: 'Circular Central', destination: 'Terminal Central', stops: ['stop6', 'stop7', 'stop2', 'stop3', 'stop8', 'stop1'] },
];

export const COMMUNICATION_PHRASES: CommunicationPhrase[] = [
    { id: 'c1', text: 'Por favor, pode me avisar quando chegar no ponto final?', icon: MessageSquare },
    { id: 'c2', text: 'Este ônibus vai para o Terminal Central?', icon: HelpCircle },
    { id: 'c3', text: 'Onde devo descer para chegar na Avenida Paulista?', icon: MapPin },
    { id: 'c4', text: 'Obrigado(a)!', icon: Volume2 },
    { id: 'c5', text: 'Com licença.', icon: MessageSquare },
    { id: 'c6', text: 'Preciso de ajuda, por favor.', icon: HelpCircle },
];