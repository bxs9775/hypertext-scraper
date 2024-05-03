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
}

module.exports = CustomDirectedGraph;