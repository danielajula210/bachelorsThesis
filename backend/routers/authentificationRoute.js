const router = require("express").Router();
const userModel=require("../models/usersModel");
const hiddenpassword= require("bcrypt");
const bcrypt=require("bcrypt")

router.post("/login", async (request, response)=>{
    try {
        const foundUser = await userModel.findOne({ email: request.body.email });
        if (!foundUser) {
            return response.status(404).json({ error: "The user was not found" }); 
        }
        const foundPass = await bcrypt.compare(request.body.password, foundUser.password);
        if (!foundPass) {
            return response.status(400).json({ error: "The password is not valid" });
        }
        return response.status(200).json(foundUser);
    } catch (error) {
        return response.status(500).json("Error"); 
    }
});

router.post("/register", async(request,response)=>{
    try{
        const factor=10;
        const pass= await hiddenpassword.genSalt(factor);
        const passhash= await hiddenpassword.hash(request.body.password, pass);

        const createUser = new userModel({
            lastname: request.body.lastname,
            firstname: request.body.firstname,
            dateofbirth: request.body.dateofbirth,
            email: request.body.email,
            password: passhash
        });

        const user = await createUser.save();
        response.status(200).json(user);
    }catch(error){
        response.status(500).json("The user already exists");
    }
});

module.exports = router;