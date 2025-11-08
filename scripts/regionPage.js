class RegionPage {
  constructor(table, region) {
    this.table = table;
    this.region = region;
    this.types = this.getTypeCounts();
    this.typeBoxes = [];
    this.cols = 2;          // 2 colonne per leggibilità
    this.margin = 60;
    this.boxPadding = 25;
    this.createBoxes();
    this.backButton = new BackButton();
  }

  getTypeCounts() {
    let counts = {};
    for (let r = 0; r < this.table.getRowCount(); r++) {
      if (this.table.getString(r, 'Country') === this.region) {
        let type = this.table.getString(r, 'Type');
        if (!type || type === "") continue;
        if (!counts[type]) counts[type] = 0;
        counts[type]++;
      }
    }
    return Object.fromEntries(
      Object.entries(counts).sort((a, b) => b[1] - a[1])
    );
  }

  createBoxes() {
    let keys = Object.keys(this.types);
    let w = (width - this.margin * 2) / this.cols;
    let h = 120; // 🔹 più basso
    let x = this.margin;
    let y = 120;

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

    // adatta altezza canvas
    let rows = ceil(keys.length / this.cols);
    let neededHeight = 120 + rows * (h + this.boxPadding);
    resizeCanvas(width, max(height, neededHeight + 80));
  }

  display() {
    background(245);
    fill(30);
    textSize(26);
    textAlign(CENTER, CENTER);
    text(`Tipologie di vulcani in ${this.region}`, width / 2, 50);
    this.backButton.display();

    for (let box of this.typeBoxes) {
      fill(110, 150, 200);
      noStroke();
      rect(box.x, box.y, box.w - 10, box.h - 10, 15);

      // 🔹 Disegno simbolico del tipo (sinistra del box)
      push();
      translate(box.x + 30, box.y + box.h / 2);
      this.drawTypeSymbol(box.name);
      pop();

      // 🔹 Testo allineato a sinistra
      fill(255);
      textAlign(LEFT, CENTER);
      textSize(16);
      let textX = box.x + 70;
      let textY = box.y + box.h / 2 - 12;
      text(box.name, textX, textY);
      textSize(13);
      text(`${box.count} vulcani`, textX, textY + 22);
    }
  }

  drawTypeSymbol(typeName) {
    noStroke();
    fill(255, 230, 180);

    // simboli stilizzati per tipo
    if (typeName.toLowerCase().includes("shield")) {
      // vulcano a scudo → basso e largo
      triangle(-20, 10, 0, -10, 20, 10);
    } else if (typeName.toLowerCase().includes("strato")) {
      // stratovulcano → cono ripido
      triangle(-10, 10, 0, -20, 10, 10);
    } else if (typeName.toLowerCase().includes("complex")) {
      // complesso → più punte
      triangle(-15, 10, 0, -15, 15, 10);
      triangle(-10, 10, 0, -5, 10, 10);
    } else if (typeName.toLowerCase().includes("caldera")) {
      // caldera → cerchio vuoto
      stroke(255, 230, 180);
      noFill();
      ellipse(0, 0, 20, 10);
      noStroke();
    } else {
      // tipo generico
      ellipse(0, 0, 10, 10);
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
