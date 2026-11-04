/**
 * MongoDB Connection Test Script
 * Run: node server/scripts/testConnection.js
 * Tests if the MONGO_URI in .env is reachable
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

console.log('\n🔍 Testing MongoDB Connection...');
console.log(`📡 URI: ${MONGO_URI ? MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'NOT SET!'}`);

if (!MONGO_URI) {
  console.error('\n❌ MONGO_URI is not set in server/.env');
  console.log('\n📝 To fix: Add this to server/.env:');
  console.log('   MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/househunt\n');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 })
  .then(async (conn) => {
    console.log(`\n✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   State: ${conn.connection.readyState === 1 ? 'Connected' : 'Unknown'}`);

    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`\n📦 Collections in '${conn.connection.name}' database:`);
    if (collections.length === 0) {
      console.log('   (empty - no collections yet, seed data to populate)');
    } else {
      for (const col of collections) {
        const count = await conn.connection.db.collection(col.name).countDocuments();
        console.log(`   📄 ${col.name}: ${count} document(s)`);
      }
    }

    console.log('\n🎉 Backend database is connected and ready!\n');
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ MongoDB Connection FAILED!');
    console.error(`   Error: ${err.message}`);
    console.log('\n💡 Possible fixes:');
    console.log('   1. If using local MongoDB: install MongoDB Community Edition');
    console.log('   2. If using Atlas: check your MONGO_URI in server/.env');
    console.log('   3. If using Atlas: whitelist your IP in Network Access\n');
    process.exit(1);
  });
