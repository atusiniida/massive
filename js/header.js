var $script     = $('#script');
var datasets      = JSON.parse($script.attr('data-datasets'));
var v1      = JSON.parse($script.attr('data-v1'));
var v2      = JSON.parse($script.attr('data-v2'));
var v3      = JSON.parse($script.attr('data-v3'));
var v4      = JSON.parse($script.attr('data-v4'));
var V1      = JSON.parse($script.attr('data-u1'));
var V2      = JSON.parse($script.attr('data-u2'));
var V3      = JSON.parse($script.attr('data-u3'));
var V4      = JSON.parse($script.attr('data-u4'));

var variables = [v1,v2,v3,v4];
var variable2values = {};
variable2values[v1] = V1;
variable2values[v2] = V2; 
variable2values[v3] = V3;
variable2values[v4] = V4;


var margin = { top: 20, right: 10, bottom: 20, left: 10 }, heatmapHeight, heatmapWidth; beteenSpaceProp = 0.05,labelSpaceWidth = 50;

var margin = { top: 20, right: 10, bottom: 20, left: 10 }, heatmapSize = 200, labelSpaceWidth = 40;

var  x_variable, y_variable, z1_variable, z2_variable, x_values, y_values,  z1_values, z2_values, x_index, y_index;
var width,height;
var gridWidth, gridHeight;
var z1_value, z2_value;

var Data = {}; 

var legendWidth = heatmapSize - labelSpaceWidth*2, legendHeight = 10;