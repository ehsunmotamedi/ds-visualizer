const Node = function (item) {
    this.item = item;
    this.height = 1;
    this.left = null;
    this.right = null;
}

//AVL Tree
const Tree = function () {
    let root = null;

    //return height of the node
    this.height = (N) => {
        if (N === null) {
            return 0;
        }

        return N.height;
    }

    //right rotate
    this.rightRotate = (y) => {
        let x = y.left;
        let T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        return x;
    }

    //left rotate
    this.leftRotate = (x) => {
        let y = x.right;
        let T2 = y.left;
        y.left = x;
        x.right = T2;
        x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
        y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
        return y;
    }

    // get balance factor of a node
    this.getBalanceFactor = (N) => {
        if (N == null) {
            return 0;
        }

        return this.height(N.left) - this.height(N.right);
    }


    // helper function to insert a node
    const insertNodeHelper = (node, item) => {

        // find the position and insert the node
        if (node === null) {
            return (new Node(item));
        }

        if (item < node.item) {
            node.left = insertNodeHelper(node.left, item);
        } else if (item > node.item) {
            node.right = insertNodeHelper(node.right, item);
        } else {
            return node;
        }

        // update the balance factor of each node
        // and, balance the tree
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));

        let balanceFactor = this.getBalanceFactor(node);

        if (balanceFactor > 1) {
            if (item < node.left.item) {
                return this.rightRotate(node);
            } else if (item > node.left.item) {
                node.left = this.leftRotate(node.left);
                return this.rightRotate(node);
            }
        }

        if (balanceFactor < -1) {
            if (item > node.right.item) {
                return this.leftRotate(node);
            } else if (item < node.right.item) {
                node.right = this.rightRotate(node.right);
                return this.leftRotate(node);
            }
        }

        return node;
    }

    // insert a node
    this.insert = (item) => {
        // console.log(root);
        root = insertNodeHelper(root, item);
    }

    //get node with minimum value
    this.nodeWithMimumValue = (node) => {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    // delete helper
    const deleteNodeHelper = (root, item) => {

        // find the node to be deleted and remove it
        if (root == null) {
            return root;
        }
        if (item < root.item) {
            root.left = deleteNodeHelper(root.left, item);
        } else if (item > root.item) {
            root.right = deleteNodeHelper(root.right, item);
        } else {
            if ((root.left === null) || (root.right === null)) {
                let temp = null;
                if (temp == root.left) {
                    temp = root.right;
                } else {
                    temp = root.left;
                }

                if (temp == null) {
                    temp = root;
                    root = null;
                } else {
                    root = temp;
                }
            } else {
                let temp = this.nodeWithMimumValue(root.right);
                root.item = temp.item;
                root.right = deleteNodeHelper(root.right, temp.item);
            }
        }
        if (root == null) {
            return root;
        }

        // Update the balance factor of each node and balance the tree
        root.height = Math.max(this.height(root.left), this.height(root.right)) + 1;

        let balanceFactor = this.getBalanceFactor(root);
        if (balanceFactor > 1) {
            if (this.getBalanceFactor(root.left) >= 0) {
                return this.rightRotate(root);
            } else {
                root.left = this.leftRotate(root.left);
                return this.rightRotate(root);
            }
        }
        if (balanceFactor < -1) {
            if (this.getBalanceFactor(root.right) <= 0) {
                return this.leftRotate(root);
            } else {
                root.right = this.rightRotate(root.right);
                return this.leftRotate(root);
            }
        }
        return root;
    }

    //delete a node
    this.deleteNode = (item) => {
        root = deleteNodeHelper(root, item);
    }

    // print the tree in pre - order
    this.preOrder = () => {
        preOrderHelper(root);
    }

    const preOrderHelper = (node) => {
        if (node) {
            console.log(node.item);
            preOrderHelper(node.left);
            preOrderHelper(node.right);
        }
    }

    //display functuion accepting p5
    this.display = (p5, width, height) => {
        displayHelper(p5, width, height);
    }

    //draw function as tree with p5 with lines and circles
    const displayHelper = (p5, canvasWidth, canvasHeight) => {
        let x = canvasWidth / 2;
        let y = 50;
        let level = 1;
        let levelHeight = 100;
        let radius = 20;

        let queue = [];


        let queueLevel = [];
        let queueX = [];
        let queueY = [];
        queue.push(root);
        queueLevel.push(level);
        queueX.push(x);
        queueY.push(y);
        while (queue.length > 0) {
            let node = queue.shift();
            let nodeLevel = queueLevel.shift();
            let nodeX = queueX.shift();
            let nodeY = queueY.shift();
            if (node.left) {
                p5.stroke(244);
                p5.line(nodeX, nodeY, nodeX - (canvasWidth / Math.pow(2, nodeLevel + 1)), nodeY + levelHeight);
            }
            if (node.right) {
                p5.stroke(244);
                p5.line(nodeX, nodeY, nodeX + (canvasWidth / Math.pow(2, nodeLevel + 1)), nodeY + levelHeight);
            }
            if (node.left) {
                queue.push(node.left);
                queueLevel.push(nodeLevel + 1);
                queueX.push(nodeX - (canvasWidth / Math.pow(2, nodeLevel + 1)));
                queueY.push(nodeY + levelHeight);
            }
            if (node.right) {
                queue.push(node.right);
                queueLevel.push(nodeLevel + 1);
                queueX.push(nodeX + (canvasWidth / Math.pow(2, nodeLevel + 1)));
                queueY.push(nodeY + levelHeight);
            }
            p5.stroke(0);
            p5.fill(244);
            p5.circle(nodeX, nodeY, radius * 2);
            p5.fill(0);
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.text(node.item, nodeX, nodeY);

        }

    }








}

module.exports = { Tree };