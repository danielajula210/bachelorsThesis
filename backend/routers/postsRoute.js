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

router.get("/:id",async(request,response)=>{
    try{
        const findPost=await postModel.findById(request.params.id);
        response.status(200).json(findPost);

    }catch(error){
        response.status(500).json(error);
    }
});

router.get("/gettingposts/feed",async(request,response)=>{
    try{
        const user=await userModel.findById(request.body.userId);
        const thisuserspost=await postModel.find({userId:user._id});
        const friendsposts=await Promise.all(
            user.friends.map((friendId)=>{
                return postModel.find({userId:friendId});
            })
        );
        response.json(thisuserspost.concat(...friendsposts))
    }catch(error){
        response.status(500).json(error);
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
    

module.exports=router;