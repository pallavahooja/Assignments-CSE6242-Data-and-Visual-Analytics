function init() {
    var margin = 150; //equal margins on all sides
    var width = window.screen.width - 2 * margin;
    var height = 700 - 2 * margin;

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var yLog = d3.scaleLog().clamp(true).range([height, 0]);
    var ySqrt = d3.scaleSqrt().range([height, 0]);

    var timeParser = d3.timeFormat("%b %Y");
    var dateParse = d3.timeParse("%Y-%m-%d");
    var legends = ['Catan', 'Dominion',
        'Codenames', 'Terraforming Mars',
        'Gloomhaven', 'Magic: The Gathering',
        'Dixit', 'Monopoly'];

    function lineGraphs(i) {
        return d3.line().x(function (d) {
            return x(dateParse(d.date));
        }).y(function (d) {
            return y(+d[legends[i]])
        });
    }

    function lineGraphsLog(i) {
        return d3.line().x(function (d) {
            return x(dateParse(d.date));
        }).y(function (d) {
            return yLog(+d[legends[i]])
        });
    }

    function lineGraphsSqrt(i) {
        return d3.line().x(function (d) {
            return x(dateParse(d.date));
        }).y(function (d) {
            return ySqrt(+d[legends[i]])
        });
    }

    var svgFig1 = d3.select("body")
        .append("svg")
        .attr("class", "fig1")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");
    d3.select("body").append("div").attr("class", "pagebreak");

    var svgFig2 = d3.select("body")
        .append("svg")
        .attr("class", "fig1")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");
    d3.select("body").append("div").attr("class", "pagebreak");


    var svgFig4 = d3.select("body")
        .append("svg")
        .attr("class", "fig1")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");
    d3.select("body").append("div").attr("class", "pagebreak");


    var svgFig3 = d3.select("body")
        .append("svg")
        .attr("class", "fig1")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");
    d3.select("body").append("div").attr("class", "pagebreak");
    svgFig3.append("text")
        .attr("x", width - 250)
        .attr("y", height + 100)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("psrinivasan48");

    d3.dsv(",", "boardgame_ratings.csv", function (d) {
        var obj = {
            month: timeParser(new Date(d.date)),
            date: d.date
        };
        for (var i in legends) {
            obj[legends[i]] = +d[legends[i] + "=count"];
            obj[legends[i] + '=rank'] = +d[legends[i] + "=rank"];
        }
        return obj;
    }).then(function (data) {
        var minMax = findMinMax(data);
        var min = minMax[0], max = minMax[1];
        x.domain(d3.extent(data, function (d) {
            return dateParse(d.date);
        }));
        y.domain([min, max]);
        yLog.domain([min, max]);
        ySqrt.domain([min, max]);

        for (var i in legends) {
            var lg = lineGraphs(i);
            var lgLog = lineGraphsLog(i);
            var lgSqrt = lineGraphsSqrt(i);
            svgFig1.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", lg)
                .style("stroke", d3.schemeCategory10[i])
                .append("text")
                .text(legends[i]);
            svgFig1.append("text")
                .attr("transform", "translate(" + (width + 10) + "," +
                    y(data[data.length - 1][legends[i]]) + ")")
                .attr("text-anchor", "start")
                .style("fill", d3.schemeCategory10[i])
                .text(legends[i]);
            svgFig2.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", lg)
                .style("stroke", d3.schemeCategory10[i])
                .append("text")
                .text(legends[i]);
            svgFig2.append("text")
                .attr("transform", "translate(" + (width + 10) + "," +
                    y(data[data.length - 1][legends[i]]) + ")")
                .attr("text-anchor", "start")
                .style("fill", d3.schemeCategory10[i])
                .text(legends[i]);
            svgFig3.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", lgLog)
                .style("stroke", d3.schemeCategory10[i])
                .append("text")
                .text(legends[i]);
            svgFig3.append("text")
                .attr("transform", "translate(" + (width + 10) + "," +
                    yLog(data[data.length - 1][legends[i]]) + ")")
                .attr("text-anchor", "start")
                .style("fill", d3.schemeCategory10[i])
                .text(legends[i]);
            svgFig4.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", lgSqrt)
                .style("stroke", d3.schemeCategory10[i])
                .append("text")
                .text(legends[i]);
            svgFig4.append("text")
                .attr("transform", "translate(" + (width + 10) + "," +
                    ySqrt(data[data.length - 1][legends[i]]) + ")")
                .attr("text-anchor", "start")
                .style("fill", d3.schemeCategory10[i])
                .text(legends[i]);
            if (["Catan", "Codenames", "Terraforming Mars", "Gloomhaven"].includes(legends[i])) {
                svgFig2.selectAll("circles")
                    .data(data)
                    .enter()
                    .append("circle")
                    .filter(function(d, iter){
                        return iter%3===2;
                    })
                    .attr("fill", d3.schemeCategory10[i])
                    .attr("cx", function (d) {
                        return x(dateParse(d.date))
                    })
                    .attr("cy", function (d) {
                        return y(d[legends[i]])
                    })
                    .attr("r", 10);
                svgFig2.selectAll("circles")
                    .data(data)
                    .enter()
                    .filter(function(d, iter){
                        return iter%3===2;
                    })
                    .append("text")
                    .attr("class", "count-font")
                    .text(function (d) {
                        return d[legends[i] + "=rank"];
                    }).attr("x", function (d) {
                        return x(dateParse(d.date)) - 5;
                    }).attr("y", function (d) {
                        return y(d[legends[i]]) + 5
                    });
                svgFig3.selectAll("circles")
                    .data(data)
                    .enter()
                    .filter(function(d, iter){
                        return iter%3===2;
                    })
                    .append("circle")
                    .attr("fill", d3.schemeCategory10[i])
                    .attr("cx", function (d) {
                        return x(dateParse(d.date))
                    })
                    .attr("cy", function (d) {
                        return yLog(d[legends[i]])
                    })
                    .attr("r", 10);
                svgFig3.selectAll("circles")
                    .data(data)
                    .enter()
                    .filter(function(d, iter){
                        return iter%3===2;
                    })
                    .append("text")
                    .attr("class", "count-font")
                    .text(function (d) {
                        return d[legends[i] + "=rank"];
                    }).attr("x", function (d) {
                        return x(dateParse(d.date)) - 5;
                    }).attr("y", function (d) {
                        return yLog(d[legends[i]]) + 5
                    });
                svgFig4.selectAll("circles")
                    .data(data)
                    .enter()
                    .filter(function(d, iter){
                        return iter%3===2;
                    })
                    .append("circle")
                    .attr("fill", d3.schemeCategory10[i])
                    .attr("cx", function (d) {
                        return x(dateParse(d.date))
                    })
                    .attr("cy", function (d) {
                        return ySqrt(d[legends[i]])
                    })
                    .attr("r", 10);
                svgFig4.selectAll("circles")
                    .data(data)
                    .enter()
                    .filter(function(d, iter){
                        return iter%3===2;
                    })
                    .append("text")
                    .attr("class", "count-font")
                    .text(function (d) {
                        return d[legends[i] + "=rank"];
                    }).attr("x", function (d) {
                        return x(dateParse(d.date)) - 5;
                    }).attr("y", function (d) {
                        return ySqrt(d[legends[i]]) + 5
                    });
            }

        }
        svgFig2.append("circle")
            .attr("fill", "black")
            .attr("transform", "translate(" + (width + 20) + "," +
                (height - 30) + ")")
            .attr("r", 10);
        svgFig2.append("text")
            .attr("class", "count-font")
            .attr("transform", "translate(" + (width + 10) + "," +
                (height - 27) + ")").text("RANK");
        svgFig2.append("text")
            .attr("transform", "translate(" + (width - 30) + "," +
                (height - 10) + ")").text("BoardGameGeek Rank");
        svgFig3.append("circle")
            .attr("fill", "black")
            .attr("transform", "translate(" + (width + 20) + "," +
                (height - 30) + ")")
            .attr("r", 10);
        svgFig3.append("text")
            .attr("class", "count-font")
            .attr("transform", "translate(" + (width + 10) + "," +
                (height - 27) + ")").text("RANK");
        svgFig3.append("text")
            .attr("transform", "translate(" + (width - 30) + "," +
                (height - 10) + ")").text("BoardGameGeek Rank");
        svgFig4.append("circle")
            .attr("fill", "black")
            .attr("transform", "translate(" + (width + 20) + "," +
                (height - 30) + ")")
            .attr("r", 10);
        svgFig4.append("text")
            .attr("class", "count-font")
            .attr("transform", "translate(" + (width + 10) + "," +
                (height - 27) + ")").text("RANK");
        svgFig4.append("text")
            .attr("transform", "translate(" + (width - 30) + "," +
                (height - 10) + ")").text("BoardGameGeek Rank");

        svgFig1.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

        svgFig1.append("g")
            .call(d3.axisLeft(y));
        svgFig2.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

        svgFig2.append("g")
            .call(d3.axisLeft(y));

        svgFig3.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

        svgFig3.append("g")
            .call(d3.axisLeft(yLog));

        svgFig4.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

        svgFig4.append("g")
            .call(d3.axisLeft(ySqrt));

        function findMinMax(data) {
            var min = Number.POSITIVE_INFINITY;
            var max = Number.NEGATIVE_INFINITY;
            for (var j in data) {
                var datum = data[j];
                for (var i in legends) {
                    if (datum[legends[i]] < min) min = datum[legends[i]];
                    if (datum[legends[i]] > max) max = datum[legends[i]];
                }
            }
            return [min, max];
        }

        svgFig1.append("text")
            .attr("transform", "translate(" + width / 2 + " ," + (height + 30) + ")")
            .style("text-anchor", "middle")
            .text("Month");

        svgFig1.append("text")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Number of Ratings");

        svgFig1.append("text")
            .attr("x", (width / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Number of Ratings 2016-2020");


        svgFig2.append("text")
            .attr("transform", "translate(" + width / 2 + " ," + (height + 30) + ")")
            .style("text-anchor", "middle")
            .text("Month");

        svgFig2.append("text")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Number of Ratings");
        svgFig2.append("text")
            .attr("x", (width / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Number of Ratings 2016-2020 with Rankings");
        svgFig3.append("text")
            .attr("transform", "translate(" + width / 2 + " ," + (height + 30) + ")")
            .style("text-anchor", "middle")
            .text("Month");

        svgFig3.append("text")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Number of Ratings");
        svgFig3.append("text")
            .attr("x", (width / 2))
            .attr("y", -5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Number of Ratings 2016-2020 with Rankings (Log Scale)");

        svgFig4.append("text")
            .attr("transform", "translate(" + width / 2 + " ," + (height + 30) + ")")
            .style("text-anchor", "middle")
            .text("Month");

        svgFig4.append("text")
            .attr("y", -50)
            .attr("x", -height / 2)
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Number of Ratings");
        svgFig4.append("text")
            .attr("x", (width / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Number of Ratings 2016-2020 with Rankings (Square Root Scale)");

    }).catch(function (error) {
        console.log(error);
    });
}