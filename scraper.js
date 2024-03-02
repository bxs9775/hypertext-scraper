// imports
const axios = require("axios");
const cheerio = require("cheerio");

let whitespace_regex = /\s\s+/g

// Scraper class
class Scraper{
    constructor(base_url,start_url,name){
        this.base_url = base_url;
        this.start_url = start_url;
        this.name = name;

        this.memo = {};
        this.page_stack = [start_url];
    }

    async run(){
        while(this.page_stack.length > 0){
            let next_page = this.page_stack.pop();
            console.log(next_page);
            let page_name = next_page.replace(this.base_url,'')
            console.log(`Scraping page - ${page_name}`);

            if(page_name in this.memo){
                console.log(`Page "${page_name}" already scraped`);
                continue;
            }

            // fetch page
            let page = await axios.get(next_page)

            // set up DOM
            let $ = cheerio.load(page.data)

            // scrape text
            //console.log("\nText");
            let text_arr = $('p, td').toArray().map((elem) => {
                let txt = $(elem).text().trim().replace(whitespace_regex,' ');
                return txt
            }).filter(txt => txt && txt.length > 0)
            console.log(text_arr)
            if(!text_arr || text_arr.length == 0){
                console.log($('body').text());
                text_arr = [$('body').text().trim().replace(whitespace_regex,' ')]
            }
            let text = text_arr
            console.log(text);
            this.memo[page_name] = text

            // get links
            $('a, area[href]').each((i,lnk) => {
                let url = $(lnk).attr("href");
                if(!(url.startsWith("https://") || url.startsWith("http://") || url.startsWith("mailto:"))){
                    this.page_stack.push(this.base_url+url);
                }
            });
            $('frame').each((i,lnk) => {
                let url = $(lnk).attr("src");
                if(!(url.startsWith("https://") || url.startsWith("http://") || url.startsWith("mailto:"))){
                    this.page_stack.push(this.base_url+url);
                }
            })
        }
        console.log(" --- Scrapping complete --- ");
    }

    get_report(){
        console.log("Generating report");
        let text_arr = Object.values(this.memo).flat();
        //console.log(text_arr);
        let words = text_arr.reduce((prev,str) => {
            //console.log(prev,str);
            prev.push(...str.split(" "));
            return prev;
        },[]);
        let unique_words = new Set(words);

        let text = text_arr.join("\n");
        return {
            details: {
                work: this.name,
                word_count: words.length,
                unique_word_count: unique_words.size
            },
            json: this.memo,
            text
        }
    }
}

module.exports = Scraper;