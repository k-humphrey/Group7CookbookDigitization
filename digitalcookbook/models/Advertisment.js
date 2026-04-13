import mongoose from 'mongoose';

const AdvertismentSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    imageURI: String,
    public_id: String,
    link: String
});
    
export default mongoose.models.Advertisment || mongoose.model('Advertisment', AdvertismentSchema);