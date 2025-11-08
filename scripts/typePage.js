let worldMapData;  // variabile globale

function preload() {
  table = loadTable('data/volcanoes.csv', 'csv', 'header');
  worldMapData = loadJSON('data/world.geojson');
}

class TypePage {
  constructor(table, region, type) {
    this.table = table;
    this.region = region;
    this.type = type;
    this.volcanoes = this.filterVolcanoes();
    this.backButton = new BackButton();
  }

  filterVolcanoes() {
    let list = [];
    for (let r = 0; r < this.table.getRowCount(); r++) {
      if (this.table.getString(r, 'Country') === this.region &&
          this.table.getString(r, 'Type') === this.type) {
        list.push({
          name: this.table.getString(r, 'Volcano Name'),
          lat: this.table.getNum(r, 'Latitude'),
          lon: this.table.getNum(r, 'Longitude'),
          elev: this.table.getString(r, 'Elevation (m)'),
          location: this.table.getString(r, 'Country')
        });
      }
    }
    return list;
  }

  display() {
    background(230);
    fill(30);
    textSize(26);
    text(`${this.type} in ${this.region}`, width / 2, 50);
    this.backButton.display();
  // 🔹 Disegna outline semplificato del mondo (solo contorni)
    noFill();
    stroke(180);
    strokeWeight(0.5);

for (let feature of worldMapData.features) {
  beginShape();
  for (let coord of feature.geometry.coordinates.flat(1)) {
    if (Array.isArray(coord[0])) continue;
    let lon = coord[0];
    let lat = coord[1];
    let x = map(lon, -180, 180, 100, width - 100);
    let y = map(lat, 90, -90, 100, height - 100);
    vertex(x, y);
  }
  endShape();
}

    // Disegno semplice (puoi sostituire con mappa reale)
    for (let v of this.volcanoes) {
      let x = map(v.lon, -180, 180, 100, width - 100);
      let y = map(v.lat, 90, -90, 100, height - 100);

      fill(200, 50, 50);
      ellipse(x, y, 10, 10);

      if (dist(mouseX, mouseY, x, y) < 10) {
        fill(255);
        rect(mouseX + 10, mouseY - 50, 220, 60, 8);
        fill(0);
        textSize(12);
        textAlign(LEFT, TOP);
        text(`${v.name}\n${v.elev} m\n${v.location}`, mouseX + 15, mouseY - 45);
        textAlign(CENTER, CENTER);
      }
    }
  }

  handleClick(mx, my) {
    if (this.backButton.isClicked(mx, my)) return new RegionPage(this.table, this.region);
    return null;
  }
}
