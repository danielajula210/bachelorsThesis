const router=require("express").Router();

const postModel=require("../models/postsModel")
const userModel=require("../models/usersModel")

router.post("/",async(request,response)=>{
    const creatingPost=new postModel(request.body);
    try{
        const savingPost=await creatingPost.save();
        response.status(200).json(savingPost)

    }catch(error){
        response.status(500).json(error)
    }
});

router.delete("/:id",async(request,response)=>{
    try{
        const findPhoto= await postModel.findById(request.params.id);
        if(findPhoto.userId === request.body.userId){
            await findPhoto.deleteOne();
            response.status(200).json("Successful Delete");
        }else{
            response.status(403).json("Failed Delete");
        }
    }catch(error){
        response.status(500).json(error);
    }
});


router.get("/foradmin", async (req, res) => {
    try {
        const allPosts = await postModel.find();
        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea postărilor", error });
    }
});

router.delete("/deletefromadmin/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await postModel.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: "Postarea nu a fost găsită" });
        }

        res.status(200).json({ message: "Postarea a fost ștearsă cu succes", deletedPost });
    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergerea postării", error });
    }
});

router.get("/:id",async(request,response)=>{
    try{
        const findPost=await postModel.findById(request.params.id);
        response.status(200).json(findPost);

    }catch(error){
        response.status(500).json(error);
    }
});

router.get("/gettingposts/:userId", async (request, response) => {
    try {
        const user = await userModel.findById(request.params.userId);
        const friendsposts = await Promise.all(
            user.friends.map((friendId) => {
                return postModel.find({ userId: friendId });
            })
        );
        response.status(200).json(friendsposts.flat());
    } catch (error) {
        response.status(500).json(error);
    }
});


router.get("/gettingprofileposts/:userId",async(request,response)=>{
    const { userId } = request.params;
    console.log("USER ID:",userId);
    try {
        const posts = await postModel.find({ userId: userId });
        response.json(posts);
        console.log()
    } catch (err) {
        response.status(500).send('Error fetching posts');
    }
});


router.put("/:id",async(request,response)=>{
    try{
        const findPhoto= await postModel.findById(request.params.id);
        if(findPhoto.userId === request.body.userId){
            await findPhoto.updateOne({$set:request.body});
            response.status(200).json("Successful Update");
        }else{
            response.status(403).json("Failed Update");
        }
    }catch(error){
        response.status(500).json(error);
    } 
});


router.put("/:id/liking",async(request,response)=>{
    try{
        const likedPost=await postModel.findById(request.params.id);
        if(!likedPost.postLikes.includes(request.body.userId)){
            await likedPost.updateOne({ $push: {postLikes: request.body.userId}});
            response.status(200).json("Successfuly liked");
        }else{
            await likedPost.updateOne({$pull:{postLikes:request.body.userId}});
            response.status(200).json("Taken like back");
        }
    }catch(error){
        response.status(500).json(error)
    }
});

router.put("/:id/disliking",async(request,response)=>{
    try{
        const dislikedPost=await postModel.findById(request.params.id);
        if(!dislikedPost.postDislikes.includes(request.body.userId)){
            await dislikedPost.updateOne({ $push: {postDislikes: request.body.userid}});
            response.status(200).json("Successfuly disliked");
        }else{
            await dislikedPost.updateOne({$pull:{postDislikes:request.body.userId}});
            response.status(200).json("Taken dislike back");
        }
    }catch(error){
        response.status(500).json(error);
    }
});

router.put("/:id/addComment", async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        const comment = {
            userId: req.body.userId,
            lastname:req.body.lastname,
            firstname:req.body.firstname,
            profileImage:req.body.profileImage,
            text: req.body.text,
            createdAt: new Date(),
        };

        post.postComments.push(comment);
        await post.save();

        res.status(200).json(post.postComments);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/suggestedposts/:userId", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        if (!user) return res.status(404).json("User not found");

        const allUsers = await userModel.find({ _id: { $ne: user._id } });
        const userFriendIds = user.friends.map(id => id.toString());

        const suggestedFriends = allUsers.filter(otherUser => {
            const otherFriendIds = otherUser.friends.map(id => id.toString());
            const commonFriends = otherFriendIds.filter(id => userFriendIds.includes(id));
            return commonFriends.length > 0 && !userFriendIds.includes(otherUser._id.toString());
        });

        const suggestedFriendIds = suggestedFriends.map(u => u._id.toString());

        const postsFromSuggestedFriends = await postModel.find({
            userId: { $in: suggestedFriendIds }
        });

        const allPosts = await postModel.find();
        const userFriendsPosts = await postModel.find({ userId: { $in: userFriendIds } });

        const keywords = userFriendsPosts.flatMap(post =>
            post.description ? post.description.toLowerCase().split(/\s+/) : []
        );

        const keywordSet = new Set(keywords);

        const similarKeywordPosts = allPosts.filter(post => {
            if (!userFriendIds.includes(post.userId.toString()) && post.description) {
                const words = post.description.toLowerCase().split(/\s+/);
                return words.some(word => keywordSet.has(word));
            }
            return false;
        });

        const allSuggestedPostsMap = new Map();

        [...postsFromSuggestedFriends, ...similarKeywordPosts].forEach(post => {
            allSuggestedPostsMap.set(post._id.toString(), post);
        });

        res.status(200).json(Array.from(allSuggestedPostsMap.values()));
    } catch (error) {
        console.error("Error fetching suggested posts:", error);
        res.status(500).json({ error: error.message });
    }
});


module.exports=router;