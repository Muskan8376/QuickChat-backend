
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
// import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup a new user 
export const Signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    let newUser = null;

    try {
        if (!fullName || !email || !password) {
            return res.json({ success: false, message: "Missing details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }

// create the new user in the mongodb database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        });


        const token = generateToken(newUser._id);

        // Remove password from response
        const userData = newUser.toObject();
        delete userData.password;

        res.json({
            success: true,
            userData:newUser,
            token,
            message: "Account created successfully"
        });

    } catch (error) {
        console.warn(error)
        console.error(error.message);
        res.json({
            success: false,
// console.log(error.message)
            message: error.message
             || 
             "An error occurred during signup"
        });
    }
};

// login user 


// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.json({ success: false, message: "Email and password are required" });
//         }

//         const userData = await User.findOne({ email });
//         if (!userData) {
//             return res.json({ success: false, message: "Account does not exist" });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, userData.password);
//         if (!isPasswordCorrect) {
//             return res.json({ success: false, message: "Invalid credentials" });
//         }

//         const token = generateToken(userData._id);
//         res.json({ success: true, userData, token, message: "Login successfully" });
//     } catch (error) {
//         console.log(error.message);
//         res.json({ success: false,
//             //  message: error.message 
//             });
//     }
// };

// ✅ Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login request body:", req.body);

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ success: false, message: "Account does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        const userObject = userData.toObject();
        delete userObject.password;

        return res.json({
            success: true,
            userData: userObject,
            token,
            message: "Login successfully"
        });

    } catch (error) {
        console.error("Login error:", error.message);
        return res.json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};


// controller to check of user is authenticated 

export const checkAuth = (req,res)=>{
    console.log(req.user);
    
    res.json({success: false, user: req.user});

}


// controller to update user profile details 

export const updateProfile  = async(req,res)=>{
    try {
        const {profilePic, bio, fullName}=req.body;
        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            // userId
            updatedUser=await User.findByIdAndUpdate(userId,{bio, fullName},{new: true});
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId,{profilePic: upload.secure_url,bio,fullName},{new:true});
        }
        res.json({success: true, user:updatedUser})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message})

        
    }
}


// import cloudinary from "../lib/cloudinary.js";
// import { generateToken } from "../lib/utils.js";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";

// // ✅ Signup a new user
// export const Signup = async (req, res) => {
//     const { fullName, email, password, bio } = req.body;

//     try {
//         if (!fullName || !email || !password || !bio) {
//             return res.json({ success: false, message: "Missing details" });
//         }

//         const user = await User.findOne({ email });
//         if (user) {
//             return res.json({ success: false, message: "Account already exists" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = await User.create({
//             fullName,
//             email,
//             password: hashedPassword,
//             bio
//         });

//         const token = generateToken(newUser._id);

//         const userData = newUser.toObject();
//         delete userData.password;

//         res.json({
//             success: true,
//             userData,
//             token,
//             message: "Account created successfully"
//         });

//     } catch (error) {
//         console.error(error.message);
//         res.json({
//             success: false,
//             message: error.message || "An error occurred during signup"
//         });
//     }
// };

// // ✅ Login user
// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log("Login request body:", req.body);

//         if (!email || !password) {
//             return res.json({ success: false, message: "Email and password are required" });
//         }

//         const userData = await User.findOne({ email });
//         if (!userData) {
//             return res.json({ success: false, message: "Account does not exist" });
//         }

//         const isPasswordCorrect = await bcrypt.compare(password, userData.password);
//         if (!isPasswordCorrect) {
//             return res.json({ success: false, message: "Invalid credentials" });
//         }

//         const token = generateToken(userData._id);

//         const userObject = userData.toObject();
//         delete userObject.password;

//         return res.json({
//             success: true,
//             userData: userObject,
//             token,
//             message: "Login successfully"
//         });

//     } catch (error) {
//         console.error("Login error:", error.message);
//         return res.json({
//             success: false,
//             message: error.message || "Something went wrong"
//         });
//     }
// };

// // ✅ Check if user is authenticated
// export const checkAuth = (req, res) => {
//     console.log(req.user);
//     res.json({ success: true, user: req.user });
// };

// // ✅ Update user profile details
// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePic, bio, fullName } = req.body;
//         const userId = req.user._id;
//         let updatedUser;

//         if (!profilePic) {
//             updatedUser = await User.findByIdAndUpdate(
//                 userId,
//                 { bio, fullName },
//                 { new: true }
//             );
//         } else {
//             const upload = await cloudinary.uploader.upload(profilePic);
//             updatedUser = await User.findByIdAndUpdate(
//                 userId,
//                 { profilePic: upload.secure_url, bio, fullName },
//                 { new: true }
//             );
//         }

//         res.json({ success: true, user: updatedUser });

//     } catch (error) {
//         console.error(error.message);
//         res.json({ success: false, message: error.message });
//     }
// };
