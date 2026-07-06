import express from 'express'

import cors from 'cors' 
const app = express();


// cors helps connect backend n frontend , we can either set cors to accept from any site or some particular site , for now its * 
app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials : true 
}))

import userRouter from "./routes/user.routes.js";


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRouter);






export default app ; 