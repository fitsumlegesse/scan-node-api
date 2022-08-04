// import User from '../models/user'
import jwt from 'jsonwebtoken'


export const register = async (req,res)=>{
    
    const {name, email, password} = req.body
    if(!name)return res.status(400).send('Name is required')
    if(!password || password.length < 6)
        return res
            .status(400)
            .send("Password is required and should be min 6 chars long")
    let userExist = await User.findOne({email}).exec()
    if(userExist) return res.status(400).send('Email is taken')


    //Once the contents submitted/posted are verified, we will create the account using the user schema
    const user = new User(req.body)

    // Once we created the user, we will save it to the database 
    try {
        await user.save()
        console.log("User created", user.name)
        return res.json({user})
        
    } catch (error) {
        console.log("Create User Failed", user)
        return res.status(400).send("Error. Try again")
    }
}

export const login = async (req, res) => {
    // console.log('REQUEST BODY', req.body)
    const {email, password} = req.body
    // console.log('EMAIL PULLED FROM req.body', email)
    try {
        let user = await User.findOne({ email }).exec()
        // console.log('RESPONSE FROM User.findOne:', user)
        // console.log('USER EXIST', user)
        if(!user) res.status(400).send('USER WITH THAT EMAIL NOT FOUND')
        user.comparePassword(password, (err,match)=>{
            
            console.log("COMPARE PASSWORD IN LOGIN ERROR", err)
            if(!match || err)return res.status(400).send("Wrong Password")
            console.log('GENERATE A TOKEN AND SEND A RESPONSE TO THE CLIENT')
            let token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
                expiresIn: "7d",
            })
            res.json({
                token,
                user:{
                _id: user._id,
                name:user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
                },
            })
        })
    } catch (err) {
        console.log('LOGIN ERROR', err)
        res.status(400).send('SIGNIN FAILED')
    }
}