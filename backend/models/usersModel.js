const mongoose = require("mongoose")

const UserSchema= new mongoose.Schema({
    lastname:{
        type: String,
        required: true,
        max: 30
    },
    firstname:{
        type: String,
        required: true,
        max: 30
    },
    dateofbirth:{
        type: Date,
        required:true
    },
    email:{
        type: String,
        unique: true,
        required:true,
        max: 30
    },
    password:{
        type: String,
        required: true,
        min: 8,
        max: 30
    },
    profileImage:{
        type: String,
        default: ""
    },
    coverImage:{
        type: String,
        default: ""
    },
    friends:{
        type: Array,
        default: []
    },
    description:{
        type: String,
        max: 100
    }, 
    theAdmin:{
        type: Boolean,
        default: false
    },
    notifications:[
        {
            type: {
                type: String, 
                required: true
            },
            message: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            read: {
                type: Boolean,
                default: false
            }
        }
    ]
},{timestamps:true});

module.exports=mongoose.model("usersModel", UserSchema)