const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Property = require('../models/Property');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sampleProperties = [
  {
    title: 'Luxury 3BHK Apartment in Koregaon Park',
    description: 'Spacious fully furnished 3BHK apartment in the heart of Koregaon Park, Pune. Features modern interiors, marble flooring, modular kitchen, and stunning city views. Close to restaurants, cafes, and shopping centers. Ideal for families looking for a premium living experience.',
    propertyType: 'Apartment',
    rent: 45000,
    deposit: 100000,
    address: '42, North Main Road, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    furnishing: 'Furnished',
    amenities: ['Parking', 'Wi-Fi', 'Air Conditioning', 'Water Supply', 'Power Backup', 'Security', 'Lift', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
    availableFrom: new Date('2026-11-01'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543210',
  },
  {
    title: 'Modern Studio Apartment in Hinjewadi',
    description: 'Compact and stylish studio apartment in Hinjewadi IT Park vicinity. Perfect for working professionals. Features a kitchenette, modern bathroom, and dedicated workspace. Walking distance to Phase 1 IT companies and metro station.',
    propertyType: 'Studio',
    rent: 15000,
    deposit: 30000,
    address: '15, Hinjewadi Phase 1, Near Rajiv Gandhi Infotech Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411057',
    bedrooms: 0,
    bathrooms: 1,
    area: 450,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi', 'Water Supply', 'Power Backup', 'Security', 'Lift'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    availableFrom: new Date('2026-11-15'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543211',
  },
  {
    title: 'Spacious Independent House in Baner',
    description: 'Beautiful independent house with a private garden in Baner. This 4BHK property features a large living room, separate dining area, modern kitchen, and ample parking space. Located in a quiet residential area with easy access to the highway.',
    propertyType: 'Independent House',
    rent: 55000,
    deposit: 150000,
    address: '88, Baner Road, Near Orchid School',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    furnishing: 'Semi-Furnished',
    amenities: ['Parking', 'Water Supply', 'Power Backup', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
    availableFrom: new Date('2026-12-01'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543212',
  },
  {
    title: 'Sea View 2BHK in Andheri West',
    description: 'Premium 2BHK apartment with breathtaking sea views in Andheri West, Mumbai. Features Italian marble flooring, designer bathroom fittings, and a large balcony. Excellent connectivity via metro and Western Express Highway. Near DN Nagar metro station.',
    propertyType: 'Apartment',
    rent: 65000,
    deposit: 200000,
    address: '7th Floor, Sea Breeze Tower, Versova',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    furnishing: 'Furnished',
    amenities: ['Parking', 'Wi-Fi', 'Air Conditioning', 'Water Supply', 'Power Backup', 'Security', 'Lift', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    availableFrom: new Date('2026-11-01'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543213',
  },
  {
    title: 'Affordable PG in Powai',
    description: 'Well-maintained PG accommodation in Powai near IIT Bombay campus. Shared rooms with individual beds, lockers, and study desks. Includes meals, laundry service, and high-speed Wi-Fi. Perfect for students and young professionals.',
    propertyType: 'PG / Hostel',
    rent: 8000,
    deposit: 16000,
    address: '23, Hiranandani Gardens, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    bedrooms: 1,
    bathrooms: 1,
    area: 200,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi', 'Water Supply', 'Security'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'],
    availableFrom: new Date('2026-11-01'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543214',
  },
  {
    title: 'Premium Villa in Whitefield',
    description: 'Luxurious 5BHK villa in the prestigious Whitefield area of Bangalore. Features a private swimming pool, landscaped garden, home theatre, and smart home automation. Located in a gated community with 24/7 security and clubhouse access.',
    propertyType: 'Villa',
    rent: 120000,
    deposit: 500000,
    address: '12, Palm Meadows, Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    bedrooms: 5,
    bathrooms: 4,
    area: 4000,
    furnishing: 'Furnished',
    amenities: ['Parking', 'Wi-Fi', 'Air Conditioning', 'Water Supply', 'Power Backup', 'Security', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    availableFrom: new Date('2026-12-01'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543215',
  },
  {
    title: 'Cozy 2BHK Near Electronic City',
    description: 'Well-maintained 2BHK apartment near Electronic City Phase 1. Semi-furnished with wardrobes, geysers, and fans in all rooms. Walking distance to bus stops and close to Infosys and Wipro campuses. Ideal for IT professionals.',
    propertyType: 'Apartment',
    rent: 22000,
    deposit: 50000,
    address: '56, Neeladri Road, Electronic City Phase 1',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    furnishing: 'Semi-Furnished',
    amenities: ['Parking', 'Water Supply', 'Power Backup', 'Security', 'Lift'],
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
    availableFrom: new Date('2026-11-15'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543216',
  },
  {
    title: 'Modern 3BHK in HITEC City',
    description: 'Contemporary 3BHK apartment in HITEC City, the IT hub of Hyderabad. Features open-plan living, modular kitchen with appliances, and scenic balcony views. Located near major tech parks, shopping malls, and the Hyderabad Metro station.',
    propertyType: 'Apartment',
    rent: 35000,
    deposit: 80000,
    address: '14, Cyber Towers Road, HITEC City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    furnishing: 'Furnished',
    amenities: ['Parking', 'Wi-Fi', 'Air Conditioning', 'Water Supply', 'Power Backup', 'Security', 'Lift', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80'],
    availableFrom: new Date('2026-11-01'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543217',
  },
  {
    title: 'Budget-Friendly 1BHK in Gachibowli',
    description: 'Neat and affordable 1BHK apartment in Gachibowli. Unfurnished with fresh paint, new bathroom fittings, and 24-hour water supply. Close to ISB, University of Hyderabad, and Financial District. Great for bachelors and couples.',
    propertyType: 'Apartment',
    rent: 12000,
    deposit: 25000,
    address: '9, Gachibowli Main Road, Near Biodiversity Park',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    furnishing: 'Unfurnished',
    amenities: ['Water Supply', 'Power Backup', 'Security'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80'],
    availableFrom: new Date('2026-11-10'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543218',
  },
  {
    title: 'Independent House in Tarabai Park',
    description: 'Well-built independent 3BHK house in the prime location of Tarabai Park, Kolhapur. Features a large courtyard, traditional architecture with modern amenities, and a separate servant quarter. Walking distance to Rankala Lake and Mahalaxmi Temple.',
    propertyType: 'Independent House',
    rent: 20000,
    deposit: 50000,
    address: '33, Tarabai Park, Near Rankala Lake',
    city: 'Kolhapur',
    state: 'Maharashtra',
    pincode: '416003',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    furnishing: 'Semi-Furnished',
    amenities: ['Parking', 'Water Supply', 'Power Backup', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
    availableFrom: new Date('2026-11-01'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543219',
  },
  {
    title: 'Furnished Studio Near Kolhapur Station',
    description: 'Compact furnished studio apartment near Kolhapur railway station. Ideal for students and working professionals. Includes a bed, wardrobe, study table, and kitchenette. Close to bus stand, markets, and restaurants.',
    propertyType: 'Studio',
    rent: 7000,
    deposit: 14000,
    address: '5, Station Road, Near Kolhapur Railway Station',
    city: 'Kolhapur',
    state: 'Maharashtra',
    pincode: '416001',
    bedrooms: 0,
    bathrooms: 1,
    area: 300,
    furnishing: 'Furnished',
    amenities: ['Wi-Fi', 'Water Supply'],
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    availableFrom: new Date('2026-11-05'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543220',
  },
  {
    title: 'Elegant 2BHK in Indiranagar',
    description: 'Beautifully designed 2BHK apartment in the vibrant Indiranagar locality of Bangalore. Features wooden flooring, French windows, and a balcony with garden view. Walking distance to 100 Feet Road, trendy cafes, boutiques, and Indiranagar metro station.',
    propertyType: 'Apartment',
    rent: 40000,
    deposit: 100000,
    address: '18, 12th Main Road, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    furnishing: 'Furnished',
    amenities: ['Parking', 'Wi-Fi', 'Air Conditioning', 'Water Supply', 'Power Backup', 'Lift', 'Balcony'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    availableFrom: new Date('2026-11-20'),
    approvalStatus: 'approved',
    isAvailable: true,
    contactNumber: '9876543221',
  },
];

const seedProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create a demo owner
    let demoOwner = await User.findOne({ email: 'demo@househunt.com' });

    if (!demoOwner) {
      demoOwner = await User.create({
        name: 'Demo Property Owner',
        email: 'demo@househunt.com',
        phone: '9876543210',
        password: 'Demo@12345',
        role: 'user',
        isActive: true,
      });
      console.log('✅ Demo owner account created (email: demo@househunt.com, password: Demo@12345)');
    } else {
      console.log('ℹ️  Demo owner already exists');
    }

    // Check existing properties count
    const existingCount = await Property.countDocuments();
    if (existingCount >= 12) {
      console.log(`ℹ️  Database already has ${existingCount} properties. Skipping seed.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Clear existing seed data if partial
    if (existingCount > 0) {
      await Property.deleteMany({ owner: demoOwner._id });
      console.log('🗑️  Cleared existing demo properties');
    }

    // Add owner to each property
    const propertiesWithOwner = sampleProperties.map((p) => ({
      ...p,
      owner: demoOwner._id,
    }));

    await Property.insertMany(propertiesWithOwner);
    console.log(`✅ ${sampleProperties.length} sample properties seeded successfully!`);

    // Display summary
    const cities = [...new Set(sampleProperties.map((p) => p.city))];
    console.log(`   Cities: ${cities.join(', ')}`);
    console.log(`   Property types: ${[...new Set(sampleProperties.map((p) => p.propertyType))].join(', ')}`);
    console.log(`   Rent range: ₹${Math.min(...sampleProperties.map((p) => p.rent))} - ₹${Math.max(...sampleProperties.map((p) => p.rent))}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error.message);
    process.exit(1);
  }
};

seedProperties();
