import express from 'express'
import Problem from '../models/Problems.js'

const problemRouter = express.Router()

problemRouter.get('/', async (req, res) => {
    try {
        const problems = await Problem.find();
        console.log("problems : ", problems)
        res.status(200).json(problems);
    } catch (error) {
        console.log('Error fetching all problems')
        res.status(500).json({ error: 'Error fetching all problems' })
    }
})

problemRouter.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            console.log("Problem not found")
            return res.status(400).json({ error: "Problem not found" })
        }
        console.log("problem found : ", problem)
        return res.status(200).json({ problem })
    } catch (error) {
        console.log("Error fetching Problem")
        return res.status(500).json({ error: "Error fetching Problem" })
    }
})

export default problemRouter