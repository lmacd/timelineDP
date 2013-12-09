
d3.json("timelineDP.json", function(data) {


    /*map the month values of the json array into a new array composed only of month values
     //then find the maximum value of that array
     var monthMax = Math.max.apply(Math,data.map(function(d){return d.month;}));
     */

    var event;
    var closeEvent;
    var closeEventCircle;
    var eventImage;
    var dText;
    var date;
    var dateBox;
    var eventId;
    var eventHeight=300;
    var descriptionText;



    var dataL = data.length; //returns number of timeline events

    var urls = data.map(function(d) {
        return d.image_url;
    }); //creates array of image urls
    var descriptions = data.map(function(d) {
        return d.description;
    }); //creates array of event descriptions
    
  
    
    var years = data.map(function(d) {
        return d.year;
    }); //creates new array of only years
    var months = data.map(function(d) {
        return d.month;
    }); //creates new array of only months
    var days = data.map(function(d) {
        return d.day;
    }); //creates new array of only days

    var startingYear = d3.min(years); //first year in timeline
    var endingYear = d3.max(years); //last year in timeline

    var startingMonth = d3.min(months); //first month in timeline 
    var endingMonth = d3.max(months); //last month in timeline

    var startingDay = d3.min(days); //first day in timeline
    var endingDay = d3.max(days); //last day in timeline

    var ySpan = endingYear - startingYear; //returns span of years accross events
    var mSpan = endingMonth - startingMonth; //returns span of months accross events
    var dSpan = endingDay - startingDay; //returns span of days accross events

    var startingPoint; //these values will depend on the data scaling
    var endingPoint;
    var scale; //the scale you end up having (years, months, or days)]]

    var revert = true;

    if (ySpan <= 1) //if the events all occurred within two years
    {
        if (mSpan <= 1)//if all the events occured within two months
        {
            startingPoint = startingDay;
            endingPoint = endingDay;
            scale = days;
        }
        else if (mSpan > 1)//if the events took place over several months
        {
            alert("working");
            startingPoint = startingMonth;
            endingPoint = endingMonth;
            scale = months;
        }
    }
    else if (ySpan > 1)
    {
        startingPoint = startingYear;
        endingPoint = endingYear;
        scale = years;
    }


    var linearScale = d3.scale.linear()
            .domain([startingPoint, endingPoint])
            .range([37, 563]);

    var dataScale = []; //stores the calibrated sizes


    for (var i = 0; i < dataL; i++) {
        dataScale[i] = linearScale(scale[i]);
    }

    var xAxis = d3.svg.axis()
            .scale(linearScale)
            .orient("bottom")
            .tickFormat(d3.format(Number.toPrecision));



    var canvas = d3.select("body")
            .append("svg")
            .attr("width", 600)
            .attr("height", 450)
            .attr("id", "canvas")
            .style("position", "fixed");



    var viewbox = canvas.append("rect")
            .attr("height", 450)
            .attr("width", 600)
            .style("fill", "#DBDBDB")
            .attr("position", "fixed");


    var timeline = canvas.append("rect")
            .attr("width", 550)
            .attr("height", 60)
            .style("fill", "black")
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("y", "195")
            .attr("x", "25");


    var circles = canvas.selectAll("circle")
            .data(dataScale)
            .enter()
            .append("circle")
            .attr("cy", 225)
            .attr("cx", function(d) {
        return d;
    })
            .data(data)
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
        d3.select("#event").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#eventImage").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#closeEvent").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#closeEventCircle").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#dateBox").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#date").transition().duration(300).attr("opacity", 0).remove();
        $('descriptionText').remove();
        
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
        
          var dLength=descriptions[eventId].length;
          if((dLength*.75)<160)
              {
                  eventHeight=160;
              }
          else
              {
                eventHeight=(dLength*.75);
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
                .attr("transform", "translate(" + (circleX) + "," + (circleY - (eventHeight/2)) + ")")
                .transition()
                .duration(700)
                .attr("width", 300)
                .attr("transform", "translate(" + (circleX - 150) + "," + (circleY - (eventHeight/2)) + ")");

        dText = createSVGtext(descriptions[eventId], circleX + 10, circleY - (eventHeight/2-45)); //splits description into multiple lines
    //   descriptionText=d3.select('event').append('dText');
  setTimeout(function() {descriptionText=$('svg').append(dText);}, 1600); //makes text appear at same time as other content
               // alert(months[eventId]+" "+days[eventId]+", "+years[eventId]);

   
        
        closeEventCircle = canvas.append("svg:image")
                .attr("id", "closeEventCircle")
                .attr("transform", "translate(" + (circleX + 120) + "," + (circleY - (eventHeight/2-10)) + ")")
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
                    .attr("transform", "translate(" + (circleX + 120) + "," + (circleY - (eventHeight/2-10)) + ") rotate(45 10 10)");
            d3.select("#closeEventCircle")
                    .transition().duration(200)
                    .attr("height", 22).attr("width", 22)
                    .attr("transform", "translate(" + (circleX + 119) + "," + (circleY - (eventHeight/2-9)) + ")")
                    .transition().duration(300)
                    .attr("height", 15).attr("width", 15)
                    .attr("transform", "translate(" + (circleX + 122.5) + "," + (circleY - (eventHeight/2-12.5)) + ")");
        })

                .on("mouseout", function() {
            d3.select(this)
                    .transition().duration(500)
                    .attr("transform", "translate(" + (circleX + 120) + "," + (circleY - (eventHeight/2-10)) + ") rotate(0 10 10)");
            d3.select("#closeEventCircle")
                    .transition().duration(500)
                    .attr("height", 20).attr("width", 20)
                    .attr("transform", "translate(" + (circleX + 120) + "," + (circleY - (eventHeight/2-10)) + ")");
            })


                .on("click", function() {
            d3.select(this)
                    .transition().duration(200) //THIS TRANSITION IS NOT WORKING FOR SOME REASON
                    .attr("width", 0)
                    .attr("height", 0)
                    .attr("transform", "translate(" + (circleX + 130) + "," + (circleY - (eventHeight/2-20)) + ") rotate(45 0 0)");

            d3.select("#closeEventCircle")
                    .transition().duration(200) //THIS TRANSITION IS NOT WORKING FOR SOME REASON
                    .attr("height", 0).attr("width", 0)
                    .attr("transform", "translate(" + (circleX + 130) + "," + (circleY - (eventHeight/2-20)) + ")");

        d3.select("#event").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#eventImage").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#closeEvent").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#closeEventCircle").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#dateBox").transition().duration(300).attr("opacity", 0).remove();
        d3.select("#date").transition().duration(300).attr("opacity", 0).remove();
        $('descriptionText').remove();
                })
                .attr("id", "closeEvent")
                .attr("transform", "translate(" + (circleX + 120) + "," + (circleY - (eventHeight/2-10)) + ")")
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
                .attr("transform", "translate(" + (circleX - 140) + "," + (circleY - 70) + ")")
                .attr("opacity", 0)
                .transition().delay(1500)
                .attr("opacity", 1)
                .attr("xlink:href", urls[eventId]);
        
        dateBox=canvas.append("rect")
        .attr("id","dateBox")
        .attr("height",22)
        .attr("width",90)
        .attr("rx",5)
        .attr("ry",5)
        .attr("stroke","black")
       // .attr("stroke-width",1)
        .attr("fill","grey")
        .attr("border-radius",2)
        .attr("transform","translate(" + (circleX - 115) + "," + (272) + ")")
        .attr("opacity", 0)
        .transition().delay(1500)
        .attr("opacity",1);
        
        date = canvas.append("text")
        .attr("id","date")
        .attr("transform","translate(" + (circleX - 110) + "," + (290) + ")")
        .attr("opacity",0)
        .transition().delay(1500).attr("opacity",1)
        .text(months[eventId]+"/"+days[eventId]+"/"+years[eventId])
        .attr("font-size","20px");

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


//Following code taken from Mike Gledhill (http://www.MikesKnowledgeBase.com)
//splits timeline descriptions into multiple lines

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



