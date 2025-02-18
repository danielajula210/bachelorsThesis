const express = require ("express");
const app = express()

const helmet=require("helmet");
const morgan=require("morgan");
const mongoose = require('mongoose');
const dotenv=require("dotenv");
const userRoute = require("./routers/users")
const registerRoute = require("./routers/authentificationRoute")

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

app.use("/api/users", userRoute)
app.use("/api/authentificationRoute", registerRoute)



