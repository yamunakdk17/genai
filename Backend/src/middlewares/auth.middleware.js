// const jwt = require("jsonwebtoken");
// const tokenBlacklistModel = require("../models/blacklist.model")

// async function authUser(req, res, next) {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({
//             message: "token not provided."
//         });
//     }
//     const isTokenBlacklisted = await tokenBlacklistModel.findOne({
//         token
//     })
//     if (isTokenBlacklisted){
//         return res.status (401).json({
//             message:"Token is invalid."
//         })
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({
//             message: "Invalid token."
//         });
//     }
// }

// module.exports = {
//     authUser
// }
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {

    console.log("========== AUTH ==========");
    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            message: "token not provided."
        });
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

    console.log("Blacklisted:", isTokenBlacklisted);

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is invalid."
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded:", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.log("JWT ERROR:", err.message);

        return res.status(401).json({
            message: "Invalid token."
        });

    }
}

module.exports = {
    authUser
};