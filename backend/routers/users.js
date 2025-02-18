const router = require("express").Router();

router.get("/",(require,response)=>{
    response.send("Hello from user route")
})

module.exports = router