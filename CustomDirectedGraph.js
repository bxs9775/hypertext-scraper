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

    findDfsPaths(srcKey,abortCb) {
        const traverseDfsRecursive = (key, visited = new Set()) => {
          if (!this.hasVertex(key) || visited.has(key) || (abortCb && abortCb())) {
            return [];
          }
          visited.add(key);

          let results = []
          this._edges.get(key).forEach((weight, destKey) => {
            let paths = traverseDfsRecursive(destKey, visited).map(path => [key,...path])
            results = results.concat(paths)
          });
          if(results.length > 0){
            return results;
          } else {
            return [[key]]
          }
        };

        return traverseDfsRecursive(srcKey);
    }

    
}

module.exports = CustomDirectedGraph;