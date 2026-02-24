const pool = require('../db.cjs');

const doctorModel = {
  async findAll() {
    if (!pool) return [];
    try {
      const result = await pool.query(`
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
      return result.rows.map(row => ({
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

  async findById(id) {
    if (!pool) return null;
    try {
      const result = await pool.query(`
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
        WHERE d.id = $1
      `, [id]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
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

  async findByUserId(userId) {
    if (!pool) return null;
    try {
      const result = await pool.query(`
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
        WHERE d.user_id = $1
      `, [userId]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
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

  async create(doctorData) {
    const { user_id, specialization, license_number, consultation_fee } = doctorData;
    if (!pool) throw new Error('Database not configured');
    try {
      const result = await pool.query(
        'INSERT INTO doctors (user_id, specialization, license_number, consultation_fee) VALUES ($1, $2, $3, $4) RETURNING id',
        [user_id, specialization, license_number || `LIC${Date.now()}`, consultation_fee || 100.00]
      );
      return await this.findById(result.rows[0].id);
    } catch (error) {
      throw error;
    }
  },

  async deleteByUserId(userId) {
    if (!pool) throw new Error('Database not configured');
    try {
      await pool.query('DELETE FROM doctors WHERE user_id = $1', [userId]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async count() {
    if (!pool) return 0;
    try {
      const result = await pool.query('SELECT COUNT(*) as count FROM doctors');
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = doctorModel;
