import mongoose from 'mongoose';

const SafetySchema = new mongoose.Schema({
    title: {
        en: {type: String, required: true, unique: true},
        es: {type: String, required: true, unique: true},
    },
    description: {
        en: String,
        es: String,
    },
    link: String,
    order: Number
});
    
export default mongoose.models.Safety || mongoose.model('Safety', SafetySchema);