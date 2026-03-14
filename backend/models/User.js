import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        githubId: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        accessToken: {
            type: String
        },
        repoCreated: {
            type: Boolean,
            default: false
        },
        solvedProblems: [{type: Number}]
    }
)

const User = mongoose.model("User", userSchema)

export default User;