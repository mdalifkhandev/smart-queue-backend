import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
    appointmentDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show', 'Waiting'],
        default: 'Scheduled'
    },
    queuePosition: { type: Number, default: null }, // Only for status: 'Waiting'
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
