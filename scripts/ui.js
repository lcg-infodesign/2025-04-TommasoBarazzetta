class BackButton {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.size = 40;
  }

  display() {
    fill(80);
    triangle(this.x, this.y, this.x + this.size, this.y - this.size / 2, this.x + this.size, this.y + this.size / 2);
  }

  isClicked(mx, my) {
    return (mx > this.x && mx < this.x + this.size &&
            my > this.y - this.size / 2 && my < this.y + this.size / 2);
  }
}
