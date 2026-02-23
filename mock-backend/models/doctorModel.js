const pool = require('../config/database');

const doctorModel = {
  // Get all doctors with user information
  async findAll() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          d.id,
          d.user_id,
          d.specialization,
          d.license_number,
          d.consultation_fee,
          d.created_at,
          u.id as user_id_full,
          u.name,
          u.email,
          u.role,
          u.phone
        FROM doctors d
        INNER JOIN users u ON d.user_id = u.id
        ORDER BY d.id
      `);
      
      return rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        specialization: row.specialization,
        license_number: row.license_number,
        consultation_fee: parseFloat(row.consultation_fee),
        created_at: row.created_at,
        user: {
          id: row.user_id_full,
          name: row.name,
          email: row.email,
          role: row.role,
          phone: row.phone
        }
      }));
    } catch (error) {
      throw error;
    }
  },

  // Find doctor by ID with user information
  async findById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          d.id,
          d.user_id,
          d.specialization,
          d.license_number,
          d.consultation_fee,
          d.created_at,
          u.id as user_id_full,
          u.name,
          u.email,
          u.role,
          u.phone
        FROM doctors d
        INNER JOIN users u ON d.user_id = u.id
        WHERE d.id = ?
      `, [id]);
      
      if (rows.length === 0) return null;
      
      const row = rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        specialization: row.specialization,
        license_number: row.license_number,
        consultation_fee: parseFloat(row.consultation_fee),
        created_at: row.created_at,
        user: {
          id: row.user_id_full,
          name: row.name,
          email: row.email,
          role: row.role,
          phone: row.phone
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Find doctor by user_id
  async findByUserId(userId) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          d.id,
          d.user_id,
          d.specialization,
          d.license_number,
          d.consultation_fee,
          d.created_at,
          u.id as user_id_full,
          u.name,
          u.email,
          u.role,
          u.phone
        FROM doctors d
        INNER JOIN users u ON d.user_id = u.id
        WHERE d.user_id = ?
      `, [userId]);
      
      if (rows.length === 0) return null;
      
      const row = rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        specialization: row.specialization,
        license_number: row.license_number,
        consultation_fee: parseFloat(row.consultation_fee),
        created_at: row.created_at,
        user: {
          id: row.user_id_full,
          name: row.name,
          email: row.email,
          role: row.role,
          phone: row.phone
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Create new doctor
  async create(doctorData) {
    const { user_id, specialization, license_number, consultation_fee } = doctorData;
    
    try {
      const [result] = await pool.query(
        'INSERT INTO doctors (user_id, specialization, license_number, consultation_fee) VALUES (?, ?, ?, ?)',
        [user_id, specialization, license_number || `LIC${Date.now()}`, consultation_fee || 100.00]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  },

  // Update doctor
  async update(id, doctorData) {
    const { specialization, license_number, consultation_fee } = doctorData;
    const updates = [];
    const params = [];

    if (specialization !== undefined) {
      updates.push('specialization = ?');
      params.push(specialization);
    }
    if (license_number !== undefined) {
      updates.push('license_number = ?');
      params.push(license_number);
    }
    if (consultation_fee !== undefined) {
      updates.push('consultation_fee = ?');
      params.push(consultation_fee);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    params.push(id);

    try {
      await pool.query(
        `UPDATE doctors SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  },

  // Delete doctor
  async delete(id) {
    try {
      await pool.query('DELETE FROM doctors WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Delete doctor by user_id
  async deleteByUserId(userId) {
    try {
      await pool.query('DELETE FROM doctors WHERE user_id = ?', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get doctor count
  async count() {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM doctors');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = doctorModel;
