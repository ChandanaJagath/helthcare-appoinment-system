require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('✅ Connected to PostgreSQL');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('📝 Creating tables...');

    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    for (const stmt of statements) {
      await client.query(stmt);
    }
    console.log('✅ Database schema created successfully');

    console.log('🌱 Seeding initial data...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      ['John Doe', 'patient@example.com', hashedPassword, 'patient', null],
      ['Dr. Sarah Smith', 'doctor@example.com', hashedPassword, 'doctor', null],
      ['Admin User', 'admin@example.com', hashedPassword, 'admin', null],
      ['Dr. Michael Johnson', 'mjohnson@example.com', hashedPassword, 'doctor', null],
      ['Dr. Emily Davis', 'edavis@example.com', hashedPassword, 'doctor', null],
      ['Dr. Robert Wilson', 'rwilson@example.com', hashedPassword, 'doctor', null],
      ['Dr. Jennifer Brown', 'jbrown@example.com', hashedPassword, 'doctor', null],
      ['Dr. David Martinez', 'dmartinez@example.com', hashedPassword, 'doctor', null]
    ];

    await client.query('DELETE FROM appointments');
    await client.query('DELETE FROM doctors');
    await client.query('DELETE FROM users');

    for (const u of users) {
      await client.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5)',
        u
      );
    }
    console.log('✅ Users seeded');

    const docRows = await client.query("SELECT id FROM users WHERE role = 'doctor' ORDER BY id");
    const doctors = [
      [docRows.rows[0].id, 'Cardiology', 'LIC001', 150.00],
      [docRows.rows[1].id, 'Pediatrics', 'LIC002', 120.00],
      [docRows.rows[2].id, 'Dermatology', 'LIC003', 130.00],
      [docRows.rows[3].id, 'Orthopedics', 'LIC004', 180.00],
      [docRows.rows[4].id, 'Neurology', 'LIC005', 200.00],
      [docRows.rows[5].id, 'General Medicine', 'LIC006', 100.00]
    ];

    for (const d of doctors) {
      await client.query(
        'INSERT INTO doctors (user_id, specialization, license_number, consultation_fee) VALUES ($1, $2, $3, $4)',
        d
      );
    }
    console.log('✅ Doctors seeded');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\nTest credentials:');
    console.log('Patient: patient@example.com / password123');
    console.log('Doctor: doctor@example.com / password123');
    console.log('Admin: admin@example.com / password123');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initializeDatabase();
