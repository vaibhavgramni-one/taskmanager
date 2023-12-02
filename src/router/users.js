const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const auth = require('../middleware/auth')
const { urlencoded } = require('express')


router.post('/users' , async (req , res) => {
    const user = new User(req.body)
    try{    
        //await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user , token
        })
    } catch(e){
        res.send(e)
    }
 })

router.post('/users/login' , async (req , res) => {
    try{
        const user = await User.isValidCredentials(req.body.email , req.body.password)
       //... adding a functionality to add token to user and sent it also...//
        const token = await user.generateAuthToken()
        
        //res.send(user)
        res.send({
            user , token
        })
        
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout' , auth , async (req , res) => {
    try{
        const user = req.user
        console.log(user)
        user.tokens = user.tokens.filter((token) => {
            return token.token != req.token
        })

        await user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll' , auth , async (req , res) => {
    try{

        req.user.tokens = []
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me' , auth , async (req ,res) => {
    res.send(req.user)
 })
 
 
router.patch('/users/me' , auth , async (req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'password' , 'email' , 'age']
    const isValidOperation = updates.every((update) =>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        res.status(400).send('Invalid attributes added :[')
    }
    try{

        // const user = await User.findById(req.user._id)
        
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/users/me' , auth , async (req , res) => {
     try{
        //  const user = await User.findByIdAndDelete(req.user._id)
        //  console.log(user)
        
        await req.user.remove()
        res.send(req.user)
     }catch(e){
         res.status(500).send()
     }
 }) 
 
module.exports = router