// models/Chat.ts
import mongoose, { Schema, model, models } from "mongoose";

const chatSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" },
    lastMessageSender: { type: Schema.Types.ObjectId, ref: "User" },
    messageTime: { type: Number }, // store Unix timestamp
  },
  { timestamps: true }
);

const Chat = models.Chat || model("Chat", chatSchema);
export default Chat;
