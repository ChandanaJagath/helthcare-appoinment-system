const pool = require('../config/database');

const appointmentModel = {
  // Get all appointments with related data
  async findAll(filters = {}) {
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

      if (filters.status) {
        query += ' AND a.status = ?';
        params.push(filters.status);
      }

      if (filters.date) {
        query += ' AND a.appointment_date = ?';
        params.push(filters.date);
      }

      if (filters.doctor_id) {
        query += ' AND a.doctor_id = ?';
        params.push(filters.doctor_id);
      }

      if (filters.patient_id) {
        query += ' AND a.patient_id = ?';
        params.push(filters.patient_id);
      }

      query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

      const [rows] = await pool.query(query, params);
      
      return rows.map(row => ({
        id: row.id,
        patient_id: row.patient_id,
        doctor_id: row.doctor_id,
        appointment_date: row.appointment_date,
        appointment_time: row.appointment_time,
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
      }));
    } catch (error) {
      throw error;
    }
  },

  // Find appointment by ID
  async findById(id) {
    try {
      const [rows] = await pool.query(`
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
        WHERE a.id = ?
      `, [id]);
      
      if (rows.length === 0) return null;
      
      const row = rows[0];
      return {
        id: row.id,
        patient_id: row.patient_id,
        doctor_id: row.doctor_id,
        appointment_date: row.appointment_date,
        appointment_time: row.appointment_time,
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
    } catch (error) {
      throw error;
    }
  },

  // Create new appointment
  async create(appointmentData) {
    const { patient_id, doctor_id, appointment_date, appointment_time, duration, reason } = appointmentData;
    
    try {
      const [result] = await pool.query(
        'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, duration, status, reason) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [patient_id, doctor_id, appointment_date, appointment_time, duration || 30, 'pending', reason || null]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  },

  // Update appointment
  async update(id, appointmentData) {
    const { appointment_date, appointment_time, duration, status, reason } = appointmentData;
    const updates = [];
    const params = [];

    if (appointment_date !== undefined) {
      updates.push('appointment_date = ?');
      params.push(appointment_date);
    }
    if (appointment_time !== undefined) {
      updates.push('appointment_time = ?');
      params.push(appointment_time);
    }
    if (duration !== undefined) {
      updates.push('duration = ?');
      params.push(duration);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (reason !== undefined) {
      updates.push('reason = ?');
      params.push(reason);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    params.push(id);

    try {
      await pool.query(
        `UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  },

  // Delete appointment
  async delete(id) {
    try {
      await pool.query('DELETE FROM appointments WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get appointments by doctor ID
  async findByDoctorId(doctorId, filters = {}) {
    return await this.findAll({ ...filters, doctor_id: doctorId });
  },

  // Get appointments by patient ID
  async findByPatientId(patientId, filters = {}) {
    return await this.findAll({ ...filters, patient_id: patientId });
  },

  // Get appointments count by status
  async countByStatus(status) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM appointments WHERE status = ?',
        [status]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Get appointments count by date
  async countByDate(date) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM appointments WHERE appointment_date = ?',
        [date]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Get total appointments count
  async count() {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM appointments');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Get total revenue (sum of consultation fees for completed appointments)
  async getTotalRevenue() {
    try {
      const [rows] = await pool.query(`
        SELECT COALESCE(SUM(d.consultation_fee), 0) as total_revenue
        FROM appointments a
        INNER JOIN doctors d ON a.doctor_id = d.id
        WHERE a.status = 'completed'
      `);
      return parseFloat(rows[0].total_revenue) || 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = appointmentModel;
