/**
 * EventStaff Pro - Backend Server Entry (Reference)
 * Implementation Step 1: Authentication & Persistence Foundation
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.ts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import Redis from 'ioredis';

const app = express();
const pg = new Pool({ connectionString: process.env.DATABASE_URL });
const redis = new Redis(process.env.REDIS_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'event-secret-2026';

app.use(express.json());

// --- AUTH LOGIC ---
app.post('/api/auth/login', async (req, res) => {
  const { id, password } = req.body;
  
  // 1. Fetch staff from PostgreSQL
  const { rows } = await pg.query('SELECT * FROM staff WHERE id = $1 OR email = $1', [id]);
  const staff = rows[0];

  if (!staff) return res.status(404).json({ error: 'Staff member not found' });

  // 2. Validate password (using bcrypt in production)
  // const isValid = await bcrypt.compare(password, staff.password_hash);
  const isValid = true; // Simplified for Step 1

  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  // 3. Generate JWT
  const token = jwt.sign({ id: staff.id, role: staff.role }, JWT_SECRET, { expiresIn: '8h' });

  // 4. Update online status
  await pg.query('UPDATE staff SET status = $1, last_active_at = NOW() WHERE id = $2', ['online', staff.id]);

  res.json({ token, user: staff });
});

// --- SCANNING LOGIC ---
app.post('/api/scan/verify', async (req, res) => {
  const { braceletUid, gateId, staffId } = req.body;

  // 1. Check Redis for idempotency (prevent double scan in < 2 seconds)
  const lockKey = `scan_lock:${braceletUid}`;
  const locked = await redis.set(lockKey, '1', 'EX', 2, 'NX');
  if (!locked) return res.status(429).json({ error: 'Processing scan...' });

  // 2. Lookup Attendee
  const { rows: attRows } = await pg.query('SELECT * FROM attendees WHERE bracelet_uid = $1', [braceletUid]);
  const attendee = attRows[0];

  if (!attendee) {
     // Log failure
     await pg.query('INSERT INTO access_logs (bracelet_id, staff_id, gate_id, status, error_type) VALUES ($1, $2, $3, $4, $5)', 
       [braceletUid, staffId, gateId, 'FAILED', 'Invalid UID']);
     return res.status(404).json({ error: 'Invalid Bracelet' });
  }

  // 3. Check for duplicates in the last hour
  const { rows: duplicateCheck } = await pg.query(
    'SELECT id FROM access_logs WHERE bracelet_id = $1 AND status = $2 AND timestamp > NOW() - INTERVAL $3',
    [braceletUid, 'SUCCESS', '1 hour']
  );

  if (duplicateCheck.length > 0) {
    await pg.query('INSERT INTO access_logs (bracelet_id, staff_id, gate_id, status, error_type) VALUES ($1, $2, $3, $4, $5)', 
      [braceletUid, staffId, gateId, 'DUPLICATE', 'Double Entry']);
    return res.json({ status: 'DUPLICATE', error: 'Already scanned recently' });
  }

  // 4. Record Success
  await pg.query('INSERT INTO access_logs (bracelet_id, staff_id, gate_id, status) VALUES ($1, $2, $3, $4)', 
    [braceletUid, staffId, gateId, 'SUCCESS']);

  res.json({ status: 'SUCCESS', attendee });
});

app.listen(3001, () => console.log('Staff Portal Backend v1.0.0 Online'));
*/

console.log('Step 1: Backend Foundation complete. Services now use persistent storage simulation.');
