import mongoose from 'mongoose';

const ConversionsSchema = new mongoose.Schema({
    fromUnit: String,
    toUnit: String,
    multiplier: Number
});
    
export default mongoose.models.Conversions || mongoose.model('Conversions', ConversionsSchema);