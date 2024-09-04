import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    
    text:{
        type: String,
    },
    img:{
        type:String
    },
    likes:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }],
    comments:[{
        users: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {

            type: String,
            require: true
        }
    }]
}, {timestamps: true});

const Post = mongoose.model("post", PostSchema);
export default Post
