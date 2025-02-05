const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET_KEY } = require("../controllers/userController");

const authentication = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    //check token is available
    if (!token) {
        res.status(401);
        throw new Error("Token is not available");
    }

    // If token is available, verify it
    jwt.verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401);
            throw new Error("Token not matched");
        }
        req.user = decoded.user;
        next();
    });
});

module.exports = authentication;