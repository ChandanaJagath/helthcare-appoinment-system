require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3307,
  multipleStatements: true
};

async function initializeDatabase() {
  let connection;
  
  try {
    // Connect without database first
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Creating database and tables...');
    await connection.query(schema);
    console.log('✅ Database schema created successfully');

    // Connect to the database
    await connection.end();
    connection = await mysql.createConnection({
      ...dbConfig,
      database: process.env.DB_NAME || 'healthcare_db'
    });

    // Seed initial users
    console.log('🌱 Seeding initial data...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Insert users
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

    // Clear existing users (if any)
    await connection.query('DELETE FROM users');
    
    for (const user of users) {
      await connection.query(
        'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
        user
      );
    }
    console.log('✅ Users seeded');

    // Get user IDs for doctors
    const [userRows] = await connection.query('SELECT id, email FROM users WHERE role = ?', ['doctor']);
    
    // Insert doctors
    const doctors = [
      [userRows[0].id, 'Cardiology', 'LIC001', 150.00],
      [userRows[1].id, 'Pediatrics', 'LIC002', 120.00],
      [userRows[2].id, 'Dermatology', 'LIC003', 130.00],
      [userRows[3].id, 'Orthopedics', 'LIC004', 180.00],
      [userRows[4].id, 'Neurology', 'LIC005', 200.00],
      [userRows[5].id, 'General Medicine', 'LIC006', 100.00]
    ];

    await connection.query('DELETE FROM doctors');
    
    for (const doctor of doctors) {
      await connection.query(
        'INSERT INTO doctors (user_id, specialization, license_number, consultation_fee) VALUES (?, ?, ?, ?)',
        doctor
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
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();
