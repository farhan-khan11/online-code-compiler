import express from "express";
import axios from "axios";
import User from "../models/User.js";

const githubRouter = express.Router()

const isLoggedIn = async (req, res, next) => {
    if (!req.session.userId) {
        console.log("Not logged in ! ")
        res.status(401).json({ error: "Not logged in !" })
        return res.redirect("/")
    }
    next();
}

// creating a repo
githubRouter.post('/create-repo', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);

        try {
            await axios.get(`https://api.github.com/repos/${user.username}/100DaysOfCodingChallenge`,
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        Accept: 'application/vnd.github+json'
                    }
                }
            );
            user.repoCreated = true;
            await user.save()
            console.log("Repo already exists on GitHub")
            return res.status(400).json({error: "Repo already exists on GitHub"})
        } catch (error) {
            if(error.response.status == 404){
                user.repoCreated = false
                await user.save();
            }
        }
        // if (user.repoCreated) {
        //     console.log("Repo already created !");
        //     return res.status(400).json({ error: "Repo already created ! " });
        // }

        await axios.post('https://api.github.com/user/repos',
            {
                name: '100DaysOfCodingChallenge',
                description: 'My 100 Days of Coding Challenge journey!!',
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


// commit code api
githubRouter.post('/commit', isLoggedIn, async(req,res) => {
    try {
        const {code, language, problemId} = req.body;

        const user = await User.findById(req.session.userId);

        const firstLogin = new Date(user.firstLogin);
        const today = new Date();
        const diffTime = today - firstLogin // not calender based . its counting based on firstlogin to next 24hrs intervals
        const day = Math.floor(diffTime/(1000 * 60 * 60 * 24)) + 1 // converts milliseconds to days 
        console.log("Day : ", day)
        console.log("In hrs : ", diffTime)

        const extensions = {js: 'js', py: 'py', c: 'c'};
        const ext = extensions[language]

        const filePath = `Day${day}/Problem_${problemId}.${ext}`

        const encodedCode = Buffer.from(code).toString('base64')

        let sha = null;
        try {
            const existingFile = await axios.get(`https://api.github.com/repos/${user.username}/100DaysOfCodingChallenge/contents/${filePath}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                        Accept: 'application/vnd.github+json'
                    }
                }
            );

            sha = existingFile.data.sha // getting sha if the file exists
            // sha = unique identifier (hash) of a file version in Git
            // while creating a new file => no need of sha
            // while updating a file =>  need sha
        } catch (error) {
            if(error.response && error.response.status == 404){
                console.log("File does not exist, creating new file....")
            }else{
                console.log("Error checking file: ", error.response.data || error);
                return res.status(500).json({error: "Error checking file on Github"})
            }
        }

        await axios.put(
            `https://api.github.com/repos/${user.username}/100DaysOfCodingChallenge/contents/${filePath}`,
            {
                message: `Day ${day} - Solved Problem ${problemId}`,
                content: encodedCode,
                ...(sha && {sha}) // only includes sha if it exists
            },
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                    Accept: 'application/vnd.github+json'
                }
            }
        );

        user.solvedProblems.push({
            problemId,
            day,
            solvedAt: new Date(),
            language
        });

        await user.save();
        console.log(`Code commited successfully to Day${day}/Problem_${problemId}.${ext} !`)
        return res.status(200).json({message: `Code commited successfully to Day${day}/Problems_${problemId}.${ext} !`})
    } catch (error) {
        console.log("error commiting code", error);
        return res.status(500).json({error : "error commiting code"})
    }
});

export default githubRouter

// use this fetch code and run in browser's console to test create-repo api.
// fetch('http://localhost:4060/github/create-repo', { method: 'POST', credentials: 'include'}).then(res => res.json()).then(data =>console.log(data))
// include means => it automatically fetches the connect.sid from the cookies and hits the api and repo will be created. 
// its more easy to test than postman 