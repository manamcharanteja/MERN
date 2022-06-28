import bcrypt from "bcryptjs"
import  jwt  from "jsonwebtoken"

import userModal from "../models/user.js"

const secret = "test";


// Sign IN

export const signIn = async (req,res) => {
    const {email, password } = req.body;

    try {
        const oldUser = await userModal.findOne({email})
        if(!oldUser) return res.status(404).json({message : "User doen't exists"})

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"})

        const token = jwt.sign({email: oldUser.email, id:oldUser._id}, secret, {expiresIn: "2h"})

        res.status(201).json({result: oldUser, token})
    } catch(error) {
        res.status(500).json({message: "Something went wrong"})
        console.log(error)
    }
}


// Sign Up
export const signUp = async(req,res) => {
    const {email, password , firstName, lastName} = req.body;
    try {
        const oldUser = await userModal.findOne({email})

        if(oldUser) {
            return res.status(400).json({message: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await userModal.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        })

        const token = jwt.sign({email:result.email, id: result._id}, secret, {expiresIn: "2h"})
        res.status(201).json({result, token})
    } catch(error) {
        res.status(500).json({message: "Something went wrong"})
        console.log(error)
    }
}