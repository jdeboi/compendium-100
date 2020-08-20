var currentIndex = 0;
var allData = [];
var imgs = [];
var graphics = [];
var isLoading = true;
var isInstagram = true;

function setup() {
  google.charts.load('current');
  google.charts.setOnLoadCallback(init);

  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    graphics[i] = createGraphics(400, 428);
  }
}

function draw() {
  background(0);
  for (let i = 0; i < imgs.length; i++) {
    displayImage(i, 100+i*10, 50+i*10, 400, 400);
  }
}

function displayImage(index, x, y, w, h) {
  let toolbarH = 28;
  // if (isInstagram) {
  //   clear();
  //   push();
  //   translate(x, y);
  //   fill(0);
  //   stroke(0);
  //   rect(0, 0, width, 200);
  //   pop();
  // }
  // else {
    // background(0);
    push();
    translate(x, y);
    // 0 = oldest
    let alpha = map(index, 0, 10, 0, 255);
    alpha = floor(alpha);
    alpha = constrain(alpha, 0, 255);


    graphics[index].clear();
    graphics[index].fill(150);
    graphics[index].stroke(150);
    graphics[index].rect(0, toolbarH/2, w, toolbarH/2);
    graphics[index].rect(0, 0, w, toolbarH, 8, 8);
    if (imgs[index]) graphics[index].image(imgs[index], 2, toolbarH, w, h);

    // tint(255, alpha);
    image(graphics[index], 0, 0);
    pop();
  // }

}
function keyPressed() {
  if (keyCode === UP_ARROW) {
    currentIndex++;
    currentIndex %= 100;
    loadImageNum(currentIndex%4);
  }
  else if (keyCode === DOWN_ARROW) {
    currentIndex--;
    if (currentIndex < 0) currentIndex = 100;
    loadImageNum(currentIndex%4);
  }
}

function loadImageNum(index) {
  // let path = allData[index].img_url;
  let path = "images/" + index + ".jpg";
  loadImage(path, (img) => {
    if (imgs.length < 10) {
      imgs.push(img);
    }
    else {
      imgs.shift();
      imgs.push(img);
    }
  });

  // if (feedback) {
  //   feedback.style.display = 'none';
  // }
  // else {
  //   console.log("no frame")
  // }
}

// function loadScreen() {
//   background(0);
//   fill(255);
//   textSize(100);
//   text("LOADING...", 20, 100);
// }

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
