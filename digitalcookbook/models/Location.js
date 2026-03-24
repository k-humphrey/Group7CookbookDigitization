import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number,
    address: String,
    hours: String,
    phone: String,
    description: String
});

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);