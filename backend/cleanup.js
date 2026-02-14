import cron from 'node-cron'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compilerFolder = path.join(__dirname, "compiler-files");
const outputFolder = path.join(__dirname, "outputs");

function cleanFolders(folderPath){
    if(fs.existsSync(folderPath)){
        fs.rmSync(folderPath, {recursive: true, force: true});
    }
    fs.mkdirSync(folderPath, {recursive: true});
}

cron.schedule("*/10 * * * *", () => {
    console.log("Clearing the compiler folders....!");
    cleanFolders(compilerFolder);
    cleanFolders(outputFolder);
})