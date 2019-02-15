<!DOCTYPE html>
<meta charset="utf-8">
<html>
<head>
  <link rel="stylesheet" href="./css/bootstrap.min.css">
  <link rel="stylesheet" href="./css/my.css">
  <link rel="stylesheet" href="./css/bootstrap-slider.min.css">
  <script src="./js/jquery-3.1.1.min.js"></script>
  <script src="./js/d3.v3.js"></script>
  <script src="./js/bootstrap.min.js"></script>
  <script src="./js/d3-legend.min.js"></script>
  <script src="./js/bootstrap-slider.min.js"></script>
  <script src="https://d3js.org/d3-queue.v3.min.js"></script>
</head>
<?php
exec('ls data', $out, $ret);
function rep ($x){
  return str_replace(".tsv", "", $x);
}
$datasets = array_map("rep", $out);
$dataset1 = $datasets[0];
$dataset2 = $datasets[1];
$dataset3 = $datasets[2];



$fp = fopen('data/'.$out[0], 'r');
$tmp = fgets($fp);
$tmp = explode("\t", $tmp);
$v1 = $tmp[0];    # name of the 1st variable
$v2 = $tmp[1];    # name of the 2nd variable
$v3 = $tmp[2];    # name of the 3rd variable
$v4 = $tmp[3];    # name of the 4th variable

$i = 0;
$V1 = array();
$V2 = array();
$V3 = array();
$V4 = array();
while (!feof($fp)) {
  $tmp = fgets($fp);
  $tmp = explode("\t", $tmp);
  if(count($tmp) > 3){
    $V1[$i] = $tmp[0];
    $V2[$i] = $tmp[1];
    $V3[$i] = $tmp[2];
    $V4[$i] = $tmp[3];
    $i++;
}
}
fclose($fp);
$V1 = array_values(array_unique($V1));  # values of the 1st variable
$V2 = array_values(array_unique($V2));  # values of the 2nd variable
$V3 = array_values(array_unique($V3));  # values of the 3rd variable
$V4 = array_values(array_unique($V4));  # values of the 4th variable


$v2V = [$v1 => $V1, $v2 => $V2, $v3 => $V3, $v4 => $V4];


$tmp = [$v1 => count($V1), $v2 => count($V2), $v3 => count($V3), $v4 => count($V4)];
arsort($tmp);
$tmp =  array_keys($tmp);
$u1 = $tmp[0];  # name of the 1st of the sorted variables
$u2 = $tmp[1];  # name of the 2nd of the sorted variables
$u3 = $tmp[2];  # name of the 3rd of the sorted variables
$u4 = $tmp[3];  # name of the 4th of the sorted variables
$z1 = "";
$z2 = "";

if(isset($_GET['dataset1'])) {
  $dataset1 = $_GET['dataset1'];
  $dataset2 = $_GET['dataset2'];
  $dataset3 = $_GET['dataset3'];
 	$u1 = $_GET['x'];
 	$u2 = $_GET['y'];
 	$u3 = $_GET['z1'];
 	$u4 = $_GET['z2'];
  $z1 = $_GET['Z1'];
  $z2 = $_GET['Z2'];
}

function json_safe_encode($data){
  return json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
}

?>

<header  class="header">
  <ul class="nav nav-tabs">
    <li><a href="about.html">&nbsp;About&nbsp;</a></li>
    <li class="active"><a id="viewlink_f">&nbsp;Focused View&nbsp;</a></li>
    <li><a id="viewlink_c">&nbsp;Comparative View&nbsp;</a></li>
  </ul>
</header>

<body>
<div class="container-fluid">
    <div class="row control-panel">
        <div class="container col-md-2">
            <div class="btn-toolbar" role="toolbar" aria-label="...">
                <div id="varpicker_x" class="btn-group" data-toggle="buttons">
                    <label class="btn btn-label bold">
                        X
                    </label>
                    <div class="btn-group" role="group">
                        <div class="btn btn-default active dropdown-toggle" data-toggle="dropdown">
                            <span></span>
                            <i class="fa fa-angle-down"></i>
                        </div>
                        <ul class="dropdown-menu" role="menu">
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container col-md-2">
            <div id="varpicker_y" class="btn-group" data-toggle="buttons">
                <label class="btn btn-label bold">
                    Y
                </label>
                <div class="btn-group" role="group">
                    <div class="btn btn-default active dropdown-toggle" data-toggle="dropdown">
                        <span></span>
                        <i class="fa fa-angle-down"></i>
                    </div>
                    <ul class="dropdown-menu" role="menu">
                    </ul>
                </div>
            </div>
        </div>

        <div class="container col-md-2">
            <div id="varpicker_z1" class="btn-group" data-toggle="buttons">
                <label class="btn btn-label bold">
                    Z
                </label>
                <div class="btn-group" role="group">
                    <div class="btn btn-default active dropdown-toggle" data-toggle="dropdown">
                        <span></span>
                        <i class="fa fa-angle-down"></i>
                    </div>
                    <ul class="dropdown-menu" role="menu">
                    </ul>
                </div>
            </div>
        </div>

        <div class="container col-md-2">
            <div id="varpicker_z2" class="btn-group" data-toggle="buttons">
                <label class="btn btn-label bold">
                    W
                </label>
                <div class="btn-group" role="group">
                    <div class="btn btn-default active dropdown-toggle" data-toggle="dropdown">
                        <span></span>
                        <i class="fa fa-angle-down"></i>
                    </div>
                    <ul class="dropdown-menu" role="menu">
                    </ul>
                </div>
            </div>
        </div>

        <div class="container col-md-4">
             <div id="datasetpicker" class="btn-group" data-toggle="buttons">
                <label class="btn btn-label bold">
                    <font color="red">statistic</font>
                </label>
                <div class="btn-group" role="group">
                    <div class="btn btn-default active dropdown-toggle" data-toggle="dropdown">
                        <span></span>
                        <i class="fa fa-angle-down"></i>
                    </div>
                    <ul class="dropdown-menu" role="menu"></ul>
                </div>
            </div>
        </div>
    </div>

   <!--  <div class="row control-panel">


        <div id="prmpicker1"  class="container col-md-1">
            <label class="btn btn-label bold">
            </label>
        </div>
        <div class="container col-md-5">
            <input id="pp1Slider" data-slider-id='pp1Slider' type="text" />
        </div>


        <div id="prmpicker2"  class="container col-md-1">
            <label class="btn btn-label bold">
            </label>
        </div>
        <div class="container col-md-5">
            <input id="pp2Slider" data-slider-id='pp2Slider' type="text" />
        </div>

    </div>
 -->

    <div class="row charts">
        <div class="container col-md-6">
            <div id="chart1"　class="row"></div>
        </div>
        <div class="container col-md-6">
            <div id="chart2"　class="row"></div>
        </div>
    </div>
    <div class="row images">
        <div id="image"></div>
    </div>
</div>

<script id="script"  src="./js/my.js"
data-dataset1  ='<?php echo json_safe_encode($dataset1); ?>'
data-dataset2  ='<?php echo json_safe_encode($dataset2); ?>'
data-dataset3  ='<?php echo json_safe_encode($dataset3); ?>'
data-x  ='<?php echo json_safe_encode($u1); ?>'
data-y  ='<?php echo json_safe_encode($u2); ?>'
data-z1  ='<?php echo json_safe_encode($u3); ?>'
data-z2  ='<?php echo json_safe_encode($u4); ?>'
data-datasets  ='<?php echo json_safe_encode($datasets); ?>'
data-v1  ='<?php echo json_safe_encode($v1); ?>'
data-v2  ='<?php echo json_safe_encode($v2); ?>'
data-v3  ='<?php echo json_safe_encode($v3); ?>'
data-v4  ='<?php echo json_safe_encode($v4); ?>'
data-u1  ='<?php echo json_safe_encode($V1); ?>'
data-u2  ='<?php echo json_safe_encode($V2); ?>'
data-u3  ='<?php echo json_safe_encode($V3); ?>'
data-u4  ='<?php echo json_safe_encode($V4); ?>'
data-z1value  ='<?php echo json_safe_encode($z1); ?>'
data-z2value  ='<?php echo json_safe_encode($z2); ?>'
></script>

</body>
<footer id="footer">
  <p>&nbsp;</p>
  <p>&nbsp;</p>
</footer>
</html>
