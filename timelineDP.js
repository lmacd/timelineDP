d3.json("timelineSettings.json", function(data1) { //data1 is the timeline settings
    d3.json("timelineDP.json", function(data2) { //data2 is the timeline contents

        var event;
        var closeEvent;
        var closeEventCircle;
        var eventImage;
        var dText;
        var date;
        var dateBox;
        var eventId;
        var eventHeight = 300;
        var eventOffset = 150;
        var dy;
        var i = 0; //counter for computing true months

var dates = data2.map(function(d){return d.eDate;});

var urls = data2.map(function(d) {
            return d.image_url;
        }); //creates array of image urls
        var descriptions = data2.map(function(d) {
            return d.description;
        }); //creates array of event descriptions

        var dataL = data2.length; //returns number of timeline events

        var minDate = getDate(data2[0]);
        var maxDate = getDate(data2[data2.length - 1]);

        var x = d3.time.scale().domain([minDate, maxDate]).range([40, 560]);

        var revert = true;


        var canvas = d3.select("body")
                .append("svg")
                .attr("width", 600)
                .attr("height", 450)
                .attr("id", "canvas")
                .style("position", "fixed")
                ;

        var viewbox = canvas.append("rect")
                .data(data1)
                .attr("id", "viewbox")
                .attr("height", 450)
                .attr("width", 600)
                .style("fill", function(d) {
            return d.background_color;
        })
                .on("click", function() {
            close();
        })
                .attr("position", "fixed");

        var title = canvas.append("text")
                .data(data1)
                .text(function(d) {
            return d.title;
        })
                .attr("text-anchor", "middle")
                .attr("x", 300)
                .attr("y", 60)
                .attr("id", "title")
                .attr("fill", function(d) {
            return d.title_color;
        })
                .attr("font-family", "Alegreya Sans SC")
                .attr("text-decoration", "underline")
                .attr("font-size", function(d) {
            return d.title_size;
        });

        var timeline = canvas.append("rect")
                .data(data1)
                .attr("width", 550)
                .attr("height", 60)
                .on("click", function() {
            close();
        })
                .style("fill", function(d) {
            return d.timeline_color;
        })
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("y", "195")
                .attr("x", "25");

        var ticks = canvas.selectAll("g") //creates group at each specified date
                .data(x.ticks(5))
                .enter().append("svg:g");



        ticks.append("svg:text")
                .attr("x", x)
                .attr("y", 180)
                .attr("dy", "10px")
                .attr("text-anchor", "middle")
                .text(x.tickFormat(10))
                .attr("transform","translate("+0+","+20+")")
                .transition()
                .duration(600)
                .attr("transform","translate("+0+","+0+")");


        ticks.append("svg:line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 206)
                .attr("y2", 242)
                .attr("stroke", "white")
                .attr("stroke-width", "1px")
                .style('opacity', 0)
                .transition()
                .duration(1000)
                .style('opacity', 1);
                

        
         ticks.append("svg:line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", 173)
                .attr("y2", 176)
                .attr("stroke", "black")
                .attr("stroke-width", "6px")
                .attr("transform","translate("+0+","+20+")")
                .transition()
                .duration(600)
                .attr("transform","translate("+0+","+0+")");

        canvas.append("svg:line")
                .attr("x1", 45)
                .attr("x2", 555)
                .attr("y1", 173)
                .attr("y2", 173)
                .attr("stroke", "black")
                .attr("stroke-width", "4px")
                .attr("transform","translate("+0+","+20+")")
                .transition()
                .duration(600)
                .attr("transform","translate("+0+","+0+")");

        var circles = canvas.selectAll("circle")
                .data(data2)
                .enter()
                .append("circle")
                .attr("cy", 225)
                .attr("cx", function(d) {
            return x(getDate(d));
        })
                .data(data2)
                .attr("id", function(d) {
            return  d.event_number;
        })
                .attr("text", function(d) {
            return d.description;
        })
                .attr("r", 7)
                .attr("class", "circles")
                .style("stroke", "#B53636")
                .style("stroke-width", 2)
                .style("fill", "white")

                .on("mouseover", function() {
            revert = true;
            d3.select(this).transition().duration(400)
                    .attr("r", 9)
                    .style("fill", "#FFCCCC")
                    .style("cursor", "pointer");

        })
                .on("click", function() {
            eventId = d3.select(this).attr("id");
            close();

            d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 11)
                    .transition()
                    .duration(400)
                    .style("fill", "B53636")
                    .attr("r", 0)
                    ;

            var circleX = d3.select(this).attr("cx") - 10;
            var circleY = d3.select(this).attr("cy");
            if ((600 - circleX) < 160)
            {
                eventOffset = 150 + circleX - 440;
            }
            else if ((circleX - 160) < 0)
            {
                eventOffset = 150 + circleX - 160;
            }
            else
            {
                eventOffset = 150;
            }

            var dLength = descriptions[eventId].length;

            if ((dLength * .75) < 160)
            {
                eventHeight = 160;
            }
            else
            {
                eventHeight = (dLength * .75);
            }

            event = canvas.append("rect")
                    .attr("id", "event")
                    .attr("width", 20)
                    .attr("height", 0)
                    .attr("transform", "translate(" + (circleX) + "," + (circleY) + ")")
                    .style("fill", "white")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1)
                    .attr("opacity", .25)
                    .transition()
                    .duration(1000)
                    .attr("opacity", 1)
                    .attr("height", eventHeight)
                    .attr("transform", "translate(" + (circleX) + "," + (circleY - (eventHeight / 2)) + ")")
                    .transition()
                    .duration(700)
                    .attr("width", 300)
                    .attr("transform", "translate(" + (circleX - eventOffset) + "," + (circleY - (eventHeight / 2)) + ")");


            dText = createSVGtext(descriptions[eventId], circleX - eventOffset + 160, circleY - (eventHeight / 2 - 45));

            setTimeout(function() {
                $('svg').append(dText);
            }, 1600); //makes text appear at same time as other content



            closeEventCircle = canvas.append("svg:image")
                    .attr("id", "closeEventCircle")
                    .attr("transform", "translate(" + (circleX - eventOffset + 270) + "," + (circleY - (eventHeight / 2 - 10)) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500)
                    .attr("xlink:href", "http://i1357.photobucket.com/albums/q749/pongassist/closeEventCircle_zps820393d6.png")
                    .attr("opacity", 1)
                    .attr("height", "20")
                    .attr("width", "20");


            closeEvent = canvas.append("svg:image")
                    .on("mouseover", function() {
                d3.select(this)
                        .style("cursor", "pointer")
                        .transition().duration(500)
                        .attr("transform", "translate(" + (circleX - eventOffset + 270) + "," + (circleY - (eventHeight / 2 - 10)) + ") rotate(45 10 10)");
                d3.select("#closeEventCircle")
                        .transition().duration(200)
                        .attr("height", 22).attr("width", 22)
                        .attr("transform", "translate(" + (circleX - eventOffset + 269) + "," + (circleY - (eventHeight / 2 - 9)) + ")")
                        .transition().duration(300)
                        .attr("height", 15).attr("width", 15)
                        .attr("transform", "translate(" + (circleX - eventOffset + 272.5) + "," + (circleY - (eventHeight / 2 - 12.5)) + ")");
            })

                    .on("mouseout", function() {
                d3.select(this)
                        .transition().duration(500)
                        .attr("transform", "translate(" + (circleX - eventOffset + 270) + "," + (circleY - (eventHeight / 2 - 10)) + ") rotate(0 10 10)");
                d3.select("#closeEventCircle")
                        .transition().duration(500)
                        .attr("height", 20).attr("width", 20)
                        .attr("transform", "translate(" + (circleX - eventOffset + 270) + "," + (circleY - (eventHeight / 2 - 10)) + ")");
            })


                    .on("click", function() {
                d3.select(this)
                        .transition().duration(200) //THIS TRANSITION IS NOT WORKING FOR SOME REASON
                        .attr("width", 0)
                        .attr("height", 0)
                        .attr("transform", "translate(" + (circleX - eventOffset + 280) + "," + (circleY - (eventHeight / 2 - 20)) + ") rotate(45 0 0)");

                d3.select("#closeEventCircle")
                        .transition().duration(200) //THIS TRANSITION IS NOT WORKING FOR SOME REASON
                        .attr("height", 0).attr("width", 0)
                        .attr("transform", "translate(" + (circleX - eventOffset + 280) + "," + (circleY - (eventHeight / 2 - 20)) + ")");
                close();
            })
                    .attr("id", "closeEvent")
                    .attr("transform", "translate(" + (circleX - eventOffset + 270) + "," + (circleY - (eventHeight / 2 - 10)) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500)
                    .attr("xlink:href", "http://i1357.photobucket.com/albums/q749/pongassist/closeEvent_zpsfdfdf1e2.png")
                    .attr("opacity", 1)
                    .attr("height", "20")
                    .attr("width", "20");

            eventImage = canvas.append("svg:image")
                    .attr("id", "eventImage")
                    .attr("height", 140)//apparently only sets the height of the box containing the image: very convenient from scaling POV
                    .attr("width", 140)
                    .attr("transform", "translate(" + (circleX - eventOffset + 10) + "," + (circleY - 70) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500)
                    .attr("opacity", 1)
                    .attr("xlink:href", urls[eventId]);

            dateBox = canvas.append("rect")
                    .attr("id", "dateBox")
                    .attr("height", 22)
                    .attr("width", 90)
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("stroke", "black")
                    // .attr("stroke-width",1)
                    .attr("fill", "grey")
                    .attr("border-radius", 2)
                    .attr("transform", "translate(" + (circleX - eventOffset + 35) + "," + (272) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500)
                    .attr("opacity", 1);

            date = canvas.append("text")
                    .attr("id", "date")
                    .attr("transform", "translate(" + (circleX - eventOffset + 40) + "," + (290) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500).attr("opacity", 1)
                    .text(dates[eventId])
                    .attr("font-size", "20px");

        })

                .on("mouseout", function() {
            if (revert === true) {
                d3.select("body").selectAll("circle").transition().duration(200)
                        .attr("r", 7)
                        .style("fill", "white")
                        .style("cursor", "default");
            }
        })

                .style('opacity', 0)
                .transition() //transition opens up new "bracket" sort of. You can't put any type of mouse event after it
                .duration(1000)
                .style('opacity', 1);

        var xAxisGroup = canvas.append("g")

                .call(xAxis)
                .attr("transform", "translate(0,200)")
                //.tickFormat(d3.time.format("%Y")) 
                .transition()
                .duration(1000)
                .attr("transform", "translate(0,170)");

    });
});


//
function getDate(d) {
    return new Date(d.eDate);
}


//*************************** CLOSES TIMELINE EVENTS ***************************
function close() {
    d3.selectAll("#event, #eventImage, #closeEvent, #closeEventCircle, #dateBox, #date")
            .transition().duration(300).attr("opacity", 0).remove();
    setTimeout(function() {
        $('#dText').remove();
    }, 100);
}


//*************************** CREATES TEXT WRAPPING ****************************

//Following code taken from Mike Gledhill (http://www.MikesKnowledgeBase.com)
function createSVGtext(caption, x, y) {
    //  This function attempts to create a new svg "text" element, chopping 
    //  it up into "tspan" pieces, if the caption is too long
    //
    svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgText.setAttributeNS(null, 'x', x);
    svgText.setAttributeNS(null, 'y', y);
    svgText.setAttributeNS(null, 'font-size', 12);
    svgText.setAttributeNS(null, 'fill', '#000000');         //  black text
    svgText.setAttributeNS(null, 'text-anchor', 'start');   //  left-align the text
    svgText.setAttributeNS(null, 'id', 'dText');

    //  The following two variables should really be passed as parameters
    var MAXIMUM_CHARS_PER_LINE = 28;
    var LINE_HEIGHT = 13;

    var words = caption.split(" ");
    var line = "";

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        if (testLine.length > MAXIMUM_CHARS_PER_LINE)
        {
            //  Add a new <tspan> element
            var svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            svgTSpan.setAttributeNS(null, 'x', x);
            svgTSpan.setAttributeNS(null, 'y', y);

            var tSpanTextNode = document.createTextNode(line);
            svgTSpan.appendChild(tSpanTextNode);
            svgText.appendChild(svgTSpan);

            line = words[n] + " ";
            y += LINE_HEIGHT;
        }
        else {
            line = testLine;
        }
    }

    var svgTSpan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    svgTSpan.setAttributeNS(null, 'x', x);
    svgTSpan.setAttributeNS(null, 'y', y);

    var tSpanTextNode = document.createTextNode(line);
    svgTSpan.appendChild(tSpanTextNode);

    svgText.appendChild(svgTSpan);
    return svgText;
}




