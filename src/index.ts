import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Routes
import userRoutes from './modules/user/user.routes';
import staffRoutes from './modules/staff/staff.routes';
import serviceRoutes from './modules/service/service.routes';
import appointmentRoutes from './modules/appointment/appointment.routes';
import auditLogRoutes from './modules/auditLog/auditLog.routes';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/logs', auditLogRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
