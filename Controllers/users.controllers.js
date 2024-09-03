import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import Notification from "../Models/notification.model.js";
import User from "../Models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in the user controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "Successfully unfollowed" });
    } else {
      //follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      //Send an alert
      const notification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await notification.save();
      res.status(201).json({ message: "Successfully followed" });
    }
  } catch (error) {
    console.log(
      "Error in the follow or UnfollowUser controller",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedProfiles = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = await User.findById(currentUserId);
    const followingIds = currentUser.following.map((id) => id.toString());

    const suggestedProfiles = await User.find({
      _id: {
        $ne: new mongoose.Types.ObjectId(currentUserId), // exclude current user
        $nin: followingIds, // exclude followers
      },
    }).select("-password");

    res.status(201).json(suggestedProfiles);
  } catch (error) {
    console.log("Error in the suggestion user controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { email, username, currentPassword, newPassword, fullName, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(401)
        .json({ error: "Enter both new and current passwords" });
    }

    if (currentPassword && newPassword) {
      const isCurrentPasswordMatching = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isCurrentPasswordMatching) {
        return res.status(401).json({ error: "Invalid password" });
      }

      if (newPassword.length < 6) {
        return res.status(401).json({
          error: "Length of password should have atleast 6 characters",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedNewPassword;
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.email = email || user.email;
    user.username = username || user.username;
    user.currentPassword = currentPassword || user.currentPassword;
    user.newPassword = newPassword || user.newPassword;
    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();
    user.password = null;
    return res.status(201).json(user);
  } catch (error) {
    console.log("Error in the upadate user controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
