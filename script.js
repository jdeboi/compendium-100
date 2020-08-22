var currentIndex = 0;
var allData = [];
var imgs = [];
var divs = [];
var isLoading = true;
var isInstagram = true;
var scrolling = false;
var scrollPos = 0;
var divSize = 400;
var font;

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
  30,
  41,
  60,
  83,
  96
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
  11,
  25,
  30,
  37,
  41,
  54,
  60,
  71,
  80,
  83,
  89,
  92,
  96
];

function setup() {
  google.charts.load('current');
  google.charts.setOnLoadCallback(init);

  font = loadFont("fonts/Moon Light.otf");
  createCanvas(windowWidth, windowHeight);
  initDivs();
}

function initDivs() {
  let num = 20;
  let inc = 10;
  for (let i = 0; i < num; i++) {
    let x = windowWidth/2+i*inc;
    let y = 60+i*inc;
    divs[i] = new Window(x, y, 400, 400, i);
  }
}
function draw() {
  background(0);
  updateDivs();
  drawTable();
}

function keyPressed() {
  if (key === 'r') {
    resetDivs();
  }
  if (key === 's') {
    scrolling = true;
  }
}

function keyReleased() {
  if (key === 's') {
    scrolling = false;
  }
}
function mouseReleased() {
  for (const div of divs) {
    div.endDrag();
  }
}

function resetDivs() {
  divSize = 400;
  for (const div of divs) {
    div.resetWindow();
  }
}

function setDivSize() {
  for (const div of divs) {
    div.setSize(divSize);
  }
}

function updateDivs() {
  for (const div of divs) {
    div.update();
  }
}

function preloadImages() {
  for (let i = 0; i < allData.length; i++) {
    let path = allData[i].img_url;
    let isGif = allData[i].isGif == 1 ? true: false;
    let end = isGif?"gif":"jpg";
    let url = `images/${path}.${end}`;
    let img=new Image();
    img.src=url;
  }
}

function drawTable() {
  push();
  fill(255);
  let topBuffer = 50;
  let bottomBuffer = 100;
  let selectedC = color(100, 100, 255);
  let lenTable = windowHeight-topBuffer-bottomBuffer;
  let lineL = lenTable+bottomBuffer/2;
  let fSize = lenTable/100;
  let xDis = 140;
  let yDis = 0;
  translate(topBuffer, 12+topBuffer);

  // CAT 0
  textFont(font);
  textSize(24);
  text("DIGITAL SPACETIME", 0, -8);

  // CAT 1
  translate(0, 50);
  textSize(16);
  stroke(50);
  let y = 0;
  fill(255);
  if (currentIndex > 1) fill(255);
  else fill(selectedC);
  text("SPACE", 0, 0);

  if (currentIndex > 80+19) fill(255);
  else fill(selectedC);
  text("TIME", 0, 83*fSize);

  // CAT 2
  textSize(14);
  translate(xDis, yDis);
  // line(-5, -10, -5, lineL-40);
  for (let i = 0; i < categories2.length; i++) {
    let occur = occurrences2[i];
    if (i == 0) {
      if (currentIndex > 1) fill(255);
      else fill(selectedC);
    }
    else {
      if (currentIndex >= occur+19 && currentIndex > 1) fill(255);
      else fill(selectedC);
    }
    text(categories2[i], 0, occur*fSize);
  }

  // CAT 3
  textSize(12);
  translate(xDis, yDis);
  for (let i = 0; i < categories3.length; i++) {
    let occur = occurrences3[i];
    if (i == 0) {
      if (currentIndex > 1) fill(255);
      else fill(selectedC);
    }
    else {
      if (currentIndex >= occur+19 && currentIndex > 1) fill(255);
      else fill(selectedC);
    }
    text(categories3[i], 0, occur*fSize);
  }
  pop();
}

function mouseWheel(event) {
  // let scrolling = select("#checkScroll").value();

  if (!scrolling) {

    let divisor = 30;
    // print(event.delta);
    //move the square according to the vertical scroll amount
    scrollPos -= event.delta;
    scrollPos = constrain(scrollPos, 0, divisor*(100+divs.length));
    currentIndex = floor(scrollPos/divisor);
    currentIndex = constrain(currentIndex, 0, 100+divs.length);
    loadContents();
    //uncomment to block page scrolling
  }
  else {

    divSize -= event.delta/10;
    divSize = floor(divSize);
    divSize = constrain(divSize, 100, 500);
    setDivSize();
  }
  return false;
}

function mod(a, b) {
  return (((a % b) + b) % b);
}

function loadContents() {
  for (let i = 0; i <divs.length; i++) {
    let ind = currentIndex - i; //mod(currentIndex - i, 100);

    if (ind >= 0 && ind < 100) {

      let url = +allData[ind].img_url;
      // console.log(i, ind, currentIndex, url, allData[ind]);
      let isGif = allData[ind].isGif == 1 ? true: false;
      let title = allData[ind].title;
      divs[i].setImageContent(ind, url, title, isGif);
    }
    else {
      divs[i].setEmpty();
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
  // console.log("labels", labels);

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
  // console.log(0, allData[0]);
  // console.log(1, allData[1]);
  // console.log(2, allData[2]);

  // loadImageNum(0);
  select(".loading").style("display", "none");

  preloadImages();
  // renderData(array);
}

function init() {
  var url =
  'https://docs.google.com/spreadsheets/d/1eDXRWfqQo4ZCfXpfE1FASZFeNY8AdfKjOwKNxjJGHZE/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  // query.setQuery('select A, B');
  query.send(processSheetsData);
}
