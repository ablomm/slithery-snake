/*
Copyright 2020 Andrew Blommestyn. All Rights Reserved
andrewblommestyn.com
*/

//node class used for linked list
class Node {
    constructor(element) {
        this.element = element;
        this.next = null;
    }
}

class SinglyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    //add element at the end
    add(element) {
        let node = new Node(element);

        if (this.tail === null) { //if it's the first element
            this.head = node;
        } else {
            this.tail.next = node;
        }

        this.tail = node;
        this.length++;
    }

    //removes element at the head and returns it
    removeFirst(element) {
        if (this.head == null) { //if there is no elements to pop
            return undefined;
        }

        let deletedElement = this.head.element;
        this.head = this.head.next;
        this.length--;
        return deletedElement;
    }

    //iterator to be used in for each loops
    *[Symbol.iterator]() {
        let current = this.head;
        while (current != null) {
            yield current.element;
            current = current.next;
        }
    }
}