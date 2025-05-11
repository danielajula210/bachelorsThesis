const router = require("express").Router();
const userModel=require("../models/usersModel");
const postModel=require("../models/postsModel")
const bcrypt=require("bcrypt");

router.put("/:id",async(request,response)=>{
    if(request.body.userId === request.params.id || request.body.theAdmin){
        if(request.body.password){
            try{
                const newpassword=await bcrypt.genSalt(10);
                request.body.password=await bcrypt.hash(request.body.password, newpassword);
            }catch(error){
                return response.status(500).json(error);
            }
        }
        try{
            const updateuser=await userModel.findByIdAndUpdate(request.params.id,{$set:request.body,});
            response.status(200).json("Updated!")
        }catch(error){
            return response.status(500).json(error);
        }
    }else{
        return response.status(403).json("Impossible update")
    }
});

router.delete("/:id",async(request,response)=>{
    if(request.body.userId === request.params.id || request.body.theAdmin){
        try{
            await userModel.findByIdAndDelete(request.params.id);
            response.status(200).json("Deleted!")
        }catch(error){
            return response.status(500).json(error);
        }
    }else{
        return response.status(403).json("Impossible delete");
    }
});

router.get("/",async(request,response)=>{
    const userId = request.query.userId;
    const lastName = request.query.lastName;
    const firstName= request.query.firstName;
    try{
        const finduser= userId? 
        await userModel.findById(userId):
        await userModel.findOne({lastname:lastName,firstname:firstName});
        const {theAdmin,password, updatedAt, createdAt, ...other}=finduser._doc;
        response.status(200).json(other)
    }catch(error){
        return response.status(500).json(error);
    }
});

router.put("/:id/friends",async(request, response)=>{
    try{
        const friend1=await userModel.findById(request.params.id);
        const friend2=await userModel.findById(request.body.userId);
        if(!friend1.friends.includes(request.body.userId)){
            await friend1.updateOne({$push:{friends:request.body.userId}});
            await friend2.updateOne({$push:{friends:request.params.id}});
            response.status(200).json("you are friends now");
        }else{
            response.status(403).json("Already friends");
        }
    }catch(error){
        response.status(500).json(error);
    }
});

router.put("/:id/unfriend",async(request, response)=>{
    try{
        const friend1=await userModel.findById(request.params.id);
        const friend2=await userModel.findById(request.body.userId);
        if(friend1.friends.includes(request.body.userId)){
            await friend1.updateOne({$pull:{friends:request.body.userId}});
            await friend2.updateOne({$pull:{friends:request.params.id}});
            response.status(200).json("You aren't friends anymore");
        }else{
            response.status(403).json("Already unfriend");
        }
    }catch(error){
        response.status(500).json(error);
    }
});

router.get("/getFriends/:userId", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const friends = await userModel.find({ _id: { $in: user.friends } }).select("firstname lastname profileImage");
    
        res.status(200).json(friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/search", async (req, res) => {
    const query = req.query.query;
    try {
    const users = await userModel.find({
    $or: [
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } }
    ]
    }).select("_id firstname lastname profileImage theAdmin");

    res.status(200).json(users);
} catch (err) {
    res.status(500).json(err);
}
});

const multer = require('multer');
const path = require('path');
const usersModel = require("../models/usersModel");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'public/photos'); 
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.put("/:id/updateCoverImage", upload.single('file'), async (req, res) => {
    try {
    const coverImage = req.file ? `${req.file.filename}` : null; 
    console.log("Cover Image Path:", coverImage);

    if (!coverImage) {
        return res.status(400).json("No file uploaded.");
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        { $set: { coverImage: coverImage } },
        { new: true }
    );

    if (updatedUser) {
        return res.status(200).json({ coverImage: updatedUser.coverImage });
    } else {
        return res.status(404).json("User not found");
    }
    } catch (error) {
    return res.status(500).json(error);
    }
});

router.put("/:id/updateProfileImage",upload.single('file'), async (req, res) => {
    try {
        const profileImage = req.file ? `${req.file.filename}` : null; 
        console.log("Profile Image Path:", profileImage);
    
        if (!profileImage) {
        return res.status(400).json("No file uploaded.");
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            { $set: { profileImage: profileImage } },
            { new: true }
        );

        if (updatedUser) {
            return res.status(200).json({ profileImage: updatedUser.profileImage });
        } else {
            return res.status(404).json("User not found");
        }
        } catch (error) {
        return res.status(500).json(error);
        }
});

router.put("/updateDescription/:id", async (req, res) => {
    const userId = req.params.id;
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ message: "Description is required" });
    }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { description },
            { new: true }
        );

        if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating description:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:userId/notifications", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications", error: err });
    }
});

router.post("/:userId/notifications/create", async (req, res) => {
    const { userId, type, message, postId } = req.body;

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newNotification = {
            type: type,
            message: message,
            postId: postId,
            read: false,
            date: new Date()
        };

        user.notifications.unshift(newNotification);

        await user.save();

        res.status(200).json("Notification sent successfully!");
    } catch (err) {
        res.status(500).json({ message: "Error sending notification", error: err });
    }
});

router.get("/suggestedFriends/:userId", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const userFriendIds = user.friends.map(id => id.toString());
        const allUsers = await userModel.find({ _id: { $ne: req.params.userId } });
        const suggested = allUsers.map(otherUser => {
            const otherFriendIds = otherUser.friends.map(id => id.toString());
            const commonFriends = otherFriendIds.filter(id => userFriendIds.includes(id));
            const hasCommonFriends = commonFriends.length > 0;
            const isNotAlreadyFriend = !userFriendIds.includes(otherUser._id.toString());
            if (hasCommonFriends && isNotAlreadyFriend) {
                return {
                    ...otherUser.toObject(), 
                    commonFriendsCount: commonFriends.length 
                };
            }

            return null; 
        }).filter(user => user !== null); 

        res.status(200).json(suggested);
    } catch (err) {
        console.error("Error in suggestedFriends:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

router.get("/badges/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId || userId === 'undefined') {
            return res.status(400).json({ error: "UserId lipsă sau invalid." });
        }


        const likesReceivedAgg = await postModel.aggregate([
        { $match: { userId: userId } },
        { $project: { likesCount: { $size: { $ifNull: ["$postLikes", []] }} } },
        { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } }
        ]);
        const likesReceived = likesReceivedAgg[0]?.totalLikes || 0;

        const likesGivenAgg = await postModel.aggregate([
        { $match: { postLikes: userId } },
        { $project: { postLikes: 1 } },
        { $unwind: "$postLikes" },
        { $match: { postLikes: userId } },
        { $count: "likesGiven" }
        ]);
        const likesGiven = likesGivenAgg[0]?.likesGiven || 0;
        console.log("Likes Received:", likesReceived);

        const commentsReceivedAgg = await postModel.aggregate([
        { $match: { userId: userId } },
        { $project: { commentsCount: { $size: { $ifNull: ["$postComments", []] } } } },
        { $group: { _id: null, totalComments: { $sum: "$commentsCount" } } }
        ]);
        const commentsReceived = commentsReceivedAgg[0]?.totalComments || 0;

        const commentsGivenAgg = await postModel.aggregate([
        { $unwind: "$postComments" },
        { $match: { "postComments.userId": userId } },
        { $count: "commentsGiven" }
        ]);
        const commentsGiven = commentsGivenAgg[0]?.commentsGiven || 0;

        const postsCount = await postModel.countDocuments({ userId });
        const user = await userModel.findById(userId);
        const friendsCount = user.friends?.length || 0;
        const birthDate = user.dateofbirth;
        const createdAt = user.createdAt;


        const today = new Date();
        const isBirthday =
        birthDate &&
        new Date(birthDate).getDate() === today.getDate() &&
        new Date(birthDate).getMonth() === today.getMonth();

        const isChristmas = today.getDate() === 25 && today.getMonth() === 11;
        const isEaster = false;

        const badgeList = [];

        badgeList.push({ name: "Bun venit!", image: "welcome.png" });

        if (isBirthday) badgeList.push({ name: "La mulți ani!", image: "birthday.png" });
        if (isChristmas) badgeList.push({ name: "Crăciun fericit!", image: "christmas.png" });
        if (isEaster) badgeList.push({ name: "Paște fericit!", image: "easter.png" });

        if (postsCount >= 1) badgeList.push({ name: "Prima postare", image: "1post.png" });
        if (postsCount >= 5) badgeList.push({ name: "5 Postări", image: "5posts.png" });
        if (postsCount >= 10) badgeList.push({ name: "10 Postări", image: "10posts.png" });
        if (postsCount >= 50) badgeList.push({ name: "50 de Postări", image: "50posts.png" });

        if (likesGiven >= 5) badgeList.push({ name: "5 Aprecieri date", image: "5likesgiven.png" });
        if (likesGiven >= 10) badgeList.push({ name: "10 Aprecieri date", image: "10likesgiven.png" });

        if (likesReceived >= 5) badgeList.push({ name: "5 Aprecieri primite", image: "5likesreceived.png" });
        if (likesReceived >= 20) badgeList.push({ name: "20 Aprecieri primite", image: "20likesreceived.png" });

        if (commentsGiven >= 5) badgeList.push({ name: "5 Comentarii date", image: "5commentsgiven.png" });
        if (commentsReceived >= 10) badgeList.push({ name: "Comentarii date", image: "5commentsrecieved.png" });

        if (friendsCount >= 1) badgeList.push({ name: "1 Prieten", image: "1friend.png" });
        if (friendsCount >= 10) badgeList.push({ name: "10 Prieteni", image: "10friends.png" });
        if (friendsCount >= 50) badgeList.push({ name: "50 de Prieteni", image: "50friends.png" });

        
        user.badges = badgeList; 
        await user.save();
        return res.status(200).json(badgeList);
        
    } catch (err) {
        console.error("Eroare la calculul badge-urilor:", err);
        return res.status(500).json({ error: "Eroare la obținerea badge-urilor." });
    }

});



module.exports = router