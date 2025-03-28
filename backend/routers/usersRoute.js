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

module.exports = router