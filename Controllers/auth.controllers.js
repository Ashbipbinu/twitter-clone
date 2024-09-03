import User from '../Models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../utils/generateToken.js'

export const signUp = async (req, res) => {

    try {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { fullName, email, password, username } = req.body;

    const isUserExist = await User.findOne( { email })
    const isUserNameTaken = await User.findOne({ username })
    const exisitingEmail  = await User.findOne({ email })
    if(!emailRegEx.test(email)) {
        return res.status(400).json({ error: "Invalid email format"})
    }
    
    if(isUserExist){
        return res.status(400).json({ error: "User already exists"})
    }
    
    if(isUserNameTaken){
        return res.status(400).json({ error: "Username already taken" })
    }
    
    if(exisitingEmail){
        return res.status(400).json( { error : "User already exists"})
    }
    
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const newUser = new  User({
        fullName,
        email,
        password: hashedPassword,
        username
    })
    
    if(newUser){
        //set cookie and a token
    
        await newUser.save()
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username:newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg
        })
            
    }else{
        res.status(400).json({ error : "Invalid user data"})
    }

    }catch (error) {
        console.log("Error in the signup controller", error.message)
        res.status(500).json({ error: "Internal server error"})
    }

}

export const logIn = async (req, res) => {

    try {
        const { username, password } = req.body;
        const isUserExists = await User.findOne( { username })
        const isPasswordCorrect = await bcrypt.compare(password, isUserExists?.password || ' ')
        if(!isUserExists || !isPasswordCorrect){
           return res.status(400).json({ error: "Invalid username or password"})  
        }

        if(isUserExists){
            //set cookie and a token
            generateTokenAndSetCookie(isUserExists._id, res)
            res.status(201).json({
                _id: isUserExists._id,
                fullName: isUserExists.fullName,
                email: isUserExists.email,
                followers: isUserExists.followers,
                following: isUserExists.following,
                profileImg: isUserExists.profileImg,
                coverImg: isUserExists.coverImg
            })
        }

    } catch (error) {
        console.log("Error in the login controller", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
    
}

export const logOut = async (req, res) => {
    try {
        res.cookie('jwt', {}, {maxLength:0});
        res.status(200).json({ message: "Logout successfully"})
    } catch (error) {
        console.log("Error in the logout controller", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in the logout controller", error.message)
        res.status(500).json({ error: "Internal server error"})
    }
}