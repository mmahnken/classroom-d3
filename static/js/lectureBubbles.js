function makeGraph() {
    d3.json("FIXME", function(data) {
        // FIXME

        function makeLegend(nodes){
            // FIXME
        }

        //makeLegend(node);


    });

}

function scrub(root){
    var newData = [];
    if (root.children){
        root.children.forEach(function(child) {
            child.value = child.id;
            newData.push(child);
        });
    }
    return {children: newData};
}

makeGraph();