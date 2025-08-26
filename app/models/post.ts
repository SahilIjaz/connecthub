// import mongoose, { Schema } from "mongoose";

// const PostSchema = new Schema(
//   {
//     text: { type: String, required: true, maxlength: 280 },
//     image: { type: String, default: null },
//     creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Post || mongoose.model("Post", PostSchema);

import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 280 },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    text: { type: String, required: true, maxlength: 280 },
    image: { type: String, default: null },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], // users who liked
    comments: [CommentSchema], // embedded comments
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
