const {DirectedGraph} = require("@datastructures-js/graph");

class CustomDirectedGraph extends DirectedGraph{
    constructor(graph=null){
        super();
        if(graph){
            let {vertices, edges} = graph;
            for(let node of vertices){
                this.addVertex(node,true)
            }
            for(let edge of edges){
                this.addEdge(...edge)
            }
        }
    }

    findAllPaths(srcKey,abortCb) {
        const traverseGraphRecursive = (key, visited, memo) => {
          console.log(`\nFinding paths through ${key}`);
          if(!this.hasVertex(key) || (abortCb && abortCb())){
            console.log(`Key ${key} not in graph, returning empty list`);
            return []
          }
          if (memo.has(key)) {
            console.log(`Returning memoized results for ${key}`);
            return memo.get(key);
          }
          if(visited.has(key)){
            console.log(`${key} already visited, return node`);
            memo.set(key,[[key]]);
            return memo.get(key);
          }
          visited.add(key);

          let results = []
          this._edges.get(key).forEach((_, destKey) => {
            let paths = traverseGraphRecursive(destKey, new Set(visited), memo).map(path => [key,...path])
            results = results.concat(paths)
          });
          if(results.length == 0){
            results = [[key]]
          }
          memo.set(key,results);
          return results
        };

        let visited = new Set();
        let memo = new Map();
        return traverseGraphRecursive(srcKey,visited,memo);
    }

    
}

module.exports = CustomDirectedGraph;