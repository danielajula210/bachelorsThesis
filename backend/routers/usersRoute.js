const router = require("express").Router();
const userModel=require("../models/usersModel");
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
    }).select("_id firstname lastname profileImage");

    res.status(200).json(users);
} catch (err) {
    res.status(500).json(err);
}
});

const multer = require('multer');
const path = require('path');

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

module.exports = router