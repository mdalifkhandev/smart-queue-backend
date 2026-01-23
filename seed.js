const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/modules/user/user.model');
const Staff = require('./src/modules/staff/staff.model');
const Service = require('./src/modules/service/service.model');

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Clearing database...');

        await User.deleteMany({});
        await Staff.deleteMany({});
        await Service.deleteMany({});

        console.log('Creating demo user...');
        await User.create({
            name: 'Demo Admin',
            email: 'demo@example.com',
            password: 'demo123'
        });

        console.log('Creating staff...');
        await Staff.create([
            { name: 'Dr. Farhan', serviceType: 'Doctor', dailyCapacity: 5 },
            { name: 'Riya Gupta', serviceType: 'Consultant', dailyCapacity: 3 },
            { name: 'Sam Wilson', serviceType: 'Therapist', dailyCapacity: 5 }
        ]);

        console.log('Creating services...');
        await Service.create([
            { name: 'Initial Consultation', duration: 30, staffType: 'Doctor' },
            { name: 'Heart Checkup', duration: 60, staffType: 'Doctor' },
            { name: 'Business Strategy', duration: 30, staffType: 'Consultant' },
            { name: 'Physical Therapy', duration: 60, staffType: 'Therapist' }
        ]);

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('--- SEEDING ERROR ---');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
};

seedData();
