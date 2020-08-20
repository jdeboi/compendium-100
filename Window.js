class Window {
  constructor (x, y, w, h, id) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.offsetX = 0;
    this.offsetY = 0;
    this.opacity = map(this.id, 0, 20, 0, 1);
    this.minimize = false;
    this.dragging = {dragging: false};

    this.div = createDiv();
    this.div.id("c" + this.id);
    this.div.class("card");
    // divs[i].addClass("draggable");
    // divs[i].style("display", "none");
    //floor(map(i, 0, num, 20, 400));
    this.div.style("width", this.w + "px");
    // this.div.style("height", this.w + "px");
    this.div.position(this.x, this.y);
    this.div.style("opacity", this.opacity);
    // divs[i].style("display", "none");

    this.toolbar = createDiv();
    this.toolbar.class("toolbar");
    this.toolbar.parent(this.div);
    this.toolbar.style("top", "0px");
    this.toolbar.mousePressed(() => this.draggingOn(this.dragging));
    // this.toolbar.mouseReleased(() => this.draggingDone(this.dragging));

    this.content = createDiv();
    this.content.class("content");
    this.content.parent(this.div);

    this.buttons = createDiv();
    this.buttons.addClass("buttons");
    this.buttons.parent(this.toolbar);

    this.button1 = createDiv();
    this.button1.class("button1");
    this.button1.parent(this.buttons);
    this.button1.mouseClicked(() => this.minimizeWindow(this.content));

    this.button2 = createDiv();
    this.button2.class("button2");
    this.button2.parent(this.buttons);

    this.button3 = createDiv();
    this.button3.class("button3");
    this.button3.parent(this.buttons);



  }

  setImageContent(ind) {
    this.content.style("background-image", `url(images/${ind}.jpg)`);
  }

  draggingOn(dragging) {
    dragging.dragging = true;
    this.offsetX = this.x - mouseX;
    this.offsetY = this.y - mouseY;
  }

  endDrag() {
    this.dragging.dragging = false;
  }

  update() {
    if (this.dragging.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
      this.div.position(this.x, this.y);
    }
  }

  minimizeWindow(content) {
    this.minimize = !this.minimize;
    if (this.minimize) {
      content.style("height", "0");
      this.toolbar.style("border-bottom", "0px");
    }
    else {
      content.style("height", "375px");
      this.toolbar.style("border-bottom", "2px solid white");
    }
  }
}
