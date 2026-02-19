
// Fix: Import types from types/index to avoid empty root types.ts module issue
import { StaffMember, AccessLog, Attendee } from '../types/index';

export const MOCK_STAFF: StaffMember[] = [
  { id: '1', email: 'marcus@event.com', name: 'Marcus Wright', role: 'SUPERVISOR', location: 'Gate 4', activeTime: '4h', status: 'online', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: '2', email: 'elena@event.com', name: 'Elena Rodriguez', role: 'GATEKEEPER', location: 'VIP Entrance', activeTime: '2h', status: 'online', avatar: 'https://i.pravatar.cc/150?u=elena' },
  { id: '3', email: 'james@event.com', name: 'James Sterling', role: 'SECURITY', location: 'Gate 1', activeTime: 'Offline', status: 'offline' },
  { id: '4', email: 'david@event.com', name: 'David Chen', role: 'GATEKEEPER', location: 'Gate 2', activeTime: '15m', status: 'online', avatar: 'https://i.pravatar.cc/150?u=david' },
  { id: '5', email: 'sarah@event.com', name: 'Sarah Miller', role: 'SUPERVISOR', location: 'Main Stage', activeTime: '1h', status: 'online', avatar: 'https://i.pravatar.cc/150?u=sarah' },
];

export const MOCK_LOGS: AccessLog[] = [
  { id: 'L1', braceletId: '#BR-882901', timestamp: '14:22:05', staffId: '1', scannedBy: 'Marcus', gate: 'Gate A', type: 'VIP', status: 'SUCCESS' },
  { id: 'L2', braceletId: '#BR-441299', timestamp: '14:21:58', staffId: '2', scannedBy: 'Elena', gate: 'Gate B', type: 'GA', status: 'FAILED', errorType: 'Invalid Token: Expired' },
  { id: 'L3', braceletId: '#BR-002133', timestamp: '14:20:12', staffId: '4', scannedBy: 'David', gate: 'Gate C', type: 'STAFF', status: 'DUPLICATE' },
  { id: 'L4', braceletId: '#BR-772101', timestamp: '14:19:44', staffId: '5', scannedBy: 'Sarah', gate: 'VIP Gate', type: 'VIP', status: 'SUCCESS' },
  { id: 'L5', braceletId: '#BR-110022', timestamp: '14:18:30', staffId: '1', scannedBy: 'Marcus', gate: 'Gate A', type: 'GA', status: 'SUCCESS' },
];

export const MOCK_ATTENDEES: Attendee[] = [
  { id: 'A1', name: 'Julian Casablancas', tier: 'VIP', photo: 'https://i.pravatar.cc/300?u=julian', braceletUid: '#BR-882901', totalScansAllowed: 10, scansRemaining: 9 },
  { id: 'A2', name: 'Amelie Poulain', tier: 'GA', photo: 'https://i.pravatar.cc/300?u=amelie', braceletUid: '#BR-441299', totalScansAllowed: 1, scansRemaining: 0 },
  { id: 'A3', name: 'Thomas Bangalter', tier: 'STAFF', photo: 'https://i.pravatar.cc/300?u=thomas', braceletUid: '#BR-002133', totalScansAllowed: 100, scansRemaining: 95 },
];

export const GATES = [
  { id: 'gate-1', name: 'Main Entrance - Gate 1', staffCount: 8, status: 'high' },
  { id: 'gate-a', name: 'VIP Entrance - Gate A', staffCount: 3, status: 'med' },
  { id: 'backstage', name: 'Backstage Entry', staffCount: 1, status: 'low' },
  { id: 'staff', name: 'Staff & Vendor Gate', staffCount: 0, status: 'none' },
];
