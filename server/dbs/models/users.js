import mongoose from 'mongoose'
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
