weightedGraph = function () {
    let width = 400,
    height = 400,
    node_radius = 5,
    text_size = "11px",
    text_x = 6, text_y = 3,
    selection,
    svg;
    

    function chart(selection) {
        let data = selection.datum();
        selection = selection;
        
        let links = data.links,
        nodes = data.nodes;

        svg = selection.append("svg")
            .attr("width", width)
            .attr("height", height);

        let linkStrengthScale = d3.scaleLog()
            .range([0, 0.5])
            .domain(d3.extent(links, d => d.weight));

        let color = () => {
            const scale = d3.scaleOrdinal(d3.schemeCategory10);
            return d => scale(d.group);
        };


        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id))//.strength(d => Math.sqrt(linkStrengthScale(d.weight))))
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide().radius(30))
            .force("center", d3.forceCenter(width/2, height/2))
            .on("tick", ticked);

        function ticked(e) {
            circles
                .attr("cx", function (d) { return d.x = Math.max(node_radius, Math.min(width - node_radius, d.x)); })
                .attr("cy", function (d) { return d.y = Math.max(node_radius, Math.min(height - node_radius, d.y)); });

            labels.attr("x", function (d) { return d.x = Math.min(width -text_x, d.x + text_x)})
                .attr("y", function (d) { return d.y = Math.min(height - text_y, d.y+ text_y)});

            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        };

        const link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", d => Math.sqrt(Math.sqrt(d.weight)));

        link.append("title")
            .text(d => d.weight);

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter().append("g")

        const labels = node.append("text")
            .attr("class", "label")
            .text(d => d.name)
            .attr('x', text_x)
            .attr('y', text_y)
            .style('fill', 'black')
            .style("font-size", "10px");

        var circles = node.append("circle")
            .attr("class", "cirles")
            .attr("r", node_radius);
        
        d3.select(selection.node())
            .call(d3.drag()
                .container(selection.node())
                .subject(dragsubject)
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        function dragsubject() {
            return simulation.find(d3.event.x, d3.event.y);
        }

        function dragstarted() {
            if (!d3.event.active) simulation.alphaTarget(0.1).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        }
    }

    chart.width = function(w) {
        if(!arguments.length) {
            return width;
        }
        else {
            width = w;
        }
        return chart;
    };

    chart.height = function (h) {
        if (!arguments.length) {
            return height;
        }
        else {
            height = h;
        }
        return chart;
    };

    chart.nodeRadius = function (radius) {
        if (!arguments.length) {
            return node_radius;
        }
        else {
            node_radius = radius;
        }
        return chart;
    };

    chart.textSize = function (size) {
        if (!arguments.length) {
            return text_size;
        }
        else {
            text_size = size;
        }
        return chart;
    };

    return chart;
}