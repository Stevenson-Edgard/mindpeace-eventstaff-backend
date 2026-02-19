/// <reference types="vite/client" />
import { AccessLog, StaffMember, EventStats, Attendee, ScanStatus } from '../types/index';
import { MOCK_LOGS, MOCK_STAFF, MOCK_ATTENDEES, GATES } from '../lib/constants';

type EventCallback = (data?: any) => void;

export interface AppMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  time: string;
  type: 'info' | 'warning' | 'urgent';
  isRead: boolean;
}

class ApiService {
  private static instance: ApiService;
  private storageKey = 'esp_db_v1';
  private listeners: { [key: string]: EventCallback[] } = {};

  private constructor() {
    this.initializeDB();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // --- REAL-TIME EVENT BUS ---
  public subscribe(event: string, callback: EventCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  private emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // --- INTERNAL DB HELPERS ---
  private initializeDB() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      const initialDB = {
        staff: MOCK_STAFF,
        logs: MOCK_LOGS,
        attendees: MOCK_ATTENDEES,
        messages: [
          { id: '1', sender: 'Operations', subject: 'Shift Change', body: 'Afternoon rotation starting in 15 mins.', time: '14:30', type: 'info', isRead: false },
          { id: '2', sender: 'Security HQ', subject: 'VIP Arrival', body: 'The headliner has entered the venue.', time: '14:10', type: 'urgent', isRead: true }
        ],
        config: { capacity: 5000 }
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialDB));
    }
  }

  private getDB() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
  }

  private saveDB(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // --- AUTH ENDPOINTS ---
  async login(id: string): Promise<{ token: string; user: StaffMember }> {
    await new Promise(r => setTimeout(r, 600));
    const db = this.getDB();
    const staff = db.staff.find((s: StaffMember) => s.id === id || s.email === id);
    if (!staff) throw new Error('Staff ID not found');
    staff.status = 'online';
    this.saveDB(db);
    this.emit('staff_presence');
    return { token: 'mock-token', user: staff };
  }

  async logout(staffId: string): Promise<void> {
    const db = this.getDB();
    const staff = db.staff.find((s: StaffMember) => s.id === staffId);
    if (staff) {
      staff.status = 'offline';
      staff.currentGateId = undefined;
      this.saveDB(db);
      this.emit('staff_presence');
    }
  }

  // --- MESSAGING ---
  async getMessages(): Promise<AppMessage[]> {
    return this.getDB().messages || [];
  }

  async markMessageRead(id: string): Promise<void> {
    const db = this.getDB();
    const msg = db.messages.find((m: any) => m.id === id);
    if (msg) msg.isRead = true;
    this.saveDB(db);
  }

  // --- GATE ENDPOINTS ---
  async getGates(): Promise<any[]> {
    const db = this.getDB();
    return GATES.map(gate => ({
      ...gate,
      staffCount: db.staff.filter((s: StaffMember) => s.currentGateId === gate.id && s.status === 'online').length
    }));
  }

  async assignGate(staffId: string, gateId: string): Promise<void> {
    const db = this.getDB();
    const staff = db.staff.find((s: StaffMember) => s.id === staffId);
    if (staff) {
      staff.currentGateId = gateId;
      staff.location = GATES.find(g => g.id === gateId)?.name || 'Unknown';
      this.saveDB(db);
      this.emit('staff_presence');
    }
  }

  // --- SCANNING ENDPOINTS ---
  async verifyBracelet(uid: string, staffId: string, gateId: string): Promise<{ status: ScanStatus; attendee?: Attendee; error?: string }> {
    const db = this.getDB();
    const attendee = db.attendees.find((a: Attendee) => a.braceletUid === uid);
    const staff = db.staff.find((s: StaffMember) => s.id === staffId);
    const gate = GATES.find(g => g.id === gateId);

    if (!attendee) {
      const alertLog = { id: `ERR-${Date.now()}`, braceletId: uid, timestamp: new Date().toLocaleTimeString(), staffId, scannedBy: staff?.name || 'Unknown', gate: gate?.name || 'Unknown', type: 'GA' as any, status: 'FAILED' as any, errorType: 'Unrecognized UID' };
      this.emit('security_alert', alertLog);
      return { status: 'FAILED', error: 'Unrecognized Bracelet UID' };
    }

    const isDuplicate = db.logs.some((l: AccessLog) => l.braceletId === uid && l.status === 'SUCCESS');
    const status: ScanStatus = isDuplicate ? 'DUPLICATE' : 'SUCCESS';
    
    const newLog: AccessLog = {
      id: `LOG-${Date.now()}`,
      braceletId: uid,
      timestamp: new Date().toLocaleTimeString(),
      staffId,
      scannedBy: staff?.name || 'Unknown',
      gate: gate?.name || 'Unknown',
      type: attendee.tier,
      status,
      errorType: isDuplicate ? 'Duplicate Entry Attempt' : undefined
    };

    db.logs.unshift(newLog);
    this.saveDB(db);
    this.emit('new_scan', newLog);
    
    if (status === 'DUPLICATE') {
      this.emit('security_alert', newLog);
    }

    return { status, attendee: status === 'SUCCESS' ? attendee : undefined, error: isDuplicate ? 'Already Scanned' : undefined };
  }

  async manualOverride(uid: string, supervisorId: string, gateId: string): Promise<void> {
    const db = this.getDB();
    const attendee = db.attendees.find((a: Attendee) => a.braceletUid === uid);
    const supervisor = db.staff.find((s: StaffMember) => s.id === supervisorId);
    const gate = GATES.find(g => g.id === gateId);

    const overrideLog: AccessLog = {
      id: `OVR-${Date.now()}`,
      braceletId: uid,
      timestamp: new Date().toLocaleTimeString(),
      staffId: supervisorId,
      scannedBy: `${supervisor?.name} (OVERRIDE)`,
      gate: gate?.name || 'Unknown',
      type: attendee?.tier || 'GA',
      status: 'SUCCESS',
    };

    db.logs.unshift(overrideLog);
    this.saveDB(db);
    this.emit('new_scan', overrideLog);
  }

  // --- ANALYTICS ---
  async getLogs(): Promise<AccessLog[]> { return this.getDB().logs; }
  async getStaff(): Promise<StaffMember[]> { return this.getDB().staff; }
  
  async getUserStats(staffId: string): Promise<{ totalScans: number; successRate: number; lastHour: number }> {
    const db = this.getDB();
    const userLogs = db.logs.filter((l: AccessLog) => l.staffId === staffId);
    const successful = userLogs.filter((l: AccessLog) => l.status === 'SUCCESS').length;
    
    return {
      totalScans: userLogs.length,
      successRate: userLogs.length > 0 ? (successful / userLogs.length) * 100 : 100,
      lastHour: userLogs.filter((l: AccessLog) => {
          // Simple mock: assume logs with IDs containing "LOG-" are new
          return l.id.startsWith('LOG-');
      }).length
    };
  }

  async getStats(): Promise<EventStats> {
    const db = this.getDB();
    const checkIns = db.logs.filter((l: AccessLog) => l.status === 'SUCCESS').length;
    return {
      capacity: db.config.capacity,
      checkIn: 3200 + checkIns,
      rate: 42 + Math.floor(Math.random() * 10),
      rateIncrease: 12
    };
  }

  async getTierBreakdown(): Promise<any[]> {
    const db = this.getDB();
    const logs = db.logs.filter((l: AccessLog) => l.status === 'SUCCESS');
    return [
      { label: 'VIP Access', current: 850 + logs.filter((l: any) => l.type === 'VIP').length, total: 1000 },
      { label: 'General Admission', current: 2240 + logs.filter((l: any) => l.type === 'GA').length, total: 3500 },
      { label: 'Backstage & Media', current: 150 + logs.filter((l: any) => l.type === 'STAFF').length, total: 500 },
    ];
  }
}

export const api = ApiService.getInstance();

//const API_BASE = 'https://valda-toxicological-perspiringly.ngrok-free.dev/api/auth';
//const API_BASE = 'https://mindpeace-eventstaff-backend.onrender.com/api/auth';
const API_BASE = import.meta.env.VITE_API_BASE;

export async function registerUser(phone: string, password: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function loginUser(phone: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
