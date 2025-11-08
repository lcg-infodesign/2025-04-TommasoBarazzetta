class WorldPage {
  constructor(table) {
    this.table = table;
    this.regions = this.getRegionCounts();
    this.regionBoxes = [];
    this.cols = 3; // colonne nella griglia
    this.margin = 40; // margine generale
    this.boxPadding = 20;
    this.createBoxes();
  }

  getRegionCounts() {
    let counts = {};
    for (let r = 0; r < this.table.getRowCount(); r++) {
      let region = this.table.getString(r, 'Country');
      if (!region || region === "") continue;
      if (!counts[region]) counts[region] = 0;
      counts[region]++;
    }

    // Ordina per numero decrescente
    return Object.fromEntries(
      Object.entries(counts).sort((a, b) => b[1] - a[1])
    );
  }

  createBoxes() {
    let keys = Object.keys(this.regions);
    let w = (width - this.margin * 2) / this.cols;
    let h = 150;
    let x = this.margin;
    let y = 120;

    for (let i = 0; i < keys.length; i++) {
      let name = keys[i];
      let count = this.regions[name];
      this.regionBoxes.push({
        name,
        count,
        x,
        y,
        w,
        h
      });

      x += w;
      if ((i + 1) % this.cols === 0) {
        x = this.margin;
        y += h + this.boxPadding;
      }
    }

    // Adatta l’altezza del canvas in base alle righe
    let rows = ceil(keys.length / this.cols);
    let neededHeight = 120 + rows * (150 + this.boxPadding);
    resizeCanvas(width, max(height, neededHeight + 50));
  }

  display() {
    background(245);
    fill(30);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("Distribuzione dei vulcani per Paese", width / 2, 50);

    let maxCount = max(Object.values(this.regions));

    for (let box of this.regionBoxes) {
      // Colore coerente: scala dal verde chiaro al verde scuro
      let intensity = map(box.count, 1, maxCount, 180, 50);
      fill(70, intensity, 90);
      noStroke();
      rect(box.x, box.y, box.w - 10, box.h - 10, 20);

      // Testo centrato
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      text(box.name, box.x + (box.w - 10) / 2, box.y + (box.h - 10) / 2 - 15);
      textSize(13);
      text(`${box.count} vulcani`, box.x + (box.w - 10) / 2, box.y + (box.h - 10) / 2 + 15);
    }
  }

  handleClick(mx, my) {
    for (let box of this.regionBoxes) {
      if (mx > box.x && mx < box.x + box.w - 10 &&
          my > box.y && my < box.y + box.h - 10) {
        return new RegionPage(this.table, box.name);
      }
    }
    return null;
  }
}
