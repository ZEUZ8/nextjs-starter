import { Connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModule";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"


Connect()

export async function POST(request:NextRequest){
    try{
        const reqBody = await request.json()
        const {email,password} = reqBody
        console.log(reqBody)

        //check the user exists
        const existingUser = await User.findOne({email})
        if(!existingUser){
            return NextResponse.json({
                message:"user doest not exist"},
                {status:400}
            )
        }
        //check the password
        const validPassword = await bcryptjs.compare(password,existingUser.password)
        if(!validPassword){
            return NextResponse.json({error:"Invalid Password"},{status:400})
        }
        const tokenData ={
            id:existingUser?._id,
            name:existingUser?.username
        }
        const token = await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:"1d"})
        const response = NextResponse.json({message:"Login successfull"},{status:200})
        response.cookies.set("token",token,{httpOnly:true})
        return response
    }catch(error:any){
        console.log("error at user login",error)
        return NextResponse.json({error:"error.message"},{status:500})
    }
}