const express = require('express');
const zod = require('zod');
const router = express.Router();
const { authmiddleware } = require('../middleware');
const { User,Account } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECERT } = require('../config');


//  user signup router to create an account

const signupBody = zod.object({
    username:zod.string(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})
router.post('/signup',async(req,res)=>{

   const { success } = signupBody.safeParse(req.body);

   if(!success){
    return res.status(411).json({
        message:"incorrect inputs"
    })
   } 
   const existingUser = await User.findOne({
    username:req.body.username
   })
   if(existingUser){
    return res.status(411).json({
        message:"Email alredy taken/incorrect inputs"
    })
   }
   const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
   })
   const userid = user._id;
//    adding initial balance for the user
   await Account.create({
    userId: userid,
    balance: 1000+Math.random()*10000
   })
   const token = jwt.sign({
    userid
   },JWT_SECERT);
   res.json({
    message:"User created successfully",
    token:token
   })
})
//  user signin router to login
const signinBody = zod.object({
    username:zod.string(),
    password:zod.string()
})
router.post('/signin',async (req,res)=>{
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username:req.body.username,
        password:req.body.password
    });
    if(user){
        const token = jwt.sign({
            userid:user._id
        },JWT_SECERT);
        res.json({
            token:token
        })
        return;
    }
    res.status(411).json({
        message:"Error while logging in"
    })
})

// updating user details

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/",authmiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

	await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})
router.get('/bulk', async(req, res) => {
    try {
        const { filter = ""} = req.query

        const users = await User.find({})  
        
        res.json({
            user: users.map((user) => ({                
                username: user.username,
                firstName: user.firstname,
                lastName: user.lastname,
                _id: user._id
            }))
        })
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching users." });
    }
})
// user for searching frds or other users 

// router.get("/bulk", async (req, res) => {
//     try {
//         const filter = req.query.filter?.trim() || " ";
//         if (!filter) {
//             return res.json({ user: [] });
//         }

//         const users = await User.find({
//             $or: [
//                 { firstName: new RegExp(filter, "i") },
//                 { lastName: new RegExp(filter, "i") }
//             ]
//         }).limit(50);

//         res.json({
//             user: users.map(user => ({
//                 username: user.username,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 _id: user._id
//             }))
//         });
//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// router.get("/bulk", async (req, res) => {
//     try {
//         const filter = req.query.filter?.trim() || "";

//         if (!filter) {
//             return res.json({ user: [] }); // No filter applied, return empty array
//         }

//         const users = await User.find({
//             $or: [
//                 { firstName: { "$regex": filter, "$options": "i" } },
//                 { lastName: { "$regex": filter, "$options": "i" } }
//             ]
//         }).limit(50); // Limit to 50 results

//         res.json({
//             user: users.map(user => ({
//                 username: user.username,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 _id: user._id
//             }))
//         });

//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


module.exports = router;