// model/cropModel.js
import mongoose, { Schema } from "mongoose";

const cropSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "userstable", required: true },
  cropType: { type: String, required: true },
  landArea: String,
  soilType: String,
  cropGrowingDate: Date,
  expectedHarvestDate: Date,
  // support multiple generated dates
  wateringDates: [Date],
  fertilizerDates: [Date],
});

const Crop = mongoose.model("crops", cropSchema);
export default Crop;
