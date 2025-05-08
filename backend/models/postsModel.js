const mongoose = require("mongoose")

const PostSchema= new mongoose.Schema({
    userId:{
        required:true,
        type:String
    },
    postDescription:{
        max:300,
        type:String
    },
    postImage:{
        type:String
    },
    postLikes:{
        type:Array,
        default:[]
    },
    postDislikes:{
        type:Array,
        default:[]
    },
    postComments:{
        type:Array,
        default:[]
    },
},{timestamps:true});

module.exports=mongoose.model("postsModel", PostSchema)