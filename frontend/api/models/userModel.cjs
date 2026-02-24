const pool = require('../db.cjs');
const bcrypt = require('bcrypt');

const userModel = {
  async findByEmail(email) {
    if (!pool) return null;
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    if (!pool) return null;
    try {
      const result = await pool.query(
        'SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  async create(userData) {
    const { name, email, password, role, phone } = userData;
    if (!pool) throw new Error('Database not configured');
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hashedPassword, role || 'patient', phone || null]
      );
      return await this.findById(result.rows[0].id);
    } catch (error) {
      throw error;
    }
  },

  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async findAll(filters = {}) {
    if (!pool) return [];
    try {
      let query = 'SELECT id, name, email, role, phone, created_at FROM users WHERE 1=1';
      const params = [];
      let paramIndex = 1;

      if (filters.role) {
        query += ` AND role = $${paramIndex++}`;
        params.push(filters.role);
      }
      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        query += ` AND (name ILIKE $${paramIndex++} OR email ILIKE $${paramIndex++})`;
        params.push(searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async update(id, userData) {
    const { name, email, password, role, phone } = userData;
    if (!pool) throw new Error('Database not configured');
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      params.push(email);
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramIndex++}`);
      params.push(hashedPassword);
    }
    if (role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      params.push(role);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      params.push(phone);
    }

    if (updates.length === 0) return await this.findById(id);

    params.push(id);
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params
    );
    return await this.findById(id);
  },

  async delete(id) {
    if (!pool) throw new Error('Database not configured');
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  async countByRole(role) {
    if (!pool) return 0;
    try {
      const result = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE role = $1',
        [role]
      );
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      throw error;
    }
  },

  async count() {
    if (!pool) return 0;
    try {
      const result = await pool.query('SELECT COUNT(*) as count FROM users');
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userModel;
