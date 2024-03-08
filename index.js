// imports
const yargs = require("yargs");
const Scraper = require("./scraper");
const IOHelper = require("./ioHelper");

async function main(){
    // Check args
    const { argv } = yargs(process.argv);
    if(!argv.base_url){
        console.error("base url not provided");
        process.exit(1);
    }
    if(!argv.start_page){
        console.error("start page not provided");
        process.exit(1);
    }
    if(!argv.name){
        console.error("name not provided");
        process.exit(1);
    }

    // initialize and start scraper
    let scraper = new Scraper(argv.base_url,argv.start_page,argv.name);
    await scraper.run()

    // get report
    let report = scraper.get_report();

    // create output files
    let ioHelper = new IOHelper(argv.name);
    ioHelper.saveResults(report);
}

main();