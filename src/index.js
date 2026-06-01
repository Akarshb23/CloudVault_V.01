import dotenv from 'dotenv'
import connectDB from './db/index.js'
import app from './app.js'

// to get the data from .env file 
dotenv.config({
    path : "./.env"
})

// whenever we connect a database , it returns a promise(js) so we use .then and .catch for it 
connectDB()
.then(()=>{ 
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server running at  port : ${process.env.PORT || 8000}`)
    })
})
.catch((err)=>{
    console.log("Mongo DB connection failed !!!" , err)
})