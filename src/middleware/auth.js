
const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req , res , next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        
        if(!token){
            throw new Error()
        }

        const decoded = jwt.verify(token , 'helloworld')

        
        const user = await User.findOne({ _id : decoded._id , 'tokens.token' : token })

        if(!user){
            throw new Error()
        }
        
        req.token = token
        req.user = user
        
        next()
    }catch(e){
        res.status(401).send({ error : 'Please Authenticate '})
    }
}


module.exports = auth