import { error } from 'console';
import mongoose from 'mongoose'

export async function Connect(){
    try{
        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        connection.on("connected",()=>{
            console.log('MonogDB connected succesfull')
        })
        connection.on("error",()=>{
            console.log('MongoDB connection erorr. please make sure MongoDB is running'+error)
            process.exit()
        })
    }catch(err){
        console.log("somtig wend wrong")
        console.log(err)
    }
}