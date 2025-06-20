import express from "express";
import "dotenv/config";
import serverless from 'serverless-http';

import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
// import { error } from "console";
import compression from "compression"
// const compression = require("compression");
// app.use(compression());

// Create Express app and HTTP Server 
const app = express();
const server = http.createServer(app)
app.use(compression());
// console.log(error)

// Initialize socket.io
export const io = new Server(server,{
    cors: {origin : "*"}
})
// store online users 
export const userSocketMap ={};//{ userId : SocketId}

// socket.io connectio handler 
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);
    if(userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", ()=>{
        console.log("user disconnected", userId)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })
})

// middleware Setup
app.use(express.json({limit: "4mb"}))
app.use(cors());

//Routes setup
app.use("/api/status", (req,res)=> res.send("server is live "))
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)



//Connect to MongoDb
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Server is running on the port : " + PORT)
);
// app.listen(PORT,()=>console.log(`Server started at port :${PORT}`));

const handler=serverless(app);
export {handler};
