const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Mock data (in-memory storage - resets on each serverless function invocation)
let users = [
  { id: 1, name: 'John Doe', email: 'patient@example.com', role: 'patient', password: 'password123' },
  { id: 2, name: 'Dr. Sarah Smith', email: 'doctor@example.com', role: 'doctor', password: 'password123' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'password123' },
  { id: 4, name: 'Dr. Michael Johnson', email: 'mjohnson@example.com', role: 'doctor', password: 'password123' },
  { id: 5, name: 'Dr. Emily Davis', email: 'edavis@example.com', role: 'doctor', password: 'password123' },
  { id: 6, name: 'Dr. Robert Wilson', email: 'rwilson@example.com', role: 'doctor', password: 'password123' },
  { id: 7, name: 'Dr. Jennifer Brown', email: 'jbrown@example.com', role: 'doctor', password: 'password123' },
  { id: 8, name: 'Dr. David Martinez', email: 'dmartinez@example.com', role: 'doctor', password: 'password123' }
];

let appointments = [];
let doctors = [
  { id: 1, user_id: 2, specialization: 'Cardiology', license_number: 'LIC001', consultation_fee: 150.00, user: { id: 2, name: 'Dr. Sarah Smith', email: 'doctor@example.com', role: 'doctor' } },
  { id: 2, user_id: 4, specialization: 'Pediatrics', license_number: 'LIC002', consultation_fee: 120.00, user: { id: 4, name: 'Dr. Michael Johnson', email: 'mjohnson@example.com', role: 'doctor' } },
  { id: 3, user_id: 5, specialization: 'Dermatology', license_number: 'LIC003', consultation_fee: 130.00, user: { id: 5, name: 'Dr. Emily Davis', email: 'edavis@example.com', role: 'doctor' } },
  { id: 4, user_id: 6, specialization: 'Orthopedics', license_number: 'LIC004', consultation_fee: 180.00, user: { id: 6, name: 'Dr. Robert Wilson', email: 'rwilson@example.com', role: 'doctor' } },
  { id: 5, user_id: 7, specialization: 'Neurology', license_number: 'LIC005', consultation_fee: 200.00, user: { id: 7, name: 'Dr. Jennifer Brown', email: 'jbrown@example.com', role: 'doctor' } },
  { id: 6, user_id: 8, specialization: 'General Medicine', license_number: 'LIC006', consultation_fee: 100.00, user: { id: 8, name: 'Dr. David Martinez', email: 'dmartinez@example.com', role: 'doctor' } }
];

// Health check - handle multiple paths for robustness
app.get('/api/health', (req, res) => {
  console.log('Health check called via /api/health');
  res.json({ status: 'ok', message: 'API serverless function is running' });
});
app.get('/health', (req, res) => {
  console.log('Health check called via /health');
  res.json({ status: 'ok', message: 'API serverless function is running' });
});
app.get('/api', (req, res) => {
  console.log('Health check called via /api');
  res.json({ status: 'ok', message: 'API serverless function is running' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const newUser = { id: users.length + 1, name, email, role: role || 'patient', phone: phone || null, password };
  users.push(newUser);
  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET);
  res.json({ message: 'User registered successfully', user: { ...newUser, password: undefined }, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ message: 'Login successful', token, user: { ...user, password: undefined } });
});

app.post('/api/auth/logout', (req, res) => res.json({ message: 'Successfully logged out' }));

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (user) res.json({ ...user, password: undefined });
    else res.status(401).json({ message: 'User not found' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/appointments', (req, res) => {
  const appointmentsWithDoctors = appointments.map(apt => {
    const doctor = doctors.find(d => d.id === apt.doctor_id);
    return { ...apt, doctor: doctor ? { ...doctor, user: doctor.user } : null };
  });
  res.json({ data: appointmentsWithDoctors });
});

app.post('/api/appointments', (req, res) => {
  const { doctor_id, appointment_date, appointment_time, duration, reason } = req.body;
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = doctors.find(d => d.id === parseInt(doctor_id));
    const patient = users.find(u => u.id === decoded.id);
    const newAppointment = {
      id: appointments.length + 1,
      patient_id: decoded.id,
      doctor_id: parseInt(doctor_id),
      appointment_date,
      appointment_time,
      duration: duration || 30,
      status: 'pending',
      reason,
      created_at: new Date().toISOString(),
      doctor: doctor ? { ...doctor, user: doctor.user } : null,
      patient: patient ? { ...patient, password: undefined } : null
    };
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/doctors', (req, res) => res.json({ data: doctors }));

app.get('/api/appointments/available-slots', (req, res) => {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  res.json({ slots });
});

app.get('/api/patients/appointments', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const patientAppointments = appointments.filter(a => a.patient_id === decoded.id).map(apt => {
      const doctor = doctors.find(d => d.id === apt.doctor_id);
      return { ...apt, doctor: doctor ? { ...doctor, user: doctor.user } : null };
    });
    res.json(patientAppointments);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/patients/medical-records', (req, res) => res.json([]));
app.get('/api/patients/prescriptions', (req, res) => res.json([]));

app.get('/api/doctors/dashboard', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = doctors.find(d => d.user_id === decoded.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const today = new Date().toISOString().split('T')[0];
    const doctorAppointments = appointments.filter(a => a.doctor_id === doctor.id);
    const todayAppointments = doctorAppointments.filter(a => a.appointment_date === today && ['pending', 'confirmed'].includes(a.status)).map(apt => {
      const patient = users.find(u => u.id === apt.patient_id);
      return { ...apt, patient: patient ? { ...patient, password: undefined } : null };
    }).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
    const upcomingAppointments = doctorAppointments.filter(a => a.appointment_date > today && ['pending', 'confirmed'].includes(a.status)).map(apt => {
      const patient = users.find(u => u.id === apt.patient_id);
      return { ...apt, patient: patient ? { ...patient, password: undefined } : null };
    }).sort((a, b) => {
      const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
      return dateCompare !== 0 ? dateCompare : a.appointment_time.localeCompare(b.appointment_time);
    }).slice(0, 10);
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
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/doctors/appointments', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = doctors.find(d => d.user_id === decoded.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const doctorAppointments = appointments.filter(a => a.doctor_id === doctor.id).map(apt => {
      const patient = users.find(u => u.id === apt.patient_id);
      return { ...apt, patient: patient ? { ...patient, password: undefined } : null, doctor: { ...doctor, user: doctor.user } };
    });
    res.json({ data: doctorAppointments });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/doctors/patients/:id', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const doctor = doctors.find(d => d.user_id === decoded.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    const patientId = parseInt(req.params.id);
    const patient = users.find(u => u.id === patientId && u.role === 'patient');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const patientAppointments = appointments.filter(a => a.patient_id === patientId && a.doctor_id === doctor.id).map(apt => ({ ...apt, doctor: { ...doctor, user: doctor.user } })).sort((a, b) => {
      const dateCompare = b.appointment_date.localeCompare(a.appointment_date);
      return dateCompare !== 0 ? dateCompare : b.appointment_time.localeCompare(a.appointment_time);
    });
    res.json({
      patient: { ...patient, password: undefined },
      appointments: patientAppointments,
      medical_records: patientAppointments.filter(a => a.status === 'completed').map((apt, index) => ({
        id: index + 1,
        appointment_id: apt.id,
        diagnosis: apt.reason || 'General consultation',
        notes: `Follow-up appointment on ${apt.appointment_date}`,
        created_at: apt.appointment_date
      })),
      stats: {
        total_appointments: patientAppointments.length,
        completed_appointments: patientAppointments.filter(a => a.status === 'completed').length,
        upcoming_appointments: patientAppointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/admin/dashboard', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const appointmentsWithDetails = appointments.map(apt => {
    const patient = users.find(u => u.id === apt.patient_id);
    const doctor = doctors.find(d => d.id === apt.doctor_id);
    return {
      ...apt,
      patient: patient ? { ...patient, password: undefined } : null,
      doctor: doctor ? { ...doctor, user: doctor.user } : null
    };
  });
  res.json({
    stats: {
      total_users: users.length,
      total_patients: users.filter(u => u.role === 'patient').length,
      total_doctors: doctors.length,
      total_appointments: appointments.length,
      pending_appointments: appointments.filter(a => a.status === 'pending').length,
      confirmed_appointments: appointments.filter(a => a.status === 'confirmed').length,
      completed_appointments: appointments.filter(a => a.status === 'completed').length,
      cancelled_appointments: appointments.filter(a => a.status === 'cancelled').length,
      today_appointments: appointments.filter(a => a.appointment_date === today).length,
      total_revenue: appointments.filter(a => a.status === 'completed').reduce((sum, apt) => {
        const doctor = doctors.find(d => d.id === apt.doctor_id);
        return sum + (doctor?.consultation_fee || 0);
      }, 0)
    },
    recent_appointments: appointmentsWithDetails.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10)
  });
});

app.get('/api/admin/users', (req, res) => {
  let filteredUsers = [...users];
  if (req.query.role) filteredUsers = filteredUsers.filter(u => u.role === req.query.role);
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    filteredUsers = filteredUsers.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  }
  res.json({ data: filteredUsers.map(u => ({ ...u, password: undefined, created_at: u.created_at || new Date().toISOString() })) });
});

app.post('/api/admin/users', (req, res) => {
  const { name, email, password, role, phone, specialization, license_number, consultation_fee } = req.body;
  const newUser = { id: users.length + 1, name, email, password, role: role || 'patient', phone: phone || null, created_at: new Date().toISOString() };
  users.push(newUser);
  if (role === 'doctor') {
    doctors.push({
      id: doctors.length + 1,
      user_id: newUser.id,
      specialization: specialization || 'General Medicine',
      license_number: license_number || `LIC${String(doctors.length + 1).padStart(3, '0')}`,
      consultation_fee: consultation_fee || 100.00,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  }
  res.status(201).json({ ...newUser, password: undefined });
});

app.put('/api/admin/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { name, email, password, role, phone } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  if (role) user.role = role;
  if (phone !== undefined) user.phone = phone;
  res.json({ ...user, password: undefined });
});

app.delete('/api/admin/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(userIndex, 1);
  const doctorIndex = doctors.findIndex(d => d.user_id === userId);
  if (doctorIndex !== -1) doctors.splice(doctorIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

app.get('/api/admin/appointments', (req, res) => {
  let filteredAppointments = [...appointments];
  if (req.query.status) filteredAppointments = filteredAppointments.filter(a => a.status === req.query.status);
  if (req.query.date) filteredAppointments = filteredAppointments.filter(a => a.appointment_date === req.query.date);
  if (req.query.doctor_id) filteredAppointments = filteredAppointments.filter(a => a.doctor_id === parseInt(req.query.doctor_id));
  const appointmentsWithDetails = filteredAppointments.map(apt => {
    const patient = users.find(u => u.id === apt.patient_id);
    const doctor = doctors.find(d => d.id === apt.doctor_id);
    return {
      ...apt,
      patient: patient ? { ...patient, password: undefined } : null,
      doctor: doctor ? { ...doctor, user: doctor.user } : null
    };
  });
  res.json({ data: appointmentsWithDetails });
});

app.get('/api/payments', (req, res) => res.json({ data: [] }));
app.post('/api/payments', (req, res) => res.status(201).json({ message: 'Payment created', status: 'pending' }));

// Vercel serverless function handler
// Vercel automatically routes /api/* to this file when it's in the api/ folder
// When using rewrites, the path handling can vary, so we normalize it
module.exports = (req, res) => {
  // Log incoming request for debugging (visible in Vercel function logs)
  const originalUrl = req.url || req.path || '';
  console.log('Serverless function called:', {
    method: req.method,
    originalUrl: originalUrl,
    path: req.path,
    query: req.query
  });
  
  // Normalize the path
  let normalizedPath = originalUrl;
  
  // Ensure path starts with /
  if (normalizedPath && !normalizedPath.startsWith('/')) {
    normalizedPath = '/' + normalizedPath;
  }
  
  // Handle empty or root path - default to health check
  if (!normalizedPath || normalizedPath === '/') {
    normalizedPath = '/api/health';
  } 
  // If path doesn't start with /api, add it (Vercel might strip it during rewrite)
  else if (!normalizedPath.startsWith('/api')) {
    normalizedPath = '/api' + normalizedPath;
  }
  
  // Update request properties for Express routing
  req.url = normalizedPath;
  req.path = normalizedPath;
  req.originalUrl = req.originalUrl || normalizedPath;
  
  console.log('Normalized path for Express:', normalizedPath);
  
  // Handle the request with Express
  try {
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
