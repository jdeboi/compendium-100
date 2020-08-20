var currentIndex = 0;
var allData = [];
var imgs = [];
var divs = [];
var contents = [];
var isLoading = true;
var isInstagram = true;

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
    divs[i] = createDiv();
    divs[i].id("c" + i);
    divs[i].class("card");
    // divs[i].addClass("draggable");
    // divs[i].style("display", "none");
    let w = 400; //floor(map(i, 0, num, 20, 400));
    divs[i].style("width", w + "px");
    divs[i].style("height", w + "px");
    divs[i].style("top", i*inc + "px");
    divs[i].style("left", windowWidth/2+i*inc + "px");
    divs[i].style("opacity", map(i, 0, num, 0, 1));
    // divs[i].style("display", "none");

    let toolbar = createDiv();
    toolbar.class("toolbar");
    toolbar.parent(divs[i]);
    toolbar.style("top", "0px");

    let button1 = createDiv();
    button1.class("button1");
    button1.addClass("button");
    button1.parent(toolbar);

    let button2 = createDiv();
    button2.class("button2");
    button2.addClass("button");
    button2.parent(toolbar);

    let button3 = createDiv();
    button3.class("button3");
    button3.addClass("button");
    button3.parent(toolbar);

    contents[i] = createDiv();
    contents[i].class("content");
    contents[i].parent(divs[i]);

  }
}
function draw() {
  // background(0);
  // for (let i = 0; i < imgs.length; i++) {
  //   displayImage(i, 100+i*10, 50+i*10, 400, 400);
  // }
  drawTable();
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

  translate(30, 20);
  line(0, 0, 0, windowHeight-2*buffer);
  for (let i = 1; i <= 100; i++) {
    if (currentIndex >= i) fill(255);
    else fill(selectedC);
    if (i === 1) text("SPACE", 0, 0);
    else if (i === 80) text("TIME", 0, i*fSize);
    // else text("...", 0, i*fSize);
  }

  // col 3
  textSize(14);
  translate(30, 20);
  line(0, 0, 0, windowHeight-2*buffer);
  for (let i = 1; i <= 100; i++) {
    if (currentIndex >= i) fill(255);
    else fill(selectedC);
    if (i === 1) text("REPRESENTATIONS", 0, 0);
    else if (i === 20) text("MOVEMENTS", 0, i*fSize);
    else if (i === 50) text("CONCEPTIONS", 0, i*fSize);
    // else text("..", 0, i*fSize);
  }

  // textSize(fSize*.5+fSize/2);
  // for (let i = 1; i <= 100; i++) {
  //
  //
  //   if (currentIndex === i) fill(selectedC);
  //   text(i, 200, i*fSize);
  // }
  textSize(12);
  translate(30, 20);
  line(0, 0, 0, windowHeight-2*buffer);
  for (let i = 1; i <= 100; i++) {
    fill(255);
    // textSize(fSize*.5+fSize/2);
    if (currentIndex >= i) fill(255);
    else fill(selectedC);
    if (i === 1) text("PORTALS", 0, 0);
    else if (i === 20) text("ACTIONS", 0, i*fSize);
    else if (i === 30) text("DERIVE", 0, i*fSize);
    // text('.', 0, i*fSize);
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
  print(event.delta);
  //move the square according to the vertical scroll amount
  currentIndex += constrain(event.delta, -1, 1);
  if (currentIndex > 10) currentIndex = 10;
  else if (currentIndex < 0) currentIndex = 10;
  loadImageNum(currentIndex);
  //uncomment to block page scrolling
  //return false;
}

function loadImageNum(currentIndex) {
  for (let i = 0; i < contents.length; i++) {
    let ind = currentIndex - i;
    if (ind < 0) ind += contents.length;
    contents[i].style("background-image", `url(images/${ind}.jpg)`);
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
  console.log(labels);

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
  // renderData(array);
}

function init() {
  var url =
  'https://docs.google.com/spreadsheets/d/1eDXRWfqQo4ZCfXpfE1FASZFeNY8AdfKjOwKNxjJGHZE/edit?usp=sharing';
  var query = new google.visualization.Query(url);
  // query.setQuery('select A, B');
  query.send(processSheetsData);
}
