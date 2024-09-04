import Notification from '../Models/notification.model.js';

export const getNotifications = async (req, res) => {

    try {
        const userId = req.user._id;
        const notification = await Notification.find({to: userId}).populate({
            path:"from",
            select: "username profileImg"
        }); 

        await Notification.updateMany({to:userId}, {read:true});
        res.status(201).json(notification)
    } catch (error) {
        console.log("Error in the get notifications controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }

};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({to: userId});
        res.status(201).json({message: "Deleted all notifications successfully"})
    } catch (error) {
        console.log("Error in the get notifications controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteSingleNotification = async (req, res) => {
    try {
        const postId = req.params.id;

        await Notification.findByIdAndDelete({_id:postId})
        res.status(201).json({message: "Successfully deleted"})
    } catch (error) {
        console.log("Error in the get notifications controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
