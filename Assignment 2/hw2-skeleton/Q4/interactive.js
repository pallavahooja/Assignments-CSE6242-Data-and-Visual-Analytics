function init(){
     var margin = 50; //equal margins on all sides
    var width = 700 - 2 * margin;
    var height = 500 - 2 * margin;

    var widthb = 800 - 2 * margin;
    var heightb = 250 - 2 * margin;

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var xb = d3.scaleLinear().range([0, widthb]);
    var yb = d3.scaleBand().range([heightb, 0]);

    var svgFig = d3.select("#container")
        .append("svg")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    var barPlot = d3.select("#barplot")
        .append("svg")
        .attr("width", widthb + 2 * margin)
        .attr("height", heightb + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + (2*margin) + "," + margin + ")")
        .attr("id", "barsvg");

    d3.dsv(",", "average-rating.csv", function (d) {
        return d;
    }).then(function (data) {
        var yearwiseData = {};
        var max = Number.NEGATIVE_INFINITY;
        var min = Number.POSITIVE_INFINITY;
        data.forEach(function (d) {
            var yearData = yearwiseData[d.year] || {};
            yearData.count = yearData.count || {};
            var rating = Math.floor(+d.average_rating);
            yearData.count[rating] =
                (yearData.count[rating] || 0) + 1;
            if (yearData.count[rating] > max) max = yearData.count[rating];
            if (yearData.count[rating] < min) min = yearData.count[rating];
            yearwiseData[d.year] = yearData;
        });
        x.domain([1, 10]);
        y.domain([min, max]);
        var i = 0;
        var years = [];
        var colors = [];
        for (var year in yearwiseData) {
            if (+year < 2015 || +year > 2019) continue;
            console.log(year);
            var yearData = yearwiseData[year].count;

            var countData = [];
            for (var j = 1; j <= 10; j++)
                yearData[j] = yearData[j] || 0;


            for (var count in yearData)
                countData.push({
                    "count": +count,
                    "value": yearData[+count]
                });

            var lg = d3.line().x(function (d) {
                return x(d.count);
            }).y(function (d) {
                return y(d.value)
            });

            svgFig.append("path")
                .data([countData])
                .attr("class", "line")
                .attr("d", lg)
                .style("stroke", d3.schemeCategory10[i]);

            svgFig.selectAll("circles")
                .data(countData)
                .enter()
                .append("circle")
                .attr("fill", d3.schemeCategory10[i])
                .attr("cx", function (d) {
                    return x(d.count)
                })
                .attr("data-year", year)
                .attr("data-count", d => d.value)
                .attr("cy", function (d) {
                    return y(d.value)
                })
                .attr("r", 4)
                .on('mouseover', function (d) {
                    d3.select(this).attr("r", 8);
                    var year = d3.select(this).attr("data-year");
                    if(+d.value > 0){
                        var ccol = d3.select(this).attr("fill");

                        plotHorizontalBarChart(year, d.count, data, ccol);
                    }
                }).on('mouseout', function (d) {
                    d3.select(this).attr("r", 4);
                    d3.select("#barsvg").html("");
                });
            years.push(year);
            colors.push(d3.schemeCategory10[i]);
            i++;
        }


        svgFig.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svgFig.append("g")
            .call(d3.axisLeft(y));

        var color = d3.scaleOrdinal()
            .domain(years).range(colors);
        var legend = d3.legendColor()
            .scale(color);
        var legSvg = d3.selectAll("#legend").append("svg")
            .attr("transform", "translate(20, 10)");

        legSvg.append("g")
            .attr("class", "legend")
            .call(legend);

        svgFig.append("text")
            .attr("x", (width / 2))
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Board Games by Rating (2015-2019)");

        svgFig.append("text")
            .attr("x", width/2)
            .attr("y", -25)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .text("psrinivasan48")
            .attr("fill", "blue");


        svgFig.append("text")
            .attr("transform", "translate(" + width / 2 + " ," + (height + 30) + ")")
            .style("text-anchor", "middle")
            .text("Rating");

        svgFig.append("text")
            .attr("y", -30)
            .attr("x", -height / 2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Count");
    }).catch(function (error) {
        console.log(error);
    });

    function plotHorizontalBarChart(year, average_rating, data, ccol) {
        var gameData = [];
        var max = Number.NEGATIVE_INFINITY;
        data.forEach(function (d) {
            if (d.year === year && Math.floor(+d.average_rating) == average_rating) {
                gameData.push({
                    "name": d.name.substring(0, 10),
                    "count": +d.users_rated
                });
                if (+d.users_rated > max) max = +d.users_rated;
            }
        });
        gameData = gameData.sort(function (a, b) {
            return d3.ascending(+a.count, +b.count);
        });

        gameData = gameData.slice(gameData.length-5, gameData.length);
        console.log(gameData);
        xb.domain([0, max]);
        yb.domain(gameData.map(function (d) {
            return d.name;
        })).padding(.2);
        barPlot.selectAll("myRect")
            .data(gameData)
            .enter()
            .append("rect")
            .attr("x", xb(0))
            .attr("y", function (d) {
                return yb(d.name);
            })
            .attr("width", function (d) {
                return xb(d.count);
            })
            .attr("height", yb.bandwidth())
            .attr("fill", ccol);
        barPlot.append("g")
            .call(d3.axisLeft(yb));
        barPlot.append("g")
            .attr("transform", "translate(0," + heightb + ")")
            .call(d3.axisBottom(xb));
        barPlot.append("text")
            .attr("x", (widthb / 2))
            .attr("y", -15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Top 5 Board Games of "+year+" with Rating "+average_rating);

        barPlot.append("text")
            .attr("transform", "translate(" + widthb / 2 + " ," + (heightb + 30) + ")")
            .style("text-anchor", "middle")
            .text("Number of Users");

        barPlot.append("text")
            .attr("y", -80)
            .attr("x", -heightb / 2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Games");
    }
}