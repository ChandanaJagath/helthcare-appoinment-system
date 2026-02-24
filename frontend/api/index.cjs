require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const pool = require('./db.cjs');
const userModel = require('./models/userModel.cjs');
const doctorModel = require('./models/doctorModel.cjs');
const appointmentModel = require('./models/appointmentModel.cjs');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

function dbUnavailable(res) {
  return res.status(503).json({ message: 'Database not configured. Set DATABASE_URL in Vercel.' });
}

// Health check - return 200; optionally verify DB when pool exists
app.get('/api/health', async (req, res) => {
  if (!pool) {
    return res.json({ status: 'ok', message: 'API serverless function is running (no database)' });
  }
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'API serverless function is running', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', message: 'Database connection failed', error: err.message });
  }
});
app.get('/health', async (req, res) => {
  if (!pool) return res.json({ status: 'ok', message: 'API serverless function is running (no database)' });
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'API serverless function is running', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', message: 'Database connection failed', error: err.message });
  }
});
app.get('/api', (req, res) => res.json({ status: 'ok', message: 'API serverless function is running' }));

// Auth
app.post('/api/auth/register', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const { name, email, password, role, phone } = req.body;
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const newUser = await userModel.create({ name, email, password, role, phone });
    if (role === 'doctor') {
      await doctorModel.create({
        user_id: newUser.id,
        specialization: req.body.specialization || 'General Medicine',
        license_number: req.body.license_number || `LIC${Date.now()}`,
        consultation_fee: req.body.consultation_fee || 100.00
      });
    }
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET);
    res.json({ message: 'User registered successfully', user: newUser, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const { email, password } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isValid = await userModel.verifyPassword(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    const userWithoutPassword = await userModel.findById(user.id);
    res.json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => res.json({ message: 'Successfully logged out' }));

app.get('/api/auth/me', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (user) res.json(user);
    else res.status(401).json({ message: 'User not found' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Appointments
app.get('/api/appointments', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const data = await appointmentModel.findAll();
    res.json({ data });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const { doctor_id, appointment_date, appointment_time, duration, reason } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const newAppointment = await appointmentModel.create({
      patient_id: decoded.id,
      doctor_id: parseInt(doctor_id),
      appointment_date,
      appointment_time,
      duration,
      reason
    });
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    if (error.message && error.message.includes('token')) res.status(401).json({ message: 'Invalid token' });
    else res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
});

// Doctors
app.get('/api/doctors', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const data = await doctorModel.findAll();
    res.json({ data });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
});

app.get('/api/appointments/available-slots', (req, res) => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  res.json({ slots });
});

// Patient routes
app.get('/api/patients/appointments', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const patientAppointments = await appointmentModel.findByPatientId(decoded.id);
    res.json(patientAppointments);
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/patients/medical-records', (req, res) => res.json([]));
app.get('/api/patients/prescriptions', (req, res) => res.json([]));

// Doctor routes
app.get('/api/doctors/dashboard', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = await doctorModel.findByUserId(decoded.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const today = new Date().toISOString().split('T')[0];
    const doctorAppointments = await appointmentModel.findByDoctorId(doctor.id);
    const todayAppointments = doctorAppointments
      .filter(a => a.appointment_date === today && ['pending', 'confirmed'].includes(a.status))
      .sort((a, b) => String(a.appointment_time).localeCompare(String(b.appointment_time)));
    const upcomingAppointments = doctorAppointments
      .filter(a => a.appointment_date > today && ['pending', 'confirmed'].includes(a.status))
      .sort((a, b) => {
        const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
        return dateCompare !== 0 ? dateCompare : String(a.appointment_time).localeCompare(String(b.appointment_time));
      })
      .slice(0, 10);
    const uniquePatients = new Set(doctorAppointments.map(a => a.patient_id));
    res.json({
      stats: {
        today_count: todayAppointments.length,
        upcoming_count: doctorAppointments.filter(a => a.appointment_date > today && ['pending', 'confirmed'].includes(a.status)).length,
        completed_count: doctorAppointments.filter(a => a.status === 'completed').length,
        pending_count: doctorAppointments.filter(a => a.status === 'pending').length,
        confirmed_count: doctorAppointments.filter(a => a.status === 'confirmed').length,
        cancelled_count: doctorAppointments.filter(a => a.status === 'cancelled').length,
        total_appointments: doctorAppointments.length,
        total_patients: uniquePatients.size
      },
      today_appointments: todayAppointments,
      upcoming_appointments: upcomingAppointments,
      recent_patients: []
    });
  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/doctors/appointments', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = await doctorModel.findByUserId(decoded.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const data = await appointmentModel.findByDoctorId(doctor.id);
    res.json({ data });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/doctors/patients/:id', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthenticated' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = await doctorModel.findByUserId(decoded.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const patientId = parseInt(req.params.id);
    const patient = await userModel.findById(patientId);
    if (!patient || patient.role !== 'patient') return res.status(404).json({ message: 'Patient not found' });
    const allAppointments = await appointmentModel.findByDoctorId(doctor.id);
    const patientAppointments = allAppointments
      .filter(a => a.patient_id === patientId)
      .sort((a, b) => {
        const dateCompare = b.appointment_date.localeCompare(a.appointment_date);
        return dateCompare !== 0 ? dateCompare : String(b.appointment_time).localeCompare(String(a.appointment_time));
      });
    const medicalRecords = patientAppointments
      .filter(a => a.status === 'completed')
      .map((apt, index) => ({
        id: index + 1,
        appointment_id: apt.id,
        diagnosis: apt.reason || 'General consultation',
        notes: `Follow-up appointment on ${apt.appointment_date}`,
        created_at: apt.appointment_date
      }));
    res.json({
      patient,
      appointments: patientAppointments,
      medical_records: medicalRecords,
      stats: {
        total_appointments: patientAppointments.length,
        completed_appointments: patientAppointments.filter(a => a.status === 'completed').length,
        upcoming_appointments: patientAppointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length
      }
    });
  } catch (error) {
    console.error('Get patient details error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Admin routes
app.get('/api/admin/dashboard', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const today = new Date().toISOString().split('T')[0];
    const appointments = await appointmentModel.findAll();
    const totalUsers = await userModel.count();
    const totalPatients = await userModel.countByRole('patient');
    const totalDoctors = await doctorModel.count();
    const totalRevenue = await appointmentModel.getTotalRevenue();
    const recentAppointments = [...appointments]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);
    res.json({
      stats: {
        total_users: totalUsers,
        total_patients: totalPatients,
        total_doctors: totalDoctors,
        total_appointments: appointments.length,
        pending_appointments: appointments.filter(a => a.status === 'pending').length,
        confirmed_appointments: appointments.filter(a => a.status === 'confirmed').length,
        completed_appointments: appointments.filter(a => a.status === 'completed').length,
        cancelled_appointments: appointments.filter(a => a.status === 'cancelled').length,
        today_appointments: appointments.filter(a => a.appointment_date === today).length,
        total_revenue: totalRevenue
      },
      recent_appointments: recentAppointments
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
});

app.get('/api/admin/users', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const filters = { role: req.query.role, search: req.query.search };
    const data = await userModel.findAll(filters);
    res.json({ data });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

app.post('/api/admin/users', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const { name, email, password, role, phone, specialization, license_number, consultation_fee } = req.body;
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });
    const newUser = await userModel.create({ name, email, password, role, phone });
    if (role === 'doctor') {
      await doctorModel.create({
        user_id: newUser.id,
        specialization: specialization || 'General Medicine',
        license_number: license_number || `LIC${Date.now()}`,
        consultation_fee: consultation_fee || 100.00
      });
    }
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

app.put('/api/admin/users/:id', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const userId = parseInt(req.params.id);
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const updatedUser = await userModel.update(userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    console.error('Update admin user error:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const userId = parseInt(req.params.id);
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await doctorModel.deleteByUserId(userId);
    await userModel.delete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete admin user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

app.get('/api/admin/appointments', async (req, res) => {
  if (!pool) return dbUnavailable(res);
  try {
    const filters = {
      status: req.query.status,
      date: req.query.date,
      doctor_id: req.query.doctor_id ? parseInt(req.query.doctor_id) : undefined
    };
    const data = await appointmentModel.findAll(filters);
    res.json({ data });
  } catch (error) {
    console.error('Get admin appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

app.get('/api/payments', (req, res) => res.json({ data: [] }));
app.post('/api/payments', (req, res) => res.status(201).json({ message: 'Payment created', status: 'pending' }));

// Vercel serverless function handler
module.exports = (req, res) => {
  const originalUrl = req.url || req.path || '';
  console.log('Serverless function called:', { method: req.method, originalUrl, path: req.path, query: req.query });

  let normalizedPath = originalUrl;
  if (normalizedPath && !normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;
  if (!normalizedPath || normalizedPath === '/') normalizedPath = '/api/health';
  else if (!normalizedPath.startsWith('/api')) normalizedPath = '/api' + normalizedPath;

  req.url = normalizedPath;
  req.path = normalizedPath;
  req.originalUrl = req.originalUrl || normalizedPath;

  try {
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
