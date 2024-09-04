import User from "../Models/user.model.js";
import Post from "../Models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../Models/notification.model.js";

export const createPost = async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "Post must contain either image or text" });
    }

    if (img) {
      console.log("entered");
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse;
    }

    const newPost = new Post({
      user: user._id,
      text,
      img,
    });

    const post = await newPost.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in the post controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params._id);
    res.status(200).json({ message: "Deleted the post successfully" });
  } catch (error) {
    console.log("Error in the delete post controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params._id);
    const { text } = req.body;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!text) {
      return res.status(401).json({ error: "Text field is required" });
    }

    const comment = {
      users: user._id,
      text,
    };

    post.comments.push(comment);
    const commentedPost = await post.save();
    res.status(200).json(commentedPost);
  } catch (error) {
    console.log("Error in the comment post controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const isUserLiked = post.likes.find(
      (like) => like._id.toString() === user._id.toString()
    );
    if (isUserLiked) {
      //if user is already liked the post then, unlike it
      await Post.updateOne(
        { _id: post._id },
        { $pull: { likes: { _id: user._id } } }
      );
      console.log();
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { likedPosts: post._id } }
      );
      res.status(200).json({ message: "Unlike the post" });
    } else {
      post.likes.push(req.user._id);
      const notification = new Notification({
        from: user._id,
        to: post.user,
        type: "like",
      });

      await notification.save();
      await post.save();
      await User.updateOne(
        { _id: req.user._id },
        { $push: { likedPosts: post._id } }
      );
      res.status(200).json(post);
    }
  } catch (error) {
    console.log("Error in the like post controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const allPosts = await Post.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "-password",
    });

    if (!allPosts) {
      return res.status(200).json([]);
    }

    return res.status(200).json(allPosts);
  } catch (error) {
    console.log("Error in the get all posts controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }

    const following = user.following;
    const feedPost = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-passowrd",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (!feedPost) {
      return res.status(201).json([]);
    }
    res.status(201).json(feedPost);
  } catch (error) {
    console.log("Error in the get all posts controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsersPosts = async (req, res) => {
  try {
    const username = req.params.username
    const user = await User.findOne({username})
    if(!user){
      return res.status(404).json({error: "User not found"});
    }

    const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
      path:"user",
      select: "-password"
    }).populate({
      path:"comments.users",
      select:"-password"
    })

    res.status(200).json(posts)

  } catch (error) {
    console.log("Error in the get all posts controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
