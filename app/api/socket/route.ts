// server/socket.ts
import { Server as IOServer, Socket } from "socket.io";
import moment from "moment";
import Message from "@/app/models/message";
import User from "@/app/models/user"; // adjust path
import Chat from "@/app/models/chat"; // adjust path
// import Notification from "@/models/Notification"; // adjust path
// import { sendNotification } from "@/utils/Notifications"; // adjust path

interface ActiveUser {
  userId: string;
  socketId: string;
}

let activeUsers: ActiveUser[] = [];

const getOnlineUsers = (io: IOServer) => {
  io.emit("online-users", {
    status: "success",
    message: "Online users fetched",
    activeUsers,
  });
};

export const setupSocket = (io: IOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("Connected to socket.io:", socket.id);

    socket.on("user-enter", (userData: { _id: string }) => {
      if (!userData) return console.log("UserData not found");

      if (!activeUsers.some((user) => user.userId === userData._id)) {
        activeUsers.push({
          userId: userData._id,
          socketId: socket.id,
        });
      }

      socket.join(userData._id);
      getOnlineUsers(io);
    });

    socket.on("get-online-users", () => {
      getOnlineUsers(io);
    });

    socket.on("get-inboxes", async (userData: { _id: string }) => {
      try {
        let chats = await Chat.find({
          users: { $in: [userData._id] },
        }).sort("-updatedAt");

        chats = JSON.parse(JSON.stringify(chats));

        for (let chat of chats) {
          const messages = await Message.find({
            chat: chat._id,
            receiver: userData._id,
            isSeen: false,
          });
          chat.newMessages = messages.length;

          chat.users.forEach((user: any) => {
            activeUsers.forEach((activeUser) => {
              if (activeUser.userId === user._id.toString()) {
                user.isOnline = true;
              }
            });
          });
        }

        io.to(userData._id).emit("inboxes", {
          status: "success",
          message: "Inboxes fetched successfully",
          inboxes: chats.length ? chats : [],
        });
      } catch (err) {
        console.error("Error fetching inboxes:", err);
      }
    });

    socket.on(
      "send-message",
      async (
        userData: { _id: string; firstName: string },
        to: string,
        message: string
      ) => {
        try {
          const currentUnixTime = moment().unix();
          const receiver = await User.findById(to);
          if (!receiver) return console.log("Receiver not found");

          let chat = await Chat.findOne({
            $and: [{ users: userData._id }, { users: receiver._id }],
          });

          if (!chat) {
            chat = await Chat.create({
              users: [userData._id, receiver._id],
              lastMessageSender: userData._id,
              lastMessage: message,
              messageTime: currentUnixTime,
            });
          } else {
            await Chat.findByIdAndUpdate(chat._id, {
              lastMessageSender: userData._id,
              lastMessage: message,
              messageTime: currentUnixTime,
            });
          }

          const chatId = chat._id.toString();
          const joinedPeopleCount =
            io.sockets.adapter.rooms.get(chatId)?.size || 0;

          const dbMessage = await Message.create({
            chat: chat._id,
            sender: userData._id,
            receiver: receiver._id,
            message,
            messageTime: currentUnixTime,
            isSeen: joinedPeopleCount > 1,
          });

          io.to(userData._id).emit("message-sent", {
            status: "success",
            message: "New message sent successfully",
            isMessageSent: true,
            data: message,
          });

          const messages = await Message.find({
            $and: [
              { $or: [{ sender: userData._id }, { receiver: userData._id }] },
              { $or: [{ sender: receiver._id }, { receiver: receiver._id }] },
            ],
          }).sort({ createdAt: -1 });

          io.to(chatId).emit("messages", {
            status: "success",
            message: "New message retrieved successfully",
            receiver,
            messages,
          });

        //   // Notifications
        //  w aait Notification.create({
        //     notificationType: "new message",
        //     sender: userData._id,
        //     receiver: receiver._id,
        //     title: "New Message Received",
        //     text: `${userData.firstName} sent you a message`,
        //     data: { message },
        //   });

          if (receiver.isNotifications) {
            // await sendNotification({
            //   fcmToken: receiver.fcmToken,
            //   title: "New Message Received",
            //   body: `${userData.firstName} sent you a message`,
            //   notificationData: JSON.stringify(message),
            // });
          }
        } catch (err) {
          console.error("Error sending message:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      getOnlineUsers(io);
      console.log("User disconnected:", socket.id);
    });
  });
};
