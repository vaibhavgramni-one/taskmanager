const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true, 
        required : true
    },
    email : {
        type : String ,
        unique : true,
        trim : true,
        required : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error('invalid email...')
            }
        }
    },
    password : {
        type : String,
        trim : true,
        minlength : 7,
        required : true
    },
    age  : {
        type : Number,
        default : 0,
        isValidate(value){
            if(value < 0){
                throw new Error('Age cannot be non -positive..')
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }]
})

//... methods work on instances and called as instance method...//
userSchema.methods.generateAuthToken = async function(){
    const user = this

    const token = jwt.sign({ _id : user._id.toString() } , 'helloworld')

    user.tokens.push({ token })

    await user.save()

    return token

}


//... statics work on model and called as model method ...//
userSchema.statics.isValidCredentials = async function(email , password) {
    
        const user = await User.findOne({ email })
        if(!user){
            throw new Error('Invalid credentials used :[')
        }

        const isMatch = await bcrypt.compare(password , user.password)

        if(!isMatch){
            console.log('invalid password')
            throw new Error('Invalid credentials used :[')
        }

        return user
}

userSchema.pre('save' , async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8)
    }
    
    next()
})

const User = new mongoose.model('User' , userSchema)

module.exports = User