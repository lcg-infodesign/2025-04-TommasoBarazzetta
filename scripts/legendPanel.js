class LegendPanel {
  constructor() {
    this.open = false;
    this.btnX = width - 60;
    this.btnY = 20;
    this.btnSize = 32;

    this.panelW = 280;
    this.panelH = 260;
    this.panelX = width - this.panelW - 20;
    this.panelY = 70;
  }

  updatePosition() {
    this.btnX = width - 60;
    this.panelX = width - this.panelW - 20;
  }

  display() {
    // Bottone
    fill(50, 90, 160);
    noStroke();
    ellipse(this.btnX, this.btnY, this.btnSize);

    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("ℹ️", this.btnX, this.btnY);

    // Pannello
    if (this.open) {
      fill(255, 240);
      stroke(180);
      rect(this.panelX, this.panelY, this.panelW, this.panelH, 12);

      noStroke();
      fill(40);
      textAlign(LEFT, TOP);
      textSize(14);

      let txt =
        "LEGENDA\n\n" +
        "La pagina mostra la distribuzione dei  \n" +
        "vulcani filtrati per stato. Gli stati sono \n" +
        "in ordine dalla concetrazione maggiore  \n"+
        "a quella minore. Con un click sullo stato\n " +
        "si visualizza la mappa, passando sopra i \n"+
        "vulcani si visualizzano alcune info \n"+
        "principali, scendendo si può visualizzare \n"+
        "la pagina specifica per tipologia di vulcano.";

      text(txt, this.panelX + 15, this.panelY + 15);
    }
  }

  handleClick(mx, my) {
    // click sul bottone
    if (dist(mx, my, this.btnX, this.btnY) < this.btnSize / 2) {
      this.open = !this.open;
      return true;
    }

    // click dentro la legenda aperta → blocca click
    if (this.open &&
        mx > this.panelX &&
        mx < this.panelX + this.panelW &&
        my > this.panelY &&
        my < this.panelY + this.panelH) {
      return true;
    }

    return false;
  }
}
