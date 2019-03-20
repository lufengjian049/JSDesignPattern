const tree = [
    {
        name: 'tree1',
        position: 1,
        childs: [
            {
                name: 'leaf1',
                position: 2,
                childs: [
                    {
                        name: 'leaf-leaf2',
                        position: 3
                    }
                ]
            },{
                name: 'leaf2',
                position: 6
            }
        ]
    },
    {
        name: 'tree2',
        position: 4,
        childs: [
            {
                name: '2-leaf1',
                position: 5
            }
        ]
    }
];
// const result = [];
function treeLeaf(tree,path = [],result = []) {
    tree.forEach(item => {
        if(item.childs) {
            path.push(item.position);
            treeLeaf(item.childs,path,result);
            path.pop();
        }else{
            result.push({
                ...item,
                position: [].slice.call(path)
            })
        }
    })
    return result;
}

console.log(treeLeaf(tree));