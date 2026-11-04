const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;

console.log('\n🔍 Testing MongoDB Atlas Connection...');
console.log('📡 URI: ' + (MONGO_URI ? MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'NOT SET!'));
console.log('🌐 Using Google DNS (8.8.8.8) to resolve Atlas hostname...\n');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 })
  .then(async function(conn) {
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log('   Host: ' + conn.connection.host);
    console.log('   Database: ' + conn.connection.name);
    console.log('   Port: ' + conn.connection.port);
    console.log('   State: Connected ✅');

    var collections = await conn.connection.db.listCollections().toArray();
    console.log('\n📦 Collections in [' + conn.connection.name + '] database:');
    if (collections.length === 0) {
      console.log('   (empty - will seed data next)');
    } else {
      for (var i = 0; i < collections.length; i++) {
        var col = collections[i];
        var count = await conn.connection.db.collection(col.name).countDocuments();
        console.log('   📄 ' + col.name + ': ' + count + ' document(s)');
      }
    }

    console.log('\n🎉 Backend is LIVE on MongoDB Atlas!\n');
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(function(err) {
    console.error('❌ MongoDB Atlas Connection FAILED!');
    console.error('   Error: ' + err.message);
    process.exit(1);
  });
