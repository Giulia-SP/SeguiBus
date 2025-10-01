
import React from 'react';

export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface BusRoute {
  id: string;
  name: string;
  destination: string;
  stops: string[]; // array of BusStop ids
  isFavorite?: boolean;
}

export interface User {
  id: string;
  email: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  textToSpeech: boolean;
}

export interface CommunicationPhrase {
  id: string;
  text: string;
  // FIX: React.ElementType requires importing React.
  icon: React.ElementType;
}