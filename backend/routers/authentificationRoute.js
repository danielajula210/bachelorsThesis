const router = require("express").Router();
const userModel=require("../models/usersModel")

router.get("/register", async(require,response)=>{
    const user=await new userModel({
        lastname: "maimuta",
        firstname: "Flavia",
        dateofbirth: "12/3/1999",
        email: "norvegia@gmail.com",
        password: "starwars"
    })
    await user.save()
    response.send("user ok")
});

module.exports = router;