import mongoose from 'mongoose';

const ResourcesSchema = new mongoose.Schema({
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
    
export default mongoose.models.Resources || mongoose.model('Resources', ResourcesSchema);