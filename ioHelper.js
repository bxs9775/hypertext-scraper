var fs = require("fs");

class IOHelper{
    constructor(folderName){
        this.folderName = folderName
    }

    saveResults(report){
        let folderPath = `.\\results\\${this.folderName}`
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // create text file
        fs.writeFileSync(`${folderPath}\\${this.folderName}.txt`,report.text);

        // create json file
        fs.writeFileSync(`${folderPath}\\${this.folderName}.json`,JSON.stringify(report.json));

        // create overall details file
        fs.writeFileSync(`${folderPath}\\${this.folderName}_details.json`,JSON.stringify(report.details));
    }
}

module.exports = IOHelper;