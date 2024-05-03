/**
 * Queue class based on https://gist.github.com/nfroidure/5472445
 */
class Queue extends IQueue{
    enqueue(...args){
        return this.elements.push(...args);
    }

    dequeue(...args){
        return this.elements.shift(...args);
    }
}