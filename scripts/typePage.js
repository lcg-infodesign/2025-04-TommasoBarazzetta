class TypePage {
  constructor(table, region, typeName) {
    this.table = table;
    this.region = region;
    this.typeName = typeName;
    this.volcanoes = [];

    for (let r = 0; r < table.getRowCount(); r++) {
      if (table.getString(r, "Country") === region &&
          table.getString(r, "Type") === typeName) {
        this.volcanoes.push({
          name: table.getString(r, "Volcano Name"),
          location: table.getString(r, "Location"),
          elev: table.getNum(r, "Elevation (m)"),
          status: table.getString(r, "Status"),
          eruption: table.getString(r, "Last Known Eruption"),
        });
      }
    }
    this.backButton = new BackButton();
  }

  display() {
    background(245);
    fill(30);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(`${this.typeName} in ${this.region}`, width / 2, 50);
    this.backButton.display();

    textAlign(LEFT, TOP);
    textSize(14);
    let y = 110;
    let lineH = 24;

    for (let v of this.volcanoes) {
      fill(50, 80, 130);
      textSize(16);
      text(v.name, 60, y);
      y += lineH;
      fill(60);
      textSize(13);
      text(
        `• Luogo: ${v.location} | Altitudine: ${v.elev} m | Stato: ${v.status} | Ultima eruzione: ${v.eruption}`,
        80,
        y
      );
      y += lineH + 10;

      // se si va oltre, crea spazio per scroll
      if (y > height - 80) {
        resizeCanvas(width, y + 100);
      }
    }
  }

  handleClick(mx, my) {
    if (this.backButton.isClicked(mx, my)) {
      return new RegionPage(this.table, this.region);
    }
    return null;
  }
}
