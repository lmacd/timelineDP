d3.json("timelineDP.json", function(data) {
 
    /*map the month values of the json array into a new array composed only of month values
     //then find the maximum value of that array
     var monthMax = Math.max.apply(Math,data.map(function(d){return d.month;}));
     alert(monthMax);
     */
    
    var event;
    
 //   var clicked=false;
    
    var dataL = data.length; //returns number of timeline events
    
    var years =data.map(function(d){return d.year;}); //creates new array of only years
    var months =data.map(function(d){return d.month;}); //creates new array of only months
    var days =data.map(function(d){return d.day;}); //creates new array of only days
    
    var startingYear=d3.min(years); //first year in timeline
    var endingYear=d3.max(years); //last year in timeline
    
    var startingMonth=d3.min(months); //first month in timeline 
    var endingMonth=d3.max(months); //last month in timeline
    
    var startingDay=d3.min(days); //first day in timeline
    var endingDay=d3.max(days); //last day in timeline
   
    var ySpan = endingYear-startingYear; //returns span of years accross events
    var mSpan = endingMonth-startingMonth; //returns span of months accross events
    var dSpan = endingDay-startingDay; //returns span of days accross events
    
    var startingPoint; //these values will depend on the data scaling
    var endingPoint;
    var scale; //the scale you end up having (years, months, or days)

if (ySpan <= 1) //if the events all occurred within two years
    {
        if (mSpan <= 1)//if all the events occured within two months
        {
            startingPoint=startingDay;
            endingPoint=endingDay;
            scale=days;
        }
        else if (mSpan>1)//if the events took place over several months
        {
         alert("working");
            startingPoint=startingMonth;
            endingPoint=endingMonth;
            scale=months;
        }
    }
    else if(ySpan>1)
        { startingPoint=startingYear;
            endingPoint=endingYear;
            scale=years;
    }


    var linearScale = d3.scale.linear()
                            .domain([startingPoint,endingPoint])
                            .range([37,563]);
                    
    var dataScale=[]; //stores the calibrated sizes
    
    
    for (var i = 0; i < dataL; i++) {
  dataScale[i] = linearScale(scale[i]);
}

var xAxis = d3.svg.axis()
                  .scale(linearScale)
                  .orient("bottom")
                  .tickFormat(d3.format(Number.toPrecision));

//var dataScale=scaledYears.slice(0); //creates a new array "dataScale" that is equivilant to scaledYears. ".slice" can be ommitted, if desired.


    var canvas = d3.select("body")
            .append("svg")
            .attr("width", 600)
            .attr("height", 450);

                          
                      
    var viewbox = canvas.append("rect")
            .attr("height", 450)
            .attr("width", 600)
            .style("fill", "#DBDBDB");


    

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
            .attr("cx", function(d) {return d;})
            .attr("r", 7)
            .style("stroke","#B53636")
            .style("stroke-width",2)
            .style("fill", "white")
    .on("mouseover", function(){
 d3.select(this).transition().duration(400)
            .attr("r",9)
            .style("fill","#FFCCCC")
            .style("cursor","pointer");
    })
    
  
 
    .on("click",function(){

//clicked=true;

 d3.select("#event").remove();

 d3.select(this)
        .transition()
        .duration(200)
        .attr("r",11)
        .transition()
        .duration(400)
        .style("fill","B53636")
        .attr("r",0);

var circleX=d3.select(this).attr("cx")-10;
var circleY=d3.select(this).attr("cy");

 event = canvas.append("rect")
    .attr("id","event")
    .attr("width",20)
    .attr("height",0)
    .attr("transform","translate("+(circleX)+","+(circleY)+")")
    .style("fill","white")
    .attr("stroke","black")
    .attr("stroke-width",1)
    .attr("opacity",.25)
    .transition()
    .duration(1000)
    .attr("opacity",1)
    .attr("height",160)
    .attr("transform","translate("+(circleX)+","+(circleY-80)+")")
        .transition()
        .duration(700)
        .attr("width",300)
        .attr("transform","translate("+(circleX-150)+","+(circleY-80)+")");
    

    })
    
      .on("mouseout", function(){
//if(clicked===false){
 d3.select(this).transition().duration(200)
 .attr("r",7)
 .style("fill","white")
.style("cursor","default");
//}
})
    
            .style('opacity',0)
            .transition() //transition open up new "bracket" sort of. You can't put any type of mouse event after it
            .duration(1000)
            .style('opacity',1);
 
    
    var xAxisGroup = canvas.append("g")

                              .call(xAxis)
                             .attr("transform","translate(0,200)")
                              //.tickFormat(d3.time.format("%Y")) 
                              .transition()
                              .duration(1000)
                              .attr("transform","translate(0,170)");

  


    //d3.select("line").attr("x1") -> for returning "line"'s "x1" value

    /*.on("mouseenter", function(){
     circles.transition()
     .duration(1500)
     //.delay(1000)
     .style('opacity',.7)
     .attr("cx", function(d){return d.month * 50;})
     //.each("end",function(){}) //this is a listener -- "start" can also be used instead of "end"
     .transition()
     .style('opacity',0)
     .attr("cy",function(d){return d.year / 10;});});*/





});



