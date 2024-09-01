import User from'../Models/user.model.js';
import  jwt  from "jsonwebtoken";

export const protectedRoutes = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({ error: 'Unauthorised User: No Token Provided'})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode){
            return res.status(400).json({ error: 'Unauthorised User: Invalid token'})
        }


        const user = await User.findById(decode.userId).select('-password')
        req.user = user
        next()
    
    } catch (error) {
        console.log("Error in the protected route middleware", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}