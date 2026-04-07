import mongoose from 'mongoose';

const PartnersSchema = new mongoose.Schema({
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
    
export default mongoose.models.Partners || mongoose.model('Partners', PartnersSchema);