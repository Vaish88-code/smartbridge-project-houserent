const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  
  console.log('='.repeat(60));
  console.log('  MONGODB CONNECTION DETAILS');
  console.log('='.repeat(60));
  console.log('  Database Name  :', db.databaseName);
  console.log('  Host           :', mongoose.connection.host);
  console.log('  Port           :', mongoose.connection.port);
  console.log('  Connection URI :', process.env.MONGO_URI);
  console.log('  State          :', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
  console.log('='.repeat(60));

  // List all collections
  const collections = await db.listCollections().toArray();
  console.log('\n  COLLECTIONS IN DATABASE:');
  console.log('-'.repeat(60));
  
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`  📁 ${col.name.padEnd(20)} -> ${count} documents`);
  }

  // Show users
  console.log('\n' + '='.repeat(60));
  console.log('  REGISTERED USERS:');
  console.log('-'.repeat(60));
  const users = await db.collection('users').find({}, { 
    projection: { name: 1, email: 1, role: 1, isActive: 1, createdAt: 1 } 
  }).toArray();
  users.forEach(u => {
    console.log(`  👤 ${u.name} | ${u.email} | Role: ${u.role} | Active: ${u.isActive}`);
  });

  // Show properties
  console.log('\n' + '='.repeat(60));
  console.log('  LISTED PROPERTIES:');
  console.log('-'.repeat(60));
  const props = await db.collection('properties').find({}, { 
    projection: { title: 1, city: 1, rent: 1, approvalStatus: 1, isAvailable: 1, propertyType: 1 } 
  }).toArray();
  props.forEach(p => {
    console.log(`  🏠 ${p.title}`);
    console.log(`     City: ${p.city} | Rent: ₹${p.rent} | Type: ${p.propertyType} | Status: ${p.approvalStatus} | Available: ${p.isAvailable}`);
  });

  // Show bookings
  const bookings = await db.collection('bookings').find({}).toArray();
  if (bookings.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('  BOOKINGS:');
    console.log('-'.repeat(60));
    bookings.forEach(b => {
      console.log(`  📋 Booking ID: ${b._id} | Status: ${b.status}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('  ✅ MongoDB backend is fully connected and operational!');
  console.log('='.repeat(60));

  await mongoose.disconnect();
});
