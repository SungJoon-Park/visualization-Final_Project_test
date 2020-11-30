import DensityChart from './Density.js';
export default function BubbleChart(container) {
    const width = 1200,
        height = 600;
    const rScale = d3.scaleLinear()
        .range([4, 10])
        .clamp(true);
    const cScale = d3.scaleOrdinal(d3.schemeTableau10);
    const centerScale = d3.scalePoint().padding(1).range([0, width]);
    const forceStrength = 0.05;

    let svg = d3.select(".bubble").append("svg")
        .attr("width", width)
        .attr("height", height);


    // const drag = (simulation) => {
    //     function started(event) {
    //         if (!event.active) simulation.alpha(1).restart();
    //         event.subject.fx = event.subject.x;
    //         event.subject.fy = event.subject.y;
    //     }

    //     function dragged(event) {
    //         event.subject.fx = event.x;
    //         event.subject.fy = event.y;
    //     }

    //     function ended(event) {
    //         if (!event.active) simulation.alphaTarget(0.0);
    //         event.subject.fx = null;
    //         event.subject.fy = null;

    //     }
    //     return d3.drag()
    //         .on("start", started)
    //         .on("drag", dragged)
    //         .on("end", ended);
    // }




    function update(data) {
        //for color variations
        data.forEach(d => {
            let genre = d.Genres;

            if (genre == "Action" || genre == "Adventure" || genre == "Sci-Fi" || genre == "Fantasy") {
                d.category = "genre1";
            } else if (genre == "Comedy" || genre == "Talk-Show" || genre == "Game-Show") {
                d.category = "genre2";
            } else if (genre == "Biography" || genre == "Documentary") {
                d.category = "genre3";
            } else if (genre == "Horror" || genre == "Mystery" || genre == "Thriller" || genre == "Crime" || genre == "Film-Noir") {
                d.category = "genre4";
            } else if (genre == "Drama" || genre == "Family" || genre == "Animation") {
                d.category = "genre5";
            } else {
                d.category = "genre6";
            }
            if (d.Netflix == 1) d.platform = "Netflix";
            else if (d.Hulu == 1) d.platform = "Hulu";
            else if (d.Prime_Video == 1) d.platform = "Prime";
            else d.platform = "Disney";
        });
        rScale.domain(d3.extent(data, d => d.IMDb));

        data.forEach(function (d) {
            d.x = width / 2;
            d.y = height / 2;

        });
        let density = DensityChart(".density");

        function showCircles() {
            var circles = svg.selectAll("circle")
                .data(data)
                .join("circle")
                .attr("r", d => rScale(d.IMDb))
                .attr("cx", (d, i) => {
                    return 175 + 25 * i + 2 * i ** 2
                })
                .attr("cy", (d) => 250)
                .style("fill", (d, i) => {
                    return cScale(d.category)
                })
                // .style("stroke", "black")
                // .style("stroke-width", 1)
                .style("pointer-events", "all");
            // .call(drag(simulation));



            circles
                .on("mouseover", function (event, d) {
                    let xPosition =
                        parseFloat(d3.select(this).attr("cx"));
                    let yPosition =
                        parseFloat(d3.select(this).attr("cy"));

                    //Update the tooltip position and value
                    d3.select("#tooltip2")
                        .style("left", xPosition + "px")
                        .style("top", yPosition + "px")
                        .select("#title")
                        .text(d.Title);
                    d3.select("#tooltip2")
                        .style("left", xPosition + "px")
                        .style("top", yPosition + "px")
                        .select("#genre")
                        .text(d.Genres);
                    // Show the tooltip
                    d3.select("#tooltip2").classed("hidden", false);
                })
                .on("mouseout", function (d) {
                    //Hide the tooltip
                    d3.select("#tooltip2").classed("hidden", true);
                });

            circles.on("click", (event, d) => {

                density.update(data, d.category, cScale(d.category));
            });


            function ticked() {
                circles
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
            }
            simulation.on("tick", ticked);
        }

        const simulation = d3.forceSimulation(data)
            // .force('charge', d3.forceManyBody().strength(0))
            .force("y", d3.forceY().y(height / 2).strength(0.05))
            .force("x", d3.forceX().x(width / 2).strength(0.05))
            // .force('collision', d3.forceCollide().radius(d3.max(data, d => d.IMDb)).iterations(15))
            .force("collide", d3.forceCollide(d3.max(data, d => d.IMDb) * .8).iterations(15));
        // .force("charge", d3.forceManyBody().strength(5))

        // simulation
        //     .nodes(data)
        //     .on("tick", ticked);


        function hideTitles() {
            svg.selectAll('.title').remove();
        }

        // function showTitles(byVar, scale) {
        //     // Another way to do this would be to create
        //     // the year texts once and then just hide them.
        //     // let box = svg.selectAll('.title')
        //     //     .data(scale.domain())
        //     //     .join('rect')
        //     //     .attr('class', 'text box')
        //     //     .attr('x', (d) => scale(d)-80)
        //     //     .attr('y', 300)
        //     //     .attr('width',150)
        //     //     .attr('height',20)
        //     //     .attr('opacity',0.4);
        //     var titles = svg.selectAll('.title')
        //         .data(scale.domain())
        //         .join('text')
        //         .attr('class', 'title')
        //         .attr('x', (d) => scale(d))
        //         .attr('y', 300)
        //         .attr('text-anchor', 'middle')
        //         .style("font-size", 16)
        //         .style("font-weight", "bold")
        //         .html(d => {
        //             let genre_title;
        //             if (d === "genre1") {
        //                 // genre_title = "Action & Adventure & Sci-Fi & Fantasy"
        //                 genre_title = "Action & Adventure"
        //             } else if (d === "genre2") {
        //                 // genre_title = "Comedy & Talk-Show & Game-Show & Reality-TV"
        //                 genre_title = "Comedy & Shows"
        //             } else if (d === "genre3") {
        //                 genre_title = "Bio & Documentary"
        //             } else if (d === "genre4") {
        //                 genre_title = "Horror & Crime"
        //             } else if (d === "genre5") {
        //                 genre_title = "Drama & Family & Animation"
        //             } else {
        //                 genre_title = "Others"
        //             }
        //             return genre_title;
        //         });

        //     titles.exit().remove()
        // }
        function showTitles(byVar, scale) {

            var titles = svg.selectAll('.title')
                .data(scale.domain());

            titles.enter().append('text')
                .attr('class', 'title')
                .merge(titles)
                .attr('x', (d) => scale(d))
                .attr('y', 100)
                .attr('text-anchor', 'middle')
                .style('font-weight', 'bold')
                .text((d) => {
                    let genre_title;
                    if (d === "genre1") {
                        // genre_title = "Action & Adventure & Sci-Fi & Fantasy"
                        return "Action & Adventure"
                    } else if (d === "genre2") {
                        // genre_title = "Comedy & Talk-Show & Game-Show & Reality-TV"
                        return "Comedy & Shows"
                    } else if (d === "genre3") {
                        return "Bio & Documentary"
                    } else if (d === "genre4") {
                        return "Horror & Crime"
                    } else if (d === "genre5") {
                        return "Drama & Family & Animation"
                    } else if (d === "genre6") {
                        return "Others"
                    }
                    return byVar + ' ' + d;
                });
            titles.on("click", (event, d) => {
                d3.event.stopPropagation();

                density.update(data, d.category, cScale(d.category));
            });
            titles.exit().remove();
        }
        let comments = svg
            .append('text')
            .attr('class', 'comments')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text("Click on the button to see the bubbles!");
        comments.exit().remove();

        function hideComments() {
            comments.remove();
        }

        function splitBubbles(byVar) {

            // if (byVar === "All") {
            //     showTitles(byVar, centerScale);
            //     simulation.force("x", d3.forceX().x(w / 2));
            // } 
            if (byVar === "Genre") {

                hideComments();
                showCircles();
                const category_map = data.map((d) => d.category);
                category_map.sort();

                centerScale.domain(category_map);
                showTitles(byVar, centerScale);
                // @v4 Reset the 'x' force to draw the bubbles to their year centers
                simulation.force('x', d3.forceX().strength(forceStrength).x((d) => centerScale(d.category)));
            } else if (byVar === "Platform") {
                hideComments();
                showCircles();
                const platform_map = data.map((d) => d.platform);
                platform_map.sort();
                centerScale.domain(platform_map);
                showTitles(byVar, centerScale);
                simulation.force('x', d3.forceX().strength(forceStrength).x((d) => centerScale(d.platform)));

            }

            // @v4 We can reset the alpha value and restart the simulation
            simulation.alpha(2).restart();

        }

        function setupButtons() {
            d3.selectAll('.button')
                .on('click', function () {

                    // Remove active class from all buttons
                    d3.selectAll('.button').classed('active', false);
                    // Find the button just clicked
                    var button = d3.select(this);

                    // Set it as the active button
                    button.classed('active', true);

                    // Get the id of the button
                    var buttonId = button.attr('id');

                    console.log(buttonId)
                    // Toggle the bubble chart based on
                    // the currently clicked button.
                    splitBubbles(buttonId);
                });
        }

        setupButtons();
    }
    return {
        update,
    };



}