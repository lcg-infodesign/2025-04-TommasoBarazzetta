class RegionPage {
  constructor(table, region, mapImage) {
    this.table = table;
    this.region = region;
    this.mapImage = mapImage;

    // filtra i vulcani dello stato
    this.volcanoes = [];
    for (let r = 0; r < this.table.getRowCount(); r++) {
      let country = this.table.getString(r, "Country");
      if (country === this.region) {
        let lat = this.table.getNum(r, "Latitude");
        let lon = this.table.getNum(r, "Longitude");
        let name = this.table.getString(r, "Volcano Name");
        let elev = this.table.getString(r, "Elevation (m)");
        let type = this.table.getString(r, "Type");
        this.volcanoes.push({ name, lat, lon, elev, type });
      }
    }

    this.types = this.getTypeCounts();
    this.typeBoxes = [];

    this.mapX = 80;
    this.mapW = width - 160;
    this.mapH = this.mapW / 2; // proporzione 2:1 
    this.mapY = 120;


    this.margin = 60;
    this.boxPadding = 25;
    this.cols = 4; // 4 colonne piccole in basso
    this.createTypeBoxes();

    this.backButton = new BackButton();

    this.lonMin = -180;
    this.lonMax = 180;
    this.latMin = -90;
    this.latMax = 90;
  }

  // ✅ Funzione corretta spostata fuori dal costruttore
  latLonToXY(lat, lon) {
    let x = map(lon, this.lonMin, this.lonMax, this.mapX, this.mapX + this.mapW);
    let y = map(lat, this.latMax, this.latMin, this.mapY, this.mapY + this.mapH);
    return { x, y };
  }

  getTypeCounts() {
    let counts = {};
    for (let v of this.volcanoes) {
      if (!v.type) continue;
      if (!counts[v.type]) counts[v.type] = 0;
      counts[v.type]++;
    }
    return Object.fromEntries(
      Object.entries(counts).sort((a, b) => b[1] - a[1])
    );
  }

  createTypeBoxes() {
  let keys = Object.keys(this.types);

  // Dimensione e posizionamento box
  let w = (width - this.margin * 2) / this.cols;
  let h = 90;
  let x = this.margin;

  // 🔹 Posiziona subito sotto la mappa, con un po’ di spazio
  let y = this.mapY + this.mapH + 60;

  this.typeBoxes = [];

  for (let i = 0; i < keys.length; i++) {
    let name = keys[i];
    let count = this.types[name];
    this.typeBoxes.push({ name, count, x, y, w, h });

    x += w;
    if ((i + 1) % this.cols === 0) {
      x = this.margin;
      y += h + this.boxPadding;
    }
  }

  // 🔹 Adatta l’altezza del canvas solo se necessario (senza scorrimento inutile)
  let rows = ceil(keys.length / this.cols);
  let totalHeight = this.mapY + this.mapH + 100 + rows * (h + this.boxPadding);
  resizeCanvas(width, totalHeight + 100); 
}


  display() {
    background(245);
    textAlign(CENTER, CENTER);
    fill(30);
    textSize(26);
    text(`Mappa vulcani ${this.region}`, width / 2, 50);
    this.backButton.display();

    // Mappa
    if (this.mapImage && this.mapImage.width > 0) {
      let imgRatio = this.mapImage.width / this.mapImage.height;
      let boxRatio = this.mapW / this.mapH;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > boxRatio) {
        drawW = this.mapW;
        drawH = this.mapW / imgRatio;
        drawX = this.mapX;
        drawY = this.mapY + (this.mapH - drawH) / 2;
      } else {
        drawH = this.mapH;
        drawW = this.mapH * imgRatio;
        drawY = this.mapY;
        drawX = this.mapX + (this.mapW - drawW) / 2;
      }

      image(this.mapImage, drawX, drawY, drawW, drawH);
    } else {
      fill(230);
      stroke(200);
      rect(this.mapX, this.mapY, this.mapW, this.mapH, 20);
      fill(100);
      noStroke();
      textSize(20);
      text("Mappa non disponibile", width / 2, this.mapY + this.mapH / 2);
    }

    // Vulcani
    noStroke();
    fill(255, 80, 50, 180);
    let hoveredVolcano = null;
for (let v of this.volcanoes) {
  let coords = this.latLonToXY(v.lat, v.lon);
  ellipse(coords.x, coords.y, 8, 8);

  if (dist(mouseX, mouseY, coords.x, coords.y) < 6) {
    hoveredVolcano = { ...v, x: coords.x, y: coords.y };
  }
}

// mostra il tooltip una sola volta
if (hoveredVolcano) {
  fill(0, 160);
  rect(mouseX + 10, mouseY - 40, 200, 50, 8);
  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  text(`${hoveredVolcano.name}\nAltitudine: ${hoveredVolcano.elev} mslm`,
       mouseX + 16, mouseY - 36);
}

    // Riquadri tipi
    for (let box of this.typeBoxes) {
      fill(80, 140, 190);
      noStroke();
      rect(box.x, box.y, box.w - 10, box.h - 10, 12);

      fill(255);
      textAlign(CENTER, CENTER);
      textSize(16);
      text(box.name, box.x + (box.w - 10) / 2, box.y + (box.h - 10) / 2 - 8);
      textSize(11);
      text(`${box.count} vulcani`, box.x + (box.w - 10) / 2, box.y + (box.h - 10) / 2 + 12);
    }
  }

  handleClick(mx, my) {
    if (this.backButton.isClicked(mx, my)) return new WorldPage(this.table);

    for (let box of this.typeBoxes) {
      if (mx > box.x && mx < box.x + box.w - 10 &&
          my > box.y && my < box.y + box.h - 10) {
        return new TypePage(this.table, this.region, box.name);
      }
    }
    return null;
  }
}
