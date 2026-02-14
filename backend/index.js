import express from 'express'
import cors from 'cors'

// imports
import generatefile from './generatefile.js';
import executeC from './execute.js';
import executeJS from './executeJS.js';
import "./cleanup.js"
import executePy from './executePy.js';

const PORT = 4060 || 4061;

const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended: true}));

server.get("/", (req,res) => {
    return res.status(200).json( "Hello from compiler project.")
})

server.post("/run", async (req,res) => {
    let {language, code} = req.body || {}
    console.log("language=c::", language)

    if(code === undefined || code === ""){
        console.log("empty code body")
        return res.status(400).json({ message : "empty code body"})
    }
try {
    //generating file
    let filePath = await generatefile(language, code);
    let output;
    //executing that file
    if(language == 'c'){
        output = await executeC(filePath)
        
        console.log("body : ", language, code);
        // console.log("filePath: ", filePath);
        return res.status(200).json({language: language, code, filePath, output})
        // return res.status(200).json({filePath})
    }
    if(language == 'js'){
        output = await executeJS(filePath)
        console.log("body : ", language, code);
        return res.status(200).json({language: language, code, filePath, output})
    }
    if(language == 'py'){
        output = await executePy(filePath)
        console.log("body : ", language, code);
        return res.status(200).json({language: language, code, filePath, output})
    }
} catch (error) {
    console.log(error)
    return;
    // return res.status(500).json({error : error.toString()})
}
//     catch (error) {
//     console.log("server erro :",error)
//     return res.status(500).json({output : "Internal server error"})
// }
});

server.use((req,res) => {
    res.status(400).json({error: "Router not found !"})
});

server.listen(PORT, ()=>{
  console.log(`Server is running at http://localhost:${PORT}`);
})