import { Connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModule";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

Connect();

export async function POST(reques: NextRequest) {
  try {
    const reqBody = await reques.json();
    const { username, email, password } = reqBody;

    console.log(reqBody);
    //check user exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json({ error: "user alredy exist" }, { status: 400 });
    }

    //hash the password
    const slat = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(password, slat);

    //create a user
    const createUser = new User({
      username,
      email,
      password: hashedPass,
    });

    const user = await createUser.save();
    console.log(user);
    return NextResponse.json({
      message: "user created succesfully",
      success:true,
      user
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
