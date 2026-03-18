import express from 'express'
import axios from 'axios'
import User from '../models/User.js'

import dotenv from 'dotenv'
dotenv.config()

const authRouter = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const CLIENT_URL = process.env.CLIENT_URL

// redirectiong user to github
authRouter.get('/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo user:email`;
    res.redirect(githubAuthUrl)
})

authRouter.get('/github/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        console.log("No code from github");
        return res.status(400).json({ error: "No code from github" })
    }

    try {
        //exchange of code for accessToken
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code
            },
            {
                headers: { Accept: 'application/json' }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // using accessTOken to get user info from github
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const profile = userResponse.data

        // finding and creating user in mongodb
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
            user = await User.create({
                githubId: profile.id,
                username: profile.login,
                email: profile.email,
                avatar: profile.avatar_url,
                accessToken: accessToken
            });
        } else {
            user.accessToken = accessToken
            await user.save();
        }

        req.session.userId = user._id

        res.redirect(CLIENT_URL)


    } catch (error) {
        console.log("OAuth Error : ", error)
        return res.status(500).json({ error: "OAuth failed" });
    }
});

authRouter.get('/me', async (req, res) => {

    if (!req.session.userId) {
        console.log("Not logged in")
        res.status(401).json({ error: "Not logged in" });
        return res.redirect("/")
    }

    const user = await User.findById(req.session.userId);
    console.log("User : ", user);
    res.json({
        username: user.username,
        avatar: user.avatar,
        repoCreated: user.repoCreated
    });
});


authRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out Successfully" })
});

export default authRouter