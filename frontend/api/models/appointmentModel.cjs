const pool = require('../db.cjs');

function mapAppointmentRow(row) {
  const appointmentTime = row.appointment_time;
  const timeStr = typeof appointmentTime === 'string'
    ? appointmentTime
    : (appointmentTime && appointmentTime.toISOString ? appointmentTime.toISOString().slice(11, 19) : null);
  return {
    id: row.id,
    patient_id: row.patient_id,
    doctor_id: row.doctor_id,
    appointment_date: row.appointment_date,
    appointment_time: timeStr || row.appointment_time,
    duration: row.duration,
    status: row.status,
    reason: row.reason,
    created_at: row.created_at,
    patient: {
      id: row.patient_id_full,
      name: row.patient_name,
      email: row.patient_email,
      role: row.patient_role,
      phone: row.patient_phone
    },
    doctor: {
      id: row.doctor_id_full,
      user_id: row.doctor_user_id,
      specialization: row.specialization,
      license_number: row.license_number,
      consultation_fee: parseFloat(row.consultation_fee),
      user: {
        id: row.doctor_user_id_full,
        name: row.doctor_name,
        email: row.doctor_email,
        role: row.doctor_role
      }
    }
  };
}

const appointmentModel = {
  async findAll(filters = {}) {
    if (!pool) return [];
    try {
      let query = `
        SELECT 
          a.id,
          a.patient_id,
          a.doctor_id,
          a.appointment_date,
          a.appointment_time,
          a.duration,
          a.status,
          a.reason,
          a.created_at,
          p.id as patient_id_full,
          p.name as patient_name,
          p.email as patient_email,
          p.role as patient_role,
          p.phone as patient_phone,
          d.id as doctor_id_full,
          d.user_id as doctor_user_id,
          d.specialization,
          d.license_number,
          d.consultation_fee,
          du.id as doctor_user_id_full,
          du.name as doctor_name,
          du.email as doctor_email,
          du.role as doctor_role
        FROM appointments a
        INNER JOIN users p ON a.patient_id = p.id
        INNER JOIN doctors d ON a.doctor_id = d.id
        INNER JOIN users du ON d.user_id = du.id
        WHERE 1=1
      `;
      const params = [];
      let paramIndex = 1;

      if (filters.status) {
        query += ` AND a.status = $${paramIndex++}`;
        params.push(filters.status);
      }
      if (filters.date) {
        query += ` AND a.appointment_date = $${paramIndex++}`;
        params.push(filters.date);
      }
      if (filters.doctor_id) {
        query += ` AND a.doctor_id = $${paramIndex++}`;
        params.push(filters.doctor_id);
      }
      if (filters.patient_id) {
        query += ` AND a.patient_id = $${paramIndex++}`;
        params.push(filters.patient_id);
      }

      query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

      const result = await pool.query(query, params);
      return result.rows.map(mapAppointmentRow);
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    if (!pool) return null;
    try {
      const result = await pool.query(`
        SELECT 
          a.id,
          a.patient_id,
          a.doctor_id,
          a.appointment_date,
          a.appointment_time,
          a.duration,
          a.status,
          a.reason,
          a.created_at,
          p.id as patient_id_full,
          p.name as patient_name,
          p.email as patient_email,
          p.role as patient_role,
          p.phone as patient_phone,
          d.id as doctor_id_full,
          d.user_id as doctor_user_id,
          d.specialization,
          d.license_number,
          d.consultation_fee,
          du.id as doctor_user_id_full,
          du.name as doctor_name,
          du.email as doctor_email,
          du.role as doctor_role
        FROM appointments a
        INNER JOIN users p ON a.patient_id = p.id
        INNER JOIN doctors d ON a.doctor_id = d.id
        INNER JOIN users du ON d.user_id = du.id
        WHERE a.id = $1
      `, [id]);
      if (result.rows.length === 0) return null;
      return mapAppointmentRow(result.rows[0]);
    } catch (error) {
      throw error;
    }
  },

  async create(appointmentData) {
    const { patient_id, doctor_id, appointment_date, appointment_time, duration, reason } = appointmentData;
    if (!pool) throw new Error('Database not configured');
    try {
      const timeVal = appointment_time && appointment_time.length <= 8 ? appointment_time : `${appointment_time}:00`.slice(0, 8);
      const result = await pool.query(
        'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration, status, reason) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [patient_id, doctor_id, appointment_date, appointment_time || '09:00', duration || 30, 'pending', reason || null]
      );
      return await this.findById(result.rows[0].id);
    } catch (error) {
      throw error;
    }
  },

  async findByDoctorId(doctorId, filters = {}) {
    return await this.findAll({ ...filters, doctor_id: doctorId });
  },

  async findByPatientId(patientId, filters = {}) {
    return await this.findAll({ ...filters, patient_id: patientId });
  },

  async getTotalRevenue() {
    if (!pool) return 0;
    try {
      const result = await pool.query(`
        SELECT COALESCE(SUM(d.consultation_fee), 0)::float as total_revenue
        FROM appointments a
        INNER JOIN doctors d ON a.doctor_id = d.id
        WHERE a.status = 'completed'
      `);
      return parseFloat(result.rows[0].total_revenue) || 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = appointmentModel;
