import mongoose, { Schema, model, models } from "mongoose";

const InterestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // prevent duplicates
      trim: true,
    },
  },
  { timestamps: true }
);

const Interest = models.Interest || model("Interest", InterestSchema);
export default Interest;
