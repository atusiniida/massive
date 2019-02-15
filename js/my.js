

var $script     = $('#script');
var datasets      = JSON.parse($script.attr('data-datasets'));
var dataset      = JSON.parse($script.attr('data-dataset1'));
var dataset2      = JSON.parse($script.attr('data-dataset2'));
var dataset3      = JSON.parse($script.attr('data-dataset3'));
var v1      = JSON.parse($script.attr('data-v1'));
var v2      = JSON.parse($script.attr('data-v2'));
var v3      = JSON.parse($script.attr('data-v3'));
var v4      = JSON.parse($script.attr('data-v4'));
var V1      = JSON.parse($script.attr('data-u1'));
var V2      = JSON.parse($script.attr('data-u2'));
var V3      = JSON.parse($script.attr('data-u3'));
var V4      = JSON.parse($script.attr('data-u4'));
var u1      = JSON.parse($script.attr('data-x'));
var u2      = JSON.parse($script.attr('data-y'));
var u3      = JSON.parse($script.attr('data-z1'));
var u4      = JSON.parse($script.attr('data-z2'));
var z1_value0      = JSON.parse($script.attr('data-z1value'));
var z2_value0      = JSON.parse($script.attr('data-z2value'));

//v1-v4  names of the variables
//u1-u4  names of the sorted variables
//V1-V4  values of the variables

var variables = [u1,u2,u3,u4];
var variable2values = {};
variable2values[v1] = V1;
variable2values[v2] = V2;
variable2values[v3] = V3;
variable2values[v4] = V4;

var convertedVariableName = {};
convertedVariableName["f"] = "f'";
convertedVariableName["m"] = "m'";
convertedVariableName["p"] = "p'";
convertedVariableName["d"] = "d'";
function convertVariableName(x){
  if(convertedVariableName[x]){
    return convertedVariableName[x];
  }else{
    return x;
  }
}

var convertedDatasetName = {};
convertedDatasetName["allMutationCount"] = "mutation count";
convertedDatasetName["clonalMutationCount"] = "clonal mutation count";
convertedDatasetName["clonalMutationProportion"] = "clonal mutation proportion";
convertedDatasetName["growthTime"] = "time";
convertedDatasetName["populationSize"] = "population size";
convertedDatasetName["shannonDiversity0.05"] = "Shannon index 0.1";
convertedDatasetName["shannonDiversity0.1"] = "Shannon index 0.05";
convertedDatasetName["simpsonDiversity0.05"] = "Simpson index 0.1";
convertedDatasetName["simpsonDiversity0.1"] = "Simpson index 0.05";
convertedDatasetName["subClonalMutationCount"] = "subclonal mutation count";
convertedDatasetName["subClonalMutationProportion"] = "subclonal mutation proportion";
function convertDatasetName(x){
  if(convertedDatasetName[x]){
    return convertedDatasetName[x];
  }else{
    return x;
  }
}




var OVmargin = { top: 20, right: 10, bottom: 20, left: 10 }, OVheatmapHeight, OVheatmapWidth, OVbeteenSpaceProp = 0.05,OVlabelSpaceWidth = 50;
var margin = { top: 20, right: 10, bottom: 20, left: 10 }, heatmapSize = 300, labelSpaceWidth = 40;
var  x_variable, y_variable, z1_variable, z2_variable, x_values, y_values,  z1_values, z2_values, x_index, y_index, z1_index, z2_index;
var OVwidth  = 400,OVheight;
var width, height;
var OVgridWidth, OVgridHeight;
var gridWidth, gridHeight;
var z1_value, z2_value;
var legendWidth = heatmapSize - labelSpaceWidth*2, legendHeight = 10;
var Data = {};
var colorScale;
var min = {};
var max = {};
var color = "red";
var OVsvg, svg, image;
var z1_value, z2value;
var showImage = true;
var highlighted = false; OVhighlighted = false;

setVariables(variables);
var q = d3.queue();
for(var i = 0; i < datasets.length; i++){
  q.defer(d3.tsv, "data/" + datasets[i] + ".tsv");
}
q.awaitAll(function(error, dataarray){
  for(var i = 0; i < datasets.length; i++){
    Data[datasets[i]] = dataarray[i];
  }
  draw();
});


// width =  (z1_values.length + (z1_values.length-1)*beteenSpaceProp)*heatmapWidth
//height =  (z2_values.length + (z2_values.length-1)*beteenSpaceProp)*heatmapHeight

//heatmapWidth =  gridWidth * x_values.length
//heatmapHeight = gridHeight * y_values.length

function setVariables(variables){

 x_variable = variables[0];
 y_variable = variables[1];
 z1_variable = variables[2];
 z2_variable = variables[3];

 x_values =  variable2values[x_variable];
 y_values =  variable2values[y_variable];
 z1_values =  variable2values[z1_variable];
 z2_values =  variable2values[z2_variable];

 if(z1_value0 === ""){
   z1_value = z1_values[0];
 }else{
   z1_value = z1_value0
 }
 if(z2_value0 === ""){
   z2_value = z2_values[0];
 }else{
   z2_value = z2_value0
 }

 x_index = {};
 for (var i = 0; i < x_values.length; i++){
  x_index[x_values[i]] = i;
 }
 y_index = {};
 for (var i = 0; i < y_values.length; i++){
  y_index[y_values[i]] = i;
 }
 z1_index = {};
 for (var i = 0; i < z1_values.length; i++){
  z1_index[z1_values[i]] = i;
 }
 z2_index = {};
 for (var i = 0; i < z2_values.length; i++){
  z2_index[z2_values[i]] = i;
 }

 OVheatmapWidth = (OVwidth-OVlabelSpaceWidth) /(z1_values.length + (z1_values.length-1)*OVbeteenSpaceProp);
 OVheatmapHeight = OVheatmapWidth;
 OVheight = OVheatmapHeight * (z2_values.length + (z2_values.length-1)*OVbeteenSpaceProp) + OVlabelSpaceWidth ;
 OVgridHeight = OVheatmapHeight/y_values.length;
 OVgridWidth = OVheatmapWidth/x_values.length;

 width = 　heatmapSize  + labelSpaceWidth,
 height = heatmapSize + legendHeight  + labelSpaceWidth*2;
 gridWidth = heatmapSize/x_values.length, gridHeight = heatmapSize/y_values.length;
}



function draw(){
  d3.select("#chart1").select("*").remove();
  OVsvg = d3.select("#chart1").append("svg")
  .attr("width", OVwidth + OVmargin.left + OVmargin.right)
  .attr("height", OVheight + OVmargin.top + OVmargin.bottom)
  .append("g")
  .attr("transform", "translate(" + OVmargin.left + "," + OVmargin.top + ")");

  d3.select("#chart2").select("*").remove();
  svg = d3.select("#chart2").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  setColorScale();
  setOverview();
  setHeatmap();
  setControlPanel();
}


function setColorScale(){
  max = d3.max(Data[dataset], function (d) { return +d.mean; });
  min = d3.min(Data[dataset], function (d) { return +d.mean; });
  colorScale = d3.scale.linear()
  .domain([min, max])
  .range(["whitesmoke", color]);
}


function addZlabel(){
  OVsvg.selectAll(".z2Label")
  .data(z2_values)
  .enter().append("text")
  .text(function (d, i) { return  convertVariableName(z2_variable) + " = " + d;})
  .attr("x", labelSpaceWidth)
  .attr("y", function (d, i) { return OVheight -OVlabelSpaceWidth  - (i * OVheatmapHeight * (1 + OVbeteenSpaceProp ) + 0.5 * OVheatmapHeight); })
  .style("text-anchor", "end")
  .attr("transform", "translate(" + -5 +  ","+ 5 + ")");

  OVsvg.selectAll(".z1Label")
  .data(z1_values)
  .enter().append("text")
  .text(function(d,i) { return convertVariableName(z1_variable) + " = " + d; })
  .attr("x", function(d, i) { return i * OVheatmapWidth * (1 + OVbeteenSpaceProp ) + 0.5 * OVheatmapWidth + OVlabelSpaceWidth;})
  .attr("y", OVheight - OVlabelSpaceWidth)
  .style("text-anchor", "middle")
  .attr("transform", "translate(" +  0 + "," +  15 + ")");

}


function setOverview(){
   OVsvg.selectAll("*").remove();
   addOVcards();
   addZlabel();
 }

function addOVcards(){
  var dataTmp = [];
  for(var i = 0; i < z1_values.length; i++){
    for(var j = 0; j < z2_values.length; j++){
      dataTmp.push([i,j])
    }
  }

  var border = OVsvg.selectAll(".bordered")
  .data(dataTmp)
  .enter().append("rect")
  .attr("x", function(d) { return d[0] * OVheatmapWidth * (1 + OVbeteenSpaceProp ) + OVlabelSpaceWidth -1;})
  .attr("y", function(d) { return OVheight -OVlabelSpaceWidth  - (d[1] *  OVheatmapHeight * (1 + OVbeteenSpaceProp ) +  OVheatmapHeight) -1 ;})
  .attr("rx", 1)
  .attr("ry", 1)
  .attr("width", OVheatmapWidth+2)
  .attr("height", OVheatmapHeight+2)
  .style("fill", "none")
  .attr("class", "bordered");

  var cards = OVsvg.selectAll(".card")
  .data(Data[dataset], function(d) {return d[x_variable]+':'+d[y_variable]+":"+d[z1_variable]+":"+d[z2_variable];});

  cards.append("title");

  cards.enter().append("rect")
  .attr("x", function(d) { return z1_index[d[z1_variable]] * OVheatmapWidth * (1 + OVbeteenSpaceProp ) + x_index[d[x_variable]] * OVgridWidth + OVlabelSpaceWidth + 0.5;})
  .attr("y", function(d) { return OVheight -OVlabelSpaceWidth  - (z2_index[d[z2_variable]] * OVheatmapHeight * (1 + OVbeteenSpaceProp ) + (y_index[d[y_variable]]+1) * OVgridHeight)+ 0.5;})
  .attr("rx", 1)
  .attr("ry", 1)
  .attr("class", "card bordered")
  .attr("width", OVgridWidth-1)
  .attr("height", OVgridHeight-1)
  .style("fill", function(d) { return colorScale(+d.mean); })
 .on("mouseover", function(d) {
    if(OVhighlighted == false){
      z1_value = d[z1_variable];
      z2_value = d[z2_variable];
      setHeatmapLite();
      showImages(d, dataset);
    }
  })
 .on("click", function(d) {
    if(OVhighlighted==false){
      OVhighlighted = true;
      border.attr("class", function(d) {return (d[0] == z1_index[z1_value] && d[1] == z2_index[z2_value]) ? "bordered highlighted" :"bordered"});
      setViewLink();
   }else{
      z1_value = d[z1_variable];
      z2_value = d[z2_variable];
      setHeatmapLite();
      showImages(d, dataset);
      OVhighlighted = false;
      border.attr("class", "bordered");
   }
  });

   cards.select("title").text(function(d) { return d.mean; });
   cards.exit().remove();
}



function addCards(svg, data, colorScale, dataset){
    var cards = svg.selectAll(".card")
    .data(data, function(d) {return d[x_variable]+':'+d[y_variable];});

    cards.append("title");

    cards.enter().append("rect")
    .attr("x", function(d, i) {  return labelSpaceWidth + x_index[d[x_variable]] * gridWidth +0.5; } )
    .attr("y", function(d, i) { return (y_values.length - 1 - y_index[d[y_variable]]) * gridHeight +0.5; })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("class", "card bordered")
    .attr("width", gridWidth-1)
    .attr("height", gridHeight-1)
      //.style("fill", "#ffffe5")
      .style("fill", function(d) { return colorScale(+d.mean); })
      .on("mouseover", function(d) {
        if(highlighted == false){
             showImages(d, dataset);
          }
        })
      .on("click", function(d) {
        if(highlighted==false){
          highlighted = true;
          d3.select(this).attr("class", "card bordered highlighted");
        }else{
          highlighted = false;
          showImages(d, dataset);
          svg.select(".highlighted").attr("class", "card bordered");

        }
      });
   //cards.transition().duration(1000)
   //.style("fill", function(d) { return colorScale(d.mean); });

   cards.select("title").text(function(d) { return d.mean; });

   cards.exit().remove();
}

function showImages(d, dataset){
  var tmp = [d[v1], d[v2], d[v3], d[v4]];
  d3.selectAll("#image > *").remove();
  image = d3.select("#image");
  image.append("p").attr("class","bold").attr("align","center").text(convertVariableName(z1_variable) + " = " +  z1_value  + ", "  +  convertVariableName(z2_variable) + " = "  + z2_value  + ", "  +  convertVariableName(x_variable)  + " = " + d[x_variable] + ", " + convertVariableName(y_variable)  + " = " +  d[y_variable]  + ", "  +  convertDatasetName(dataset) +  " = " + new Number(d.mean).toPrecision(3) + "±" + new Number(d.sd).toPrecision(3));
  image.append("div").attr("align","center").selectAll("img")
  .data([0,1,2,3,4], function (d) {return d;})
  .enter().append("img")
      .attr("src", function(d, i) { return "image/" + v1  +  tmp[0] + "_" + v2 + tmp[1]  + "_" + v3  +  tmp[2] + "_" + v4 + tmp[3] + "_" + d  + ".png"; })
      .attr("width",  200)
      .attr("height", 200);

}


function addLegend(svg, min, max, colorScale, color){
  var idGradient = "legendGradient" + color;
  var numberHues = 20;
  var x = labelSpaceWidth *2;
  var y = heatmapSize + labelSpaceWidth;
  svg.append("g")
  .append("defs")
  .append("linearGradient")
  .attr("id",idGradient)
  .attr("x1","0%")
  .attr("x2","100%")
  .attr("y1","0%")
  .attr("y2","0%");
  svg.append("rect")
  .attr("fill","url(#" + idGradient + ")")
  .attr("x",x)
  .attr("y",y)
  .attr("width",legendWidth)
  .attr("height",legendHeight)
  .attr("rx",4)
  .attr("ry",4)
  .attr("class", "bordered");

  var theData = [];
  var d = 1/(numberHues-1);
  var d2 = (max-min)*d;
  for (var i = 0; i < numberHues; i++){
    var v = min + i*d2;
    var p = i*d;
    var col = colorScale(v);
    theData.push({"rgb":col, "percent":p});
  }

  d3.select('#' + idGradient).selectAll('stop')
  .data(theData)
  .enter().append('stop')
  .attr('offset',function(d) {
                            return d.percent;
                })
  .attr('stop-color',function(d) {
                            return d.rgb;
                });
  var textY = y + legendHeight;
  svg.append("text")
  .attr("class","legendText")
  .attr("text-anchor", "end")
  .attr("x", x)
  .attr("y",textY)
  .attr("dy",0)
  .text(new Number(min).toPrecision(3));
  svg.append("text")
  .attr("class","legendText")
  .attr("text-anchor", "start")
  .attr("x", x + legendWidth )
  .attr("y",textY)
  .attr("dy",0)
  .text(new Number(max).toPrecision(3))
}

function addXYlabel(svg){
  svg.selectAll("*").remove();
  svg.selectAll(".yLabel")
  .data(y_values)
  .enter().append("text")
  .text(function (d, i) { return (y_values.length <= 5)?d:(i % 2 !== 0?"":d);})
  .attr("x", labelSpaceWidth)
  .attr("y", function (d, i) { return (y_values.length -i - 0.5) * gridHeight; })
  .style("text-anchor", "end")
  //.attr("transform", "translate(" + -labelSpaceWidth*0.1 +  ","+  -heatmapSize*0.03 + ")");
  .attr("transform", "translate(" + -labelSpaceWidth*0.1 +  ","+  5 + ")");
  svg.append("text")
  .text(convertVariableName(y_variable))
  .attr("x", labelSpaceWidth*0.2)
  .attr("y", 0.5*heatmapSize)
  .style("text-anchor", "end")
  .attr("class","bold");
  //.attr("transform", "translate(" + 0 +  ","+ 0 + ")");

  svg.selectAll(".xLabel")
  .data(x_values)
  .enter().append("text")
  .text(function(d,i) { return (x_values.length <= 5)?d:(i % 2 !== 0?"":d); })
  .attr("x", function(d, i) { return i * gridWidth + labelSpaceWidth;})
  .attr("y", heatmapSize)
  .style("text-anchor", "middle")
  .attr("transform", "translate(" +  gridWidth*0.5 + "," +  labelSpaceWidth *0.3+ ")");
   svg.append("text")
  .text(convertVariableName(x_variable))
  .attr("x", labelSpaceWidth + heatmapSize*0.5)
  .attr("y", heatmapSize + 0.7*labelSpaceWidth)
  .style("text-anchor", "middle")
  .attr("class","bold");
  //.attr("transform", "translate(" + 0 +  ","+ 0 + ")");
}


function setHeatmap(){
  var data = Data[dataset];
  var data2 = [];
  for(var i = 0; i < data.length; i++){
    if(Number(data[i][z1_variable]) == z1_value && Number(data[i][z2_variable]) == z2_value){
      data2.push(data[i]);
    }
  }
  svg.selectAll("*").remove();
  addXYlabel(svg);
  addCards(svg, data2, colorScale, dataset);
  addLegend(svg, min, max, colorScale, color);
}


function setHeatmapLite(){
  var data = Data[dataset];
  var data2 = [];
  for(var i = 0; i < data.length; i++){
    if(Number(data[i][z1_variable]) == z1_value && Number(data[i][z2_variable]) == z2_value){
      data2.push(data[i]);
    }
  }
  svg.selectAll(".card").remove();
  addCards(svg, data2, colorScale, dataset);
}

function getUnsedVariables(V){
  for(var i = 0; i < variables.length ; i++){
      if($.inArray(variables[i], V) < 0){
        return variables[i];
      }
  }
}

function getNonRedundantVariableSet(V, i){
   switch(i){
    case 0:
      switch(V[0]){
        case V[1]:
          V[1] = getUnsedVariables(V);
          return V;
        case V[2]:
           V[2] = getUnsedVariables(V);
          return V;
        case V[3]:
          V[3] = getUnsedVariables(V);
          return V;
        default:
         return V;
      }
    case 1:
      switch(V[1]){
        case V[2]:
           V[2] = getUnsedVariables(V);
          return V;
        case V[3]:
          V[3] = getUnsedVariables(V);
          return V;
        case V[0]:
          V[0] = getUnsedVariables(V);
          return V;
        default:
          return V;
      }
    case 2:
      switch(V[2]){
        case V[3]:
          V[3] = getUnsedVariables(V);
          return V;
        case V[0]:
          V[0] = getUnsedVariables(V);
          return V;
        case V[1]:
          V[1] = getUnsedVariables(V);
          return V;
        default:
          return V;
      }
    case 3:
      switch(V[3]){
        case V[0]:
          V[0] = getUnsedVariables(V);
          return V;
        case V[1]:
          V[1] = getUnsedVariables(V);
          return V;
        case V[2]:
          V[2] = getUnsedVariables(V);
          return V;
        default:
          return V;
      }
  }
}

function setVariables2(v, i){
  setVariables(getNonRedundantVariableSet(v,i));
  d3.select("#varpicker_x").select("span").text(convertVariableName(x_variable));
  d3.select("#varpicker_y").select("span").text(convertVariableName(y_variable));
  d3.select("#varpicker_z1").select("span").text(convertVariableName(z1_variable));
  d3.select("#varpicker_z2").select("span").text(convertVariableName(z2_variable));
  setViewLink();
}

function setControlPanel(){
  d3.select("#varpicker_x").select("span").text(convertVariableName(x_variable));
  var varpicker_x = d3.select("#varpicker_x").select("ul").selectAll("li").data(variables);
  varpicker_x.enter().append("li").append("a").attr("href", "#").text(function(d){return convertVariableName(d);})
  .on("click", function(d) {
    setVariables2([d, y_variable, z1_variable, z2_variable],0);
    draw();
  });
  d3.select("#varpicker_y").select("span").text(convertVariableName(y_variable));
  var varpicker_y = d3.select("#varpicker_y").select("ul").selectAll("li").data(variables);
  varpicker_y.enter().append("li").append("a").attr("href", "#").text(function(d){return convertVariableName(d);})
  .on("click", function(d) {
    setVariables2([x_variable, d, z1_variable, z2_variable],1);
    draw();
  });
  d3.select("#varpicker_z1").select("span").text(convertVariableName(z1_variable));
  var varpicker_z1 = d3.select("#varpicker_z1").select("ul").selectAll("li").data(variables);
  varpicker_z1.enter().append("li").append("a").attr("href", "#").text(function(d){return convertVariableName(d);})
  .on("click", function(d) {
    setVariables2([x_variable, y_variable, d, z2_variable],2);
    draw();
  });
  d3.select("#varpicker_z2").select("span").text(convertVariableName(z2_variable));
  var varpicker_z2 = d3.select("#varpicker_z2").select("ul").selectAll("li").data(variables);
  varpicker_z2.enter().append("li").append("a").attr("href", "#").text(function(d){return convertVariableName(d);})
  .on("click", function(d) {
    setVariables2([x_variable, y_variable, z1_variable, d],3);
    draw();
  });

  d3.select("#datasetpicker").select("span").text(convertDatasetName(dataset));
  var datasetpicker = d3.select("#datasetpicker").select("ul").selectAll("li").data(datasets);
  datasetpicker.enter().append("li").append("a").attr("href", "#").text(function(d){return convertDatasetName(d);})
  .on("click", function(d) {
    dataset = d;
    setViewLink();
    d3.select("#datasetpicker").select("span").text(convertDatasetName(dataset));
    setColorScale(color);
    draw();
  });
  setViewLink();
}

function setViewLink(){
  var link = "focused.php?dataset1=" + dataset  + "&dataset2=" + dataset2 + "&dataset3=" + dataset3 + "&x=" + x_variable +  "&y=" + y_variable +   "&z1=" + z1_variable +  "&z2=" + z2_variable  +   "&Z1=" + z1_value +   "&Z2=" + z2_value;
	d3.select("#viewlink_f").attr("href", link);
	var link2 = "comparative.php?dataset1=" + dataset + "&dataset2=" + dataset2 + "&dataset3=" + dataset3 +  "&x=" + x_variable +  "&y=" + y_variable +   "&z1=" + z1_variable +  "&z2=" + z2_variable +   "&Z1=" + z1_value +   "&Z2=" + z2_value;
	d3.select("#viewlink_c").attr("href", link2);
}
