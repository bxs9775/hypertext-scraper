/**
 * Stack class based on https://gist.github.com/nfroidure/5472493
 */
class Stack extends IQueue{
    enqueue(...args){
        return this.elements.push(...args);
    }

    dequeue(...args){
        return this.elements.pop(...args);
    }
}