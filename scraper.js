// imports
const axios = require("axios");
const cheerio = require("cheerio");
const CustomDirectedGraph = require("./CustomDirectedGraph");

let whitespace_regex = /\s\s+/g


// Scraper class
class Scraper{
    constructor(base_url,start_page,name){
        this.base_url = base_url;
        this.start_page = start_page;

        this.name = name;

        this.graph = new CustomDirectedGraph();
        this.text_json = {};
    }

    async build_vertex(page_name){
        console.log(`Scraping page - ${page_name}`);

        // check if vertex already exists
        if(this.graph.hasVertex(page_name)){
            console.log(`Page "${page_name}" already scraped`);
            return;
        }
        // fetch page
        let page = await axios.get(this.base_url+page_name);

        // set up DOM
        let $ = cheerio.load(page.data);

        // scrape text
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

        // add vertex to graph
        this.graph.addVertex(page_name,true)
        this.text_json[page_name] = text;

        // add links
        let links = [...$('a, area[href]').map((i,link) => $(link).attr("href")),...$('frame').map((i,link) => $(link).attr("src"))];
        for(let link of links){
            if(!(link.startsWith("https://") || link.startsWith("http://") || link.startsWith("mailto:"))){
                await this.build_vertex(link);
                this.graph.addEdge(page_name,link)
            }
        }
    }

    async run(){
        await this.build_vertex(this.start_page);
        
        console.log(" --- Scrapping complete --- ");
    }

    get_report(){
        console.log("Generating report");
        let text_arr = Object.values(this.text_json).flat();
        let words = text_arr.reduce((prev,str) => {
            prev.push(...str.split(" "));
            return prev;
        },[]);
        let unique_words = new Set(words);
        let text = text_arr.join("\n");
        
        let edges = [];
        for(let entry of this.graph._edges.entries()){
            let edge_set = Array.from(entry[1].keys());
            edges = [...edges,...edge_set.map(value => [entry[0],value])];
        }

        let graph_json = {
            vertices: Array.from(this.graph._vertices.keys()),
            edges: edges
        };

        let paths = this.graph.findDfsPaths(this.start_page);
        return {
            details: {
                work: this.name,
                word_count: words.length,
                unique_word_count: unique_words.size,
                graph: graph_json,
                paths: paths
            },
            json: this.text_json,
            text
        }
    }
}

module.exports = Scraper;