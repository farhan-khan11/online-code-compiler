import express from 'express'
import cors from 'cors'

// imports
import generatefile from './generatefile.js';
import executeC from './execute.js';

const PORT = 4060 || 4061;

const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended: true}));

server.get("/", (req,res) => {
    return res.status(200).json( "Hello from compiler project.")
})

server.post("/run", async (req,res) => {
    const {language, code} = req.body || {}
    console.log("language=c::", language)

    if(code === undefined || code === ""){
        console.log("empty code body")
        return res.status(400).json({ message : "empty code body"})
    }

    //generating file
    const filePath = await generatefile(language, code);
    
    //executing that file
    const output = await executeC(filePath)

    console.log("body : ", language, code);
    // console.log("filePath: ", filePath);
    return res.status(200).json({language: language, code, filePath, output})
    // return res.status(200).json({filePath})
});

server.use((req,res) => {
    res.status(400).json({error: "Router not found !"})
});

server.listen(PORT, ()=>{
  console.log(`Server is running at http://localhost:${PORT}`);
})