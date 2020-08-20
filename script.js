var currentIndex = 0;
var allData = [];
var imgs = [];
var divs = [];
var isLoading = true;
var isInstagram = true;
var scrollPos = 0;

var categories2 = [
  "FORM",
  "POWER",
  "RELATIONSHIPS",
  "MOVEMENT",
  "REPLAY",
  "WARP",
  "TOTAL"
];
var occurrences2 = [
  0,
  27,
  38,
  56,
  83,
  97
];
var categories3 = [
  "2D",
  "3D",
  "POLYDIMENSIONAL",
  "SURVEILLANCE CAPITALISM",
  "COLONIALISM",
  "HOME",
  "COMMUNITY",
  "ACTIONS",
  "PORTALS",
  "DERIVE",
  "BROADCAST",
  "STREAM",
  "HISTORY",
  "TIMELINES",
  "WARP"
];
var occurrences3 = [
  0,
  9,
  23,
  27,
  34,
  38,
  50,
  56,
  73,
  80,
  83,
  85,
  89,
  93,
  97
];

function setup() {
  google.charts.load('current');
  google.charts.setOnLoadCallback(init);

  createCanvas(windowWidth, windowHeight);
  initDivs();
}

function initDivs() {
  let num = 20;
  let inc = 10;
  for (let i = 0; i < num; i++) {
    let x = windowWidth/2+i*inc;
    let y = i*inc;
    divs[i] = new Window(x, y, 400, 400, i);
  }
}
function draw() {
  // background(0);
  // for (let i = 0; i < imgs.length; i++) {
  //   displayImage(i, 100+i*10, 50+i*10, 400, 400);
  // }
  updateDivs();
  drawTable();
}

function mouseReleased() {
  for (const div of divs) {
    div.endDrag();
  }
}

function updateDivs() {
  for (const div of divs) {
    div.update();
  }
}
function drawTable() {
  push();
  fill(255);
  let buffer = 30;
  let selectedC = color(100, 100, 255);
  let fSize = (windowHeight-buffer*2)/100;
  translate(buffer, 12+buffer);

  // col 1
  // textSize(12);
  // for (let i = 1; i <= 100; i++) {
  //   if (i === 1) text("DIGITAL SPACETIME", 0, i);
  //   else text("....", 0, i*fSize);
  // }

  // col 2
  // translate(140, 0);
  textSize(20);
  text("DIGITAL SPACETIME", 0, -8);

  textSize(16);
  stroke(50);
  line(0, 0, 0, windowHeight-2*buffer);

  // CAT 1
  translate(30, 20);
  line(0, 0, 0, windowHeight-2*buffer);
  let y = 0;
  fill(255);
  text("SPACE", 0, 0);
  if (currentIndex > 80) fill(255);
  else fill(selectedC);
  text("TIME", 0, 83*fSize);

  // CAT 2
  textSize(14);
  translate(30, 20);
  line(0, 0, 0, windowHeight-2*buffer);
  for (let i = 0; i < categories2.length; i++) {
    let occur = occurrences2[i];
    if (currentIndex >= occur) fill(255);
    else fill(selectedC);
    text(categories2[i], 0, occur*fSize);
  }

  // CAT 3
  textSize(12);
  translate(30, 20);
  line(0, 0, 0, windowHeight-2*buffer);
  for (let i = 0; i < categories3.length; i++) {
    let occur = occurrences3[i];
    if (currentIndex >= occur) fill(255);
    else fill(selectedC);
    text(categories3[i], 0, occur*fSize);
  }
  pop();
}

// function keyPressed() {
//   if (keyCode === UP_ARROW) {
//     currentIndex++;
//     currentIndex %= 100;
//     loadImageNum(currentIndex);
//   }
//   else if (keyCode === DOWN_ARROW) {
//     currentIndex--;
//     if (currentIndex < 0) currentIndex = 100;
//     loadImageNum(currentIndex);
//   }
// }

function mouseWheel(event) {
  let divisor = 30;
  // print(event.delta);
  //move the square according to the vertical scroll amount
  scrollPos += event.delta;
  scrollPos = constrain(scrollPos, 0, divisor*100);
  currentIndex = floor(scrollPos/divisor);
  currentIndex = constrain(currentIndex, 0, 100);
  loadContents();
  //uncomment to block page scrolling
  //return false;
}

function mod(a, b) {
  return (((a % b) + b) % b);
}

function loadContents() {
  for (let i = 0; i < divs.length; i++) {
    let ind = mod(currentIndex - i, divs.length);
    let url = allData[ind].img_url;
    // console.log("url", url, ind);
    if (url) {
      divs[i].setImageContent(ind);
    }
    else {
      divs[i].setImageContent(0);
    }
  }
}

function processSheetsData(response) {
  allData = [];
  var data = response.getDataTable();
  var columns = data.getNumberOfColumns();
  var rows = data.getNumberOfRows();

  var labels = [];
  labels[0] = 'id';
  for (var cc = 1; cc < columns; cc++) {
    let d = data.getFormattedValue(0, cc);
    if (d) labels[cc] = d;
  }
  console.log("labels", labels);

  for (var r = 1; r < rows; r++) {
    var row = {};
    for (var c = 0; c < columns; c++) {
      let d = data.getFormattedValue(r, c);
      let k = labels[c];
      if (k) {
        row[k] = d;
      }
    }
    allData.push(row);
  }
  // loadImageNum(0);
  select(".loading").style("display", "none");
  console.log("cell2", allData[2]);
  // renderData(array);
}

function init() {
  var url =
  'https://docs.google.com/spreadsheets/d/1eDXRWfqQo4ZCfXpfE1FASZFeNY8AdfKjOwKNxjJGHZE/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  // query.setQuery('select A, B');
  query.send(processSheetsData);
}
