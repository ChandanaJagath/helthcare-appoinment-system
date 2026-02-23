const pool = require('../config/database');
const bcrypt = require('bcrypt');

const userModel = {
  // Find user by email
  async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  async findById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  async create(userData) {
    const { name, email, password, role, phone } = userData;
    
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'patient', phone || null]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Get all users with optional filters
  async findAll(filters = {}) {
    try {
      let query = 'SELECT id, name, email, role, phone, created_at FROM users WHERE 1=1';
      const params = [];

      if (filters.role) {
        query += ' AND role = ?';
        params.push(filters.role);
      }

      if (filters.search) {
        query += ' AND (name LIKE ? OR email LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC';

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  async update(id, userData) {
    const { name, email, password, role, phone } = userData;
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }
    if (role !== undefined) {
      updates.push('role = ?');
      params.push(role);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    params.push(id);

    try {
      await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  async delete(id) {
    try {
      await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Get user count by role
  async countByRole(role) {
    try {
      const [rows] = await pool.query(
        'SELECT COUNT(*) as count FROM users WHERE role = ?',
        [role]
      );
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Get total user count
  async count() {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userModel;
