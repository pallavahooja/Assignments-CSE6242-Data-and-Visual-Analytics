// this function should be called once the data from files have been read
// world: topojson from world_countries.json
// gameData: data from ratings-by-country.csv

function ready(error, world, gameData) {
    // enter code to extract all unique games from gameData
    var games = [...new Set(gameData.map(item => item.Game))].sort();

    // enter code to append the game options to the dropdown
    d3.select("#games")
        .selectAll("options")
        .data(games).enter()
        .append("option")
        .text(function (d) {
            return d;
        }).attr("value", function (d) {
            return d;
        });

    // event listener for the dropdown.
    // Update choropleth and legend when selection changes.
    // Call createMapAndLegend() with required arguments.
    d3.select("#games").on("change", function (d) {
        createMapAndLegend(world, gameData, d3.select(this).property("value"));
    });

    // create Choropleth with default option. Call createMapAndLegend() with required arguments.
    createMapAndLegend(world, gameData, games[0]);

    svg.append('path')
        .datum(topojson.mesh(world.features, (a, b) => a.id !== b.id))
        .attr('class', 'names')
        .attr('d', path);

}

// this function should create a Choropleth and legend using the world and gameData arguments for a selectedGame
// also use this function to update Choropleth and legend when a different game is selected from the dropdown
function createMapAndLegend(world, gameData, selectedGame) {
    var ratingsData = {};
    var ratings = [];

    gameData.forEach(d => d["Average Rating"] = +d["Average Rating"]);
    gameData.forEach(function (d) {
        if (d.Game === selectedGame) ratings.push(d["Average Rating"])
    });

    var color = d3.scaleQuantile()
        .range(colors)
        .domain(ratings);

    var legend = d3.legendColor()
        .labelFormat(d3.format(".2f"))
        .scale(color);

    var div = d3.select("body")
        .selectAll("#legend")
        .attr("class", "column");

    div.html("");

    var legSvg = div.append("svg")
        .attr("transform", "translate(20, 10)");

    legSvg.append("g")
        .attr("class", "legend")
        .call(legend);

    gameData.forEach(function (d) {
        if (d.Game === selectedGame) ratingsData[d.Country] = d;
    });

    world.features.forEach(d => ratingsData[d.properties.name] = ratingsData[d.properties.name] || {"Average Rating": 0});
    world.features.forEach(d => d.ratings_data = ratingsData[d.properties.name] || {"Average Rating": 0});

    svg.append("g").attr("class", "countries").selectAll("path")
        .data(world.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style("fill", function (d) {
            if (ratingsData[d.properties.name]["Average Rating"] === 0) return "gray";
            return color(ratingsData[d.properties.name]["Average Rating"]);
        })
    .style("stroke", "white")
    .on('mouseover', function (d) {
        var rating = ratingsData[d.properties.name]["Average Rating"];
        d.rating =  rating > 0? rating: "NA";
        d.users = ratingsData[d.properties.name]["Number of Users"] || "NA";
        d.game = selectedGame;
        tip.show(d);
        d3.select(this)
            .style('stroke-width', 2);
    }).on('mouseout', function (d) {
            tip.hide(d);
            d3.select(this)
                .style('stroke-width', 0.3);
    });
}
