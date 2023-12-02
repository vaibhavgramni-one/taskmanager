const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/users')
const taskRouter = require('./router/tasks')


const app = express()

//... using express middleware ...//
//... without express middleware : ->   new request -> redirect to route handler ...//
//... with express middleware : -> new request -> does something -> redirect to route handler ...//

// app.use((req , res , next) => {
//     if(req.method === 'POST'){
//         res.send('you cannot fire GET request, try another one...')
//     }
//     else{
//         next()
//     }
// })

// app.use((req , res , next) => {
//     res.status(503).send('Server Under Maintenance :/')
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(3000 , () => {
    console.log('server is up and running at port 3000')
})


// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({ _id : '123'} , 'helloworld' , { expiresIn : '7 days'})
//     console.log(token)

//     const data = jwt.verify(token , 'helloworld')
//     console.log(data)
// }

// myFunction()

