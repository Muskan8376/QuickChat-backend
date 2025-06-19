// middleware to protect router 

import User from "../models/User.js";
import jwt from "jsonwebtoken"

export const  protectRoute = async(req,res,next)=>{
    try {
        const token = req.headers.token;
        

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({success: false , message: "User not found"});
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message)
        res.json({success: false , message: error.message});
        
    }
}
// export default auth;





// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoute = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         // Expecting header: Authorization: Bearer <token>
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return res.status(401).json({ success: false, message: "No token provided" });
//         }

//         const token = authHeader.split(" ")[1];

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId).select("-password");

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("Auth error:", error.message);
//         return res.status(401).json({ success: false, message: "Unauthorized access" });
//     }
// };
// export default protectRoute