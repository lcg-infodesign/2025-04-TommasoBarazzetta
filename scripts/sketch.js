let table;
let currentPage;
let selectedRegion = null;
let selectedType = null;
let worldMap;
function preload() {
  
  
  table = loadTable('data/volcanoes.csv', 'csv', 'header');
  worldMap = loadImage('data/world-map.png');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Helvetica');
  textAlign(CENTER, CENTER);
  noStroke();

  currentPage = new WorldPage(table);
}

function draw() {
  background(240);
  if (currentPage) currentPage.display();
}

function mousePressed() {
  if (currentPage && currentPage.handleClick) {
    let nextPage = currentPage.handleClick(mouseX, mouseY);
    if (nextPage) {
      currentPage = nextPage;
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

