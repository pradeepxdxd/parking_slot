import jwt from "jsonwebtoken";

export async function auth(req, res, next) {
    try {
        
        const token = req.headers.authorization.split(" ")[1];
        
        if (!token) {
            res.status(401).send({
                statusCode: 401,
                err: "Unauthorized user"
            })
        }
        
        jwt.verify(token, process.env.TOKEN_KEY);
        
        next();
    }
    catch (err) {
        res.status(403).send({
            statusCode: 403,
            err: "Invalid jwt token"
        })
    }
}