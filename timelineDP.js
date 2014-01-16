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
        var j = 0;
        var i = 0; //counter for computing true months
        var circleY;
        var circleX;
        var currentX;
        var lastX = 0;
        var xPosition;
        var removed = false;
        var remove;
        var yPosition =  parseInt(data1.map(function(d){return d.timeline_position;}));
        var titlePosition = parseInt(data1.map(function(d){return d.title_position;}));
        var imageX = parseInt(data1.map(function(d){return d.imageX;}));
        var imageY = parseInt(data1.map(function(d){return d.imageY;}));



        var dates = data2.map(function(d) {
            return d.eDate;
        });

        var titles = data2.map(function(d) {
            return d.title;
        });

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

var backgroundImage = canvas.append("svg:image")
                    .data(data1)
                    .attr("id", "backgroundImage")
                    .attr("transform", "translate(" + (imageX) + "," + (imageY) + ")")
                    .attr("xlink:href", function(d){return d.backgroundImageURL;
                    })
                    .attr("height",function(d){return d.imageSize;})
                    .attr("width",function(d){return d.imageSize;});

        var title = canvas.append("text")
                .data(data1)
                .text(function(d) {
            return d.title;
        })
                .attr("text-anchor", "middle")
                .attr("x", 300)
                .attr("y", titlePosition)
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
                .on("mouseover", function() {
            d3.select(".dCircle1").transition().attr("cy", yPosition).remove();
            d3.select(".dCircle2").transition().attr("cy", yPosition).remove();
            doubleEvent();

        })
                .on("click", function() {
            close();
        })
                .style("fill", function(d) {
            return d.timeline_color;
        })
                .attr("rx", 10)
                .attr("ry", 10)
                .attr("y", yPosition-30)
                .attr("x", "25");

        var ticks = canvas.selectAll("g") //creates group at each specified date
                .data(x.ticks(5))
                .enter().append("svg:g");

        ticks.append("svg:text")
                .attr("x", x)
                .attr("y", yPosition-45)
                .attr("dy", "10px")
                .attr("text-anchor", "middle")
                .text(x.tickFormat(10))
                .attr("transform", "translate(" + 0 + "," + 20 + ")")
                .transition()
                .duration(600)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

        ticks.append("svg:line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", yPosition-19)
                .attr("y2", yPosition+17)
                .attr("stroke", "#404040")
                .attr("stroke-width", "1px")
                .style('opacity', 0)
                .transition()
                .duration(1000)
                .style('opacity', 1);



        ticks.append("svg:line")
                .attr("x1", x)
                .attr("x2", x)
                .attr("y1", yPosition-52)
                .attr("y2", yPosition-49)
                .attr("stroke", "black")
                .attr("stroke-width", "6px")
                .attr("transform", "translate(" + 0 + "," + 20 + ")")
                .transition()
                .duration(600)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

        canvas.append("svg:line")
                .attr("x1", 45)
                .attr("x2", 555)
                .attr("y1", yPosition-52)
                .attr("y2", yPosition-52)
                .attr("stroke", "black")
                .attr("stroke-width", "4px")
                .attr("transform", "translate(" + 0 + "," + 20 + ")")
                .transition()
                .duration(600)
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

        var circles = canvas.selectAll("circle")
                .data(data2)
                .enter()
                .append("circle")
                .attr("cy", yPosition)
                .attr("cx", function(d) {
            return x(getDate(d));
        })
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
                .each(function() {
            currentX = d3.select(this).attr("cx");
            if ((currentX - lastX) > 7 || (currentX - lastX) < -7)
            {
            }
            else
            {
                d3.select(this).remove();
                remove = i - 1;
            }
            lastX = currentX;
            i++;
        })
                .each(function() {
            if (j === remove)
            {
                d3.select(this).remove();
                xPosition = x(new Date(dates[j]));
                removed = true;


            }
            j++;
        })
                .on("mouseover", function() {
            mouseOver(this, 1);


        })
                .on("click", function() {
            onClick(this);

        })

                .on("mouseout", function() {
            mouseOut();
        })

                .style('opacity', 0)
                .transition() //transition opens up new "bracket" sort of.
                // You can't put any type of mouse event after it
                .duration(1000)
                .style('opacity', 1);

        if (removed === true)
        {
            doubleEvent();
        }

        var xAxisGroup = canvas.append("g")

                .call(xAxis)
                .attr("transform", "translate(0,200)")
                //.tickFormat(d3.time.format("%Y")) 
                .transition()
                .duration(1000)
                .attr("transform", "translate(0,170)");

//******************* CREATES CIRCLE FOR DOUBLE EVENT **************************
        function doubleEvent() {
            canvas.append("circle")
                    .attr("cy", yPosition)
                    .attr("cx", xPosition)
                    .attr("r", 7)
                    .attr("class", "doubleCircle")
                    .style("stroke", "#B53636")
                    .style("stroke-width", 2)
                    .style("fill", "white")
                    .on("mouseover", function() {
                    doubleGenerate(this);
            })
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);

            canvas.append("text")
                    .attr("y", yPosition+4)
                    .attr("x", xPosition)
                    .style("font-size", "12px")
                    .style("font-weight", "bold")
                    .attr("text-anchor", "middle")
                    .text("2")
                   /* .on("mouseover",function(){
                generateDouble("#doubleCircle");
                    })*/
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);
        }

//********************* GENERATES TWO SEPARATE EVENTS **************************                
        function doubleGenerate(target){
            canvas.append("rect")
                        .attr("height", 50)
                        .attr("width", 20)
                        .attr("x", xPosition - 10)
                        .attr("y", yPosition-26)
                        .style("fill", "black");


                d3.select(target).transition()
                        .attr("cy", yPosition+15).remove();

                canvas.append("circle")
                        .attr("cy", yPosition+15)
                        .attr("cx", xPosition)
                        .attr("id", remove)
                        .attr("r", 7)
                        .attr("class", "dCircle2")
                        .style("stroke", "#B53636")
                        .style("stroke-width", 2)
                        .style("fill", "white")
                        .on("mouseover", function() {
                    mouseOver(this, 1);
                })
                        .on("click", function() {
                    onClick(this);
                })
                        .on("mouseout", function() {
                    mouseOut(this);
                })
                        .attr("opacity", 0).transition().delay(100).attr("opacity", 1);

                canvas.append("circle")
                        .attr("cy", yPosition)
                        .attr("cx", xPosition)
                        .attr("id", remove)
                        .attr("r", 7)
                        .attr("class", "circles")
                        .style("stroke", "#B53636")
                        .style("stroke-width", 2)
                        .style("fill", "white")
                        .transition()
                        .attr("cy", yPosition-15)
                        .remove();

                canvas.append("circle")
                        .attr("cy", yPosition-15)
                        .attr("cx", xPosition)
                        .attr("id", (remove + 1))
                        .attr("r", 7)
                        .attr("class", "dCircle1")
                        .style("stroke", "#B53636")
                        .style("stroke-width", 2)
                        .style("fill", "white")
                        .on("mouseover", function() {
                    mouseOver(this, 2);
                })
                        .on("click", function() {
                    onClick(this);
                })
                        .on("mouseout", function() {
                    mouseOut(this);
                })
                        .attr("opacity", 0).transition().delay(100).attr("opacity", 1);
        }

//********************** WHEN EVENT CIRCLE IS CLICKED **************************
        function onClick(target) {

            eventId = d3.select(target).attr("id");
            close();

            d3.select(target)
                    .transition()
                    .duration(200)
                    .attr("r", 11)
                    .transition()
                    .duration(400)
                    .style("fill", "B53636")
                    .attr("r", 0)
                    ;

            circleX = d3.select(target).attr("cx") - 10;
            circleY = d3.select(target).attr("cy");
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
                mouseOverEvent(this);
            })

                    .on("mouseout", function() {
                mouseOutEvent(this);
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
                    .attr("height", 140)//apparently only sets the height of 
                    //the box containing the image: very convenient from scaling POV
                    .attr("width", 140)
                    .attr("transform", "translate(" + (circleX - eventOffset + 10)
                    + "," + (circleY - 70) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500)
                    .attr("opacity", 1)
                    .attr("xlink:href", urls[eventId]);

            dateBox = canvas.append("rect")
                    .attr("id", "dateBox")
                    .attr("height", 22)
                    .attr("width", 100)
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("stroke", "black")
                    // .attr("stroke-width",1)
                    .attr("fill", "grey")
                    .attr("border-radius", 2)
                    .attr("transform", "translate(" + (circleX - eventOffset + 30)
                    + "," + (yPosition+47) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500)
                    .attr("opacity", 1);

            date = canvas.append("text")
                    .attr("id", "date")
                    .attr("transform", "translate(" + (circleX - eventOffset + 35)
                    + "," + (yPosition+65) + ")")
                    .attr("opacity", 0)
                    .transition().delay(1500).attr("opacity", 1)
                    .text(dates[eventId])
                    .attr("font-size", "20px");
        }

//******************* WHEN MOUSE HOVERS ON EVENT CIRCLE ************************
        function mouseOver(target, direction) {
            var textShift;
            var lineShift;
            eventId = d3.select(target).attr("id");
            circleX = parseInt(d3.select(target).attr("cx"));
            circleY = parseInt(d3.select(target).attr("cy")) + 8;
            revert = true;
                if (direction === 1)
                {
                    lineShift=circleY+50;
                    textShift=circleY+65;
                }
                else if (direction === 2)
                {
                    circleY=circleY-17;
                    lineShift=circleY-50;
                    textShift=circleY-65;
                }
            
            d3.select(target).transition().duration(400)
                    .attr("r", 9)
                    .style("fill", "#FFCCCC")
                    .style("cursor", "pointer");
            var popUpLine = canvas.append("svg:line")
                    .attr("x1", circleX)
                    .attr("x2", circleX)
                    .attr("y1", circleY)
                    .attr("y2", circleY)
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .attr("id", "popUpLine")
                    .transition().duration(400)
                    .attr("y2", lineShift);

            var popUpText = canvas.append("text")
                    .data(data2)
                    .attr("id", "popUpText")
                    .attr("transform", "translate(" + (circleX) + "," + (textShift) + ")")
                    .attr("text-anchor", "middle")
                    .attr("opacity", 0)
                    .transition().delay(300).attr("opacity", 1)
                    .text(titles[eventId])
                    .attr("font-size", "12px");
        }

//********************** WHEN MOUSE LEAVES EVENT CIRCLE ************************
        function mouseOut() {
            if (revert === true) {
                d3.select("body").selectAll("circle").transition().duration(200)
                        .attr("r", 7)
                        .style("fill", "white")
                        .style("cursor", "default");
                d3.select("body").selectAll("#popUpLine").transition().duration(200)
                        .attr("y2", circleY).remove();

                d3.select("body").selectAll("#popUpText").transition().duration(200)
                        .attr("opacity", 0).remove();
            }
        }

//******************** WHEN MOUSE ENTERS CLOSE EVENT ***************************
        function mouseOverEvent(target) {
            d3.select(target)
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

        }

//******************** WHEN MOUSE LEAVES CLOSE EVENT ***************************
        function mouseOutEvent(target) {
            d3.select(target)
                    .transition().duration(500)
                    .attr("transform", "translate(" + (circleX - eventOffset + 270) + "," + (circleY - (eventHeight / 2 - 10)) + ") rotate(0 10 10)");
            d3.select("#closeEventCircle")
                    .transition().duration(500)
                    .attr("height", 20).attr("width", 20)
                    .attr("transform", "translate(" + (circleX - eventOffset + 270) + "," + (circleY - (eventHeight / 2 - 10)) + ")");
        }



    });
});


//*****************************FORMATS EVENT DATES******************************
function getDate(d) {
    return new Date(d.eDate);
}

//*************************** CLOSES TIMELINE EVENTS ***************************
function close() {
    d3.selectAll("#event, #eventImage, #closeEvent, #closeEventCircle, #dateBox,\n\
 #date, #popUpLine, #popUpText")
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
    svgTSpan.appendChild(tSpanTextNode)

    svgText.appendChild(svgTSpan);
    return svgText;
}




