import express from "express";
import axios from "axios";
import User from "../models/User.js";

const githubRouter = express.Router()

const isLoggedIn = async (req, res, next) => {
    if (!req.session.userId) {
        console.log("Not logged in ! ")
        return res.status(401).json({ error: "Not logged in !" })
    }
    next();
}

// creating a repo
githubRouter.post('/create-repo', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);

        if (user.repoCreated) {
            console.log("Repo already created !");
            return res.status(400).json({ error: "Repo already created ! " });
        }

        await axios.post('https://api.github.com/user/repos',
            {
                name: '100DaysOfCodingChallenge',
                description: 'My 100 Days of Coding Challange journey!!',
                private: false,
                auto_init: true // this creates repo with readme file
            },
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    Accept: 'application/vnd.github+json' // github docs recommened format instead of application/json. its a github's custom format
                }
            }
        );

        user.repoCreated = true;
        await user.save();

        console.log("Repo created successfully ! ");
        return res.status(200).json({ message: "Repo Created Successfully ! " });

    } catch (error) {
        console.log('error while creating repo', error);
        return res.status(500).json({ error: 'error while creating repo' })
    }
});

export default githubRouter

// use this fetch code and run in browser's console to test create-repo api.
// fetch('http://localhost:4060/github/create-repo', { method: 'POST', credentials: 'include'}).then(res => res.json()).then(data =>console.log(data))
// include means => it automatically fetches the connect.sid from the cookies and hits the api and repo will be created. 
// its more easy to test than postman 