const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')


router.post('/tasks' , async (req ,res) => {
    try{
        const task = new Task(req.body)

        await task.save()

        res.status(201).send(task)
    }catch(e){
        res.send(e)
    }
})

router.get('/tasks' , async (req , res) => {
    try{
        const tasks = await Task.find({})

        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/tasks/:id' , async (req , res) => {
    try{
        const task = await Task.findById(req.params.id)

        if(!task){
            res.status(400).send()
        }

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id' , async (req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        res.send(400).send('Invalid attributes used! :[')
    }

    try{
        //const task = await Task.findByIdAndUpdate(req.params.id , req.body , { new : true , runValidators : true})
        const task = await Task.findById(req.params.id)
    
        if(!task){
            res.status(400).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)

    }catch(e){
        res.status(500).send()
    }
})

router.delete('/tasks/:id' , async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            res.status(400).send()
        }

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})



module.exports = router