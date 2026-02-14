import { rejects } from "node:assert";
import { exec } from "node:child_process";
import { resolve } from "node:dns";
import fs from 'fs'
import path from "path";
import { dirname } from "node:path";
import { stderr, stdout } from "node:process";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); // returns the absolute path Ex: /home/farhan-khan/code/project/backend/generatefile.js
const __dirname = path.dirname(__filename); // removes the filename (generatefile.js) & returns the folder path


const outputFiles = path.join(__dirname, "outputs")
if (!fs.existsSync(outputFiles)) {
    fs.mkdirSync(outputFiles, { recursive: true });
}



const executePy = (filePath) => {
    // "filePath": "/home/farhan-khan/code/my-online-code-cpmpiler/online-code-compiler/backend/compiler-files/1770290509111.py"
    // basename of filepath : 1770290509111.py

    // const fileId = path.basename(filePath).split(".")[0];
    // console.log(fileId);
    // const outPath = path.join(outputFiles, `${fileId}.out`)

    return new Promise((resolve, reject) => {
        try {
            exec(`python3 ${filePath}`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error("full error : ", stderr || error.message)
                        let err = stderr;
                        let customErr = err.split(",")[1];
                        console.log("custom ERROR : -----> ", customErr)

                        return resolve("Error : " + customErr)
                    }
                    if (stderr) {
                        console.error(stderr)
                        return resolve(stderr)
                    }
                    resolve(stdout);
                }
            )
        } catch (error) {
            console.log(error)
        }
    })
}

export default executePy