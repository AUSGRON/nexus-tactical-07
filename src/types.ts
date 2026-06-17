/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoOption {
  id: string;
  name: string;
  url: string;
  category: 'Atmospheric' | 'Circuit' | 'Grid' | 'Ambient';
  description: string;
}

export interface LogEntry {
  timestamp: string;
  sender: 'SYSTEM' | 'NEXUS-07' | 'HQ' | 'ERROR';
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
}

export interface SubsystemStatus {
  id: string;
  name: string;
  status: 'ONLINE' | 'ACTIVE' | 'CALIBRATING' | 'WARNING' | 'OFFLINE';
  efficiency: number; // percentage
  load: number; // percentage
  temp: number; // °C
}

export interface WeaponSys {
  name: string;
  type: string;
  ammoCurrent: number;
  ammoMax: number;
  fireMode: 'SEMI' | 'BURST' | 'AUTO';
  heatLevel: number; // percentage
  lockedOn: boolean;
}

export interface GPSCoord {
  lat: string;
  lng: string;
  alt: string;
  bearing: string;
}
