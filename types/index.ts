
export type UserRole = 'SUPERVISOR' | 'GATEKEEPER' | 'SECURITY';
export type ScanStatus = 'SUCCESS' | 'FAILED' | 'DUPLICATE';

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  location: string;
  activeTime: string;
  status: 'online' | 'offline';
  avatar?: string;
  currentGateId?: string;
}

export interface AccessLog {
  id: string;
  braceletId: string;
  timestamp: string;
  staffId: string; // FK to Staff
  scannedBy: string; // Staff Name for UI convenience
  gate: string;
  type: 'VIP' | 'GA' | 'STAFF' | 'BACKSTAGE';
  status: ScanStatus;
  errorType?: string; // e.g., "Expired", "Wrong Gate", "Duplicate"
}

export interface Attendee {
  id: string;
  name: string;
  tier: 'VIP' | 'GA' | 'STAFF' | 'BACKSTAGE';
  photo: string;
  braceletUid: string;
  totalScansAllowed: number;
  scansRemaining: number;
}

export interface EventStats {
  capacity: number;
  checkIn: number;
  rate: number;
  rateIncrease: number;
}
