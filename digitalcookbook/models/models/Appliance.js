import mongoose from 'mongoose';

const ApplianceSchema = new mongoose.Schema({
    en: String,
    es: String,
});
    
export default mongoose.models.Appliance || mongoose.model('Appliance', ApplianceSchema);