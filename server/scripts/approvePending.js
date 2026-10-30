const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await mongoose.connection.db
    .collection('properties')
    .updateMany(
      { approvalStatus: 'pending' },
      { $set: { approvalStatus: 'approved' } }
    );
  console.log('Updated', result.modifiedCount, 'properties to approved');
  await mongoose.disconnect();
});
