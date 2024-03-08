const User=require('../models/User');
const bcrypt=require('bcrypt');
const crypto = require('crypto').randomBytes(32);

//user registration controller business logic

exports.register=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        
        const hashedpassword=await bcrypt.hash(password,6);
         console.log('password',hashedpassword);
        
        const newuser=await User.create({
            username,
            email,
            password:hashedpassword,
        })

        console.log('user',newuser);
        
        res.status(200).json({
            success:true,
            data:newuser
        })
    }catch(error)
    {
        console.log('error',error);
        res.status(500).json({
            message:'internal server error',
            success:false,
            error:error
        })
    }
}

//user login creation 

exports.login=async(req,res)=>{
    try{
        
        const{email,password}=req.body;
        const user=await User.findOne({email:email});

        
        if(!user)
        {
            return res.status(400).json('Wrong Credentials');
        }
       
        
        const validate=await bcrypt.compare(password,user.password);
        
        if(!validate) 
        {
          return res.status(404).json('wrong password,please fill the correct password');
        }
        
         
        res.status(200).json({
            success:true,
            message:'user logged in successfully'
        });
        

    }catch(error)
    {
        console.log('error',error);
         res.status(500).json({
            message:'internal server error',
            success:false,
            error:error
        })
        
    }
}


//forget user password api creation 
exports.forgetpass=async(req,res)=>{
    try{
        
        //when we forget password so at that we have to put the email to get the link for forgetting password.
        const{email}=req.body;

        const user=await User.findOne({email:email});
        
        if(!user)
        {
            res.status(400).json({
                success:false,
                message:'Email does not exists'
            })
        }

        const generateToken = crypto.toString("hex");
        

        if(!generateToken)
        {
            return res.status(500).json({
                success:false,
                message:'An error occured. Please try again later',
            })
        }

        //set the token and expiring period for the token to the client schema 
        const updatedUser= await User.findOneAndUpdate(
            {email:email},
            {
                resetToken:generateToken,
                expireToken:Date.now() + 1800000,
            },
            {new:true}
        )

        //now after getting the token we will send the token along with the url at the end of frontend 
        //when user will open that page he gets token in url and he can update the password and there expire token 
        // time will be checked .
        const url=`localhost:3000/update-password/${generateToken}`;
        res.status(200).json({
            success:true,
            data:url
        })

    }catch(error){

        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
          })
    }

}
