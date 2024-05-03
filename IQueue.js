/**
 * Queue interface based on https://gist.github.com/nfroidure/5472445
 */
class IQueue{
    constructor(...elements){
        this.elements = [...elements];
    }

    enqueue(...args){
        throw new Error();
    }

    dequeue(...args){
        throw new Error();
    }

    getLength(){
        return this.elements.length;
    }
}