let table;
let currentPage;
let selectedRegion = null;
let selectedType = null;

function preload() {
  table = loadTable('data/volcanoes.csv', 'csv', 'header');
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
  currentPage.display();
}

function mousePressed() {
  let nextPage = currentPage.handleClick(mouseX, mouseY);
  if (nextPage) currentPage = nextPage;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

