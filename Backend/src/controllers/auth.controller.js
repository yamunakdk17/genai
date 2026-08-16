const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @name registerUserController
 * @description Register a new user
 * @access Public
 */

async function registerUserController(req, res) {
    try {

        const { username, email, password } = req.body;
        console.log(req.body);


        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash,
        });
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

       
      

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
}

/**
 * LOGIN USER
 */

// async function loginUserController(req, res) {
//     try {
//         const { email, password } = req.body;

//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.status(400).json({
//                 message: "Invalid email or password",
//             });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(400).json({
//                 message: "Invalid email or password",
//             });
//         }

//         const token = jwt.sign(
//             { id: user._id, username: user.username },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         res.cookie("token", token,{
//             httpOnly: true,
//             secure: false, // true only in production (HTTPS)
//             sameSite: "lax",   
//         });

//         res.status(200).json({
//             message: "User logged in successfully",
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//             },
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// }

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        console.log("Email entered:", email);

        const user = await userModel.findOne({ email });

        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });

        console.log("TOKEN CREATED:", token);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
}




const tokenBlacklistModel = require("../models/blacklist.model");
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token;
        console.log("COOKIE DATA:", req.cookies);
        console.log("TOKEN:",token);

        if (!token) {
            return res.status(400).json({
                message: "No token found in cookies"
            });
        } 
         const savedToken = await tokenBlacklistModel.create({ token });
         console.log("SAVED TOKEN:", savedToken);
        

        res.clearCookie("token");

        return res.status(200).json({
            message: "user logged out successfully",
            savedToken
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}


async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
 res.status(200).json({
    user:{
        id:user._id,
        username:user.username,
        email:user.email

    }
 })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};