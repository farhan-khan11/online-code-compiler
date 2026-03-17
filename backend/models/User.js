import mongoose from "mongoose";

const solvedProblemsSchema = new mongoose.Schema({
    problemId: {type: mongoose.Schema.Types.ObjectId, ref: "Problem"},
    day: {type: Number},
    solvedAt: {type: Date, default: Date.now},
    language: {type: String}
});

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
        avatar:{
            type: String
        },
        accessToken: {
            type: String
        },
        repoCreated: {
            type: Boolean,
            default: false
        },
        firstLogin: {
            type: Date,
            default: Date.now
        },
        solvedProblems: [solvedProblemsSchema]
    }
)

const User = mongoose.model("User", userSchema)

export default User;