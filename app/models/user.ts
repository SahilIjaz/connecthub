
import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // hashed password
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePicture: { type: String, default: "" }, // URL
    interests: [
      { type: Schema.Types.ObjectId, ref: "Interest" } // reference to Interest model
    ],
  },
  { timestamps: true }
);

// Avoid recompiling model on hot reload
const User = models.User || model("User", userSchema);
export default User;
