
const jwt = require("jsonwebtoken");
const { JWT_SECERT } = require("./config");
const authmiddleware =(req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(403).json({
            message:"incorrect token"
        })
    }
    // const token = authHeader.split(' ')[1];
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECERT);
        req.userId = decoded.userid;
        next();
    }
    catch(err){
        return res.status(403).json({})
    }
}
module.exports ={
    authmiddleware
}