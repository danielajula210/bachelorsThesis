const express = require ("express");
const app = express()

const helmet=require("helmet");
const morgan=require("morgan");
const mongoose = require('mongoose');
const dotenv=require("dotenv");
const userRoute = require("./routers/usersRoute")
const registerRoute = require("./routers/authentificationRoute")
const postsRoute=require("./routers/postsRoute")

dotenv.config();

app.listen(8800,()=>{
    console.log("Running server")
})

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected successfully");
    } catch (error) {
        console.error("Error at connection:", error);
        process.exit(1);
    }
}

connectDB();

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/usersRoute", userRoute)
app.use("/api/authentificationRoute", registerRoute)
app.use("/api/postsRoute",postsRoute)



