import fs from 'fs'
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // returns the absolute path Ex: /home/farhan-khan/code/project/backend/generatefile.js
const __dirname = path.dirname(__filename); // removes the filename (generatefile.js) & returns the folder path

const dirFiles = path.join(__dirname, "compiler-files");

if(!fs.existsSync(dirFiles)){
    fs.mkdirSync(dirFiles, {recursive: true});
}

const generatefile = async (format, content) => {
    const fileId = Date.now();
    console.log("date id ",fileId);
    const fileName = `${fileId}.${format}`
    const filePath = path.join(dirFiles, fileName)
    console.log("filePath->path.join: ", filePath)
    fs.writeFileSync(filePath, content);
    return filePath;
}

export default generatefile