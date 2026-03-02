// scripts/seed-users.ts
// Usage: npx ts-node scripts/seed-users.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../server/models/User.ts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const MONGO_URI = process.env.MONGO_URI || '';

const defaultStaff = [
    {
        phone: '+15555550101',
        password: 'test1234', // plain text for easy login
        name: 'Alex Johnson',
        role: 'SUPERVISOR',
        location: 'Main Gate',
        activeTime: '08:00-16:00',
        status: 'online',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        currentGateId: 'gate-a',
    },
    {
        phone: '+15555550102',
        password: '$2b$10$abcdefghijklmnopqrstuv', // hashed placeholder
        name: 'Jamie Lee',
        role: 'GATEKEEPER',
        location: 'Backstage',
        activeTime: '16:00-00:00',
        status: 'offline',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        currentGateId: 'backstage',
    },
    {
        phone: '+15555550103',
        password: '$2b$10$abcdefghijklmnopqrstuv',
        name: 'Maria Gomez',
        role: 'GATEKEEPER',
        location: 'First Aid Tent',
        activeTime: '10:00-18:00',
        status: 'online',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        currentGateId: 'first-aid',
    },
    {
        phone: '+15555550104',
        password: '$2b$10$abcdefghijklmnopqrstuv',
        name: 'Daniel Park',
        role: 'SECURITY',
        location: 'North Perimeter',
        activeTime: '00:00-08:00',
        status: 'offline',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        currentGateId: 'north-perim',
    },
    {
        phone: '+15555550105',
        password: '$2b$10$abcdefghijklmnopqrstuv',
        name: 'Priya Kumar',
        role: 'SECURITY',
        location: 'Control Room',
        activeTime: '12:00-20:00',
        status: 'online',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        currentGateId: 'control-room',
    },
    {
        phone: '+15555550106',
        password: '$2b$10$abcdefghijklmnopqrstuv',
        name: 'Zoe Martin',
        role: 'SECURITY',
        location: 'Info Booth',
        activeTime: '09:00-15:00',
        status: 'online',
        avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
        currentGateId: 'info-booth',
    },
    {
        phone: '+15555550107',
        password: '$2b$10$abcdefghijklmnopqrstuv',
        name: 'Marcus Brown',
        role: 'SUPERVISOR',
        location: 'Operations Hub',
        activeTime: '14:00-22:00',
        status: 'offline',
        avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
        currentGateId: 'ops-hub',
    },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('MONGO_URI:', MONGO_URI); // Debug: print the connection string
  await User.deleteMany({});
  await User.insertMany(defaultStaff);
  console.log('Seeded default staff members!');
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
