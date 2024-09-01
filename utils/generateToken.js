import  jwt  from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, response) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '10d'
    })


    response.cookie('jwt', token, {
        //converting the maximum days of validity into milliseconds-10days
        maxAge: 10*24*60*60*1000,
        httpOnly: true, //prevent XSS attack
        sameSite: "strict", //prevent CSRF attack
        secure: process.env.NODE_ENV !== 'development'
    })
}