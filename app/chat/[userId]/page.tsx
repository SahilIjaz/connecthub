// "use client";

// import { useEffect, useState, useRef } from "react";
// import { io, Socket } from "socket.io-client";
// import { useParams, useSearchParams } from "next/navigation";

// let socket: Socket;

// interface Message {
//   sender: string;
//   text: string;
// }

// export default function ChatPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const receiverId = params.userId;
//   const receiverName = searchParams.get("username");

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [message, setMessage] = useState("");
//   const [userId, setUserId] = useState<string>("");

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // Scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       const res = await fetch("/api/auth/me", { credentials: "include" });
//       const data = await res.json();
//       setUserId(data._id);
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     // Connect to socket server
//     socket = io("http://localhost:3001");
//     socket.emit("user-enter", { _id: userId });

//     // Fetch previous messages
//     const fetchMessages = async () => {
//       const res = await fetch(`/api/chat/messages?receiverId=${receiverId}`, {
//         credentials: "include",
//       });
//       const data = await res.json();
//       setMessages(data.messages || []);
//       scrollToBottom();
//     };
//     fetchMessages();

//     // Listen for incoming messages
//     socket.on(
//       "receiveMessage",
//       (msg: { senderId: string; message: string }) => {
//         if (msg.senderId === receiverId || msg.senderId === userId) {
//           setMessages((prev) => [
//             ...prev,
//             { sender: msg.senderId, text: msg.message },
//           ]);
//           scrollToBottom();
//         }
//       }
//     );

//     return () => {
//       socket.disconnect();
//     };
//   }, [userId, receiverId]);

//   const sendMessage = () => {
//     if (!message.trim() || !userId) return;

//     // Emit message to socket server
//     socket.emit("sendMessage", { senderId: userId, receiverId, message });

//     // Update local state
//     setMessages((prev) => [...prev, { sender: userId, text: message }]);
//     setMessage("");
//     scrollToBottom();
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Chat with {receiverName}</h1>

//       <div className="border p-4 h-96 overflow-y-scroll mb-4 flex flex-col gap-2">
//         {messages.map((m, idx) => (
//           <div
//             key={idx}
//             className={`p-2 rounded ${
//               m.sender === userId
//                 ? "bg-blue-500 text-white self-end"
//                 : "bg-gray-200 self-start"
//             }`}
//           >
//             {m.text}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex gap-2">
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           className="flex-1 p-2 border rounded"
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           className="px-4 py-2 bg-green-500 text-white rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useParams, useSearchParams } from "next/navigation";

let socket: Socket;

interface Message {
  sender: string;
  text: string;
}

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const receiverId = params.userId;
  const receiverName = searchParams.get("username");

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setUserId(data._id);
    };
    fetchUser();
  }, []);

  // Setup socket and fetch messages
  useEffect(() => {
    if (!userId) return;

    // Connect to socket
    socket = io("http://localhost:3001");
    socket.emit("user-enter", { _id: userId });

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/chat/messages?receiverId=${receiverId}&userId=${userId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setMessages(
          data.messages?.map((msg: any) => ({
            sender: msg.sender.toString(),
            text: msg.message,
          })) || []
        );
        scrollToBottom();
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();

    // Listen for incoming messages
    socket.on(
      "receiveMessage",
      (msg: { senderId: string; message: string }) => {
        if (msg.senderId === receiverId || msg.senderId === userId) {
          setMessages((prev) => [
            ...prev,
            { sender: msg.senderId, text: msg.message },
          ]);
          scrollToBottom();
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (!message.trim() || !userId) return;

    // Emit message to socket server
    socket.emit("send-message", { senderId: userId, receiverId, message });

    // Update local state
    setMessages((prev) => [...prev, { sender: userId, text: message }]);
    setMessage("");
    scrollToBottom();
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with {receiverName}</h1>

      <div className="border p-4 h-96 overflow-y-scroll mb-4 flex flex-col gap-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              m.sender === userId
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
