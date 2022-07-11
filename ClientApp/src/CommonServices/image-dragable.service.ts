export class ImageDragableService
{

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;

  offsetX: number;
  offsetY: number;

  startX: number = 0;
  startY: number = 0;
  isDown: boolean = false;


  pi2: number = Math.PI * 2;
  resizerRadius: number = 8;
  rr = this.resizerRadius * this.resizerRadius;
  draggingResizer: number = 0;
  imageX: number = 50;
  imageY: number = 50;
  imageWidth: number = 0;
  imageHeight: number = 0;
  imageRight: number = 0;
  imageBottom: number = 0;
  draggingImage = false;
  imageClick: boolean = false;
  mouseX: number = 0;
  mouseY: number = 0;
  img: HTMLImageElement;
  constructor(canvas: HTMLCanvasElement, Image: HTMLImageElement)
  {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.offsetX = this.canvas.offsetLeft;
    this.offsetY = this.canvas.offsetTop;
    this.img = Image;
    this.imageWidth = Image.width;
    this.imageHeight = Image.height;
    this.imageRight = this.imageX + this.imageWidth;
    this.imageBottom = this.imageY + this.imageHeight;
    this.draw(true, true);
    this.canvas.addEventListener("mousedown", (e) =>
    {
      this.handleMouseDown(e);
    });
    this.canvas.addEventListener("mousemove", (e) =>
    {
      this.handleMouseMove(e);
    });
    this.canvas.addEventListener("mouseup", (e) =>
    {
      this.handleMouseUp(e);
    });
    this.canvas.addEventListener("mouseout", (e) =>
    {
      this.handleMouseOut(e);
    });
  }


  draw(withAnchors: boolean, withBorders: boolean)
  {
    // clear the canvas
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw the image
    this.ctx?.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.imageX, this.imageY, this.imageWidth, this.imageHeight);

    // optionally draw the draggable anchors
    if (withAnchors)
    {
      this.drawDragAnchor(this.imageX, this.imageY);
      this.drawDragAnchor(this.imageRight, this.imageY);
      this.drawDragAnchor(this.imageRight, this.imageBottom);
      this.drawDragAnchor(this.imageX, this.imageBottom);
    }

    // optionally draw the connecting anchor lines
    if (withBorders)
    {
      this.ctx?.beginPath();
      this.ctx?.moveTo(this.imageX, this.imageY);
      this.ctx?.lineTo(this.imageRight, this.imageY);
      this.ctx?.lineTo(this.imageRight, this.imageBottom);
      this.ctx?.lineTo(this.imageX, this.imageBottom);
      this.ctx?.closePath();
      this.ctx?.stroke();
    }

  }

  drawDragAnchor(x: number, y: number)
  {
    this.ctx?.beginPath();
    this.ctx?.arc(x, y, this.resizerRadius, 0, this.pi2, false);
    this.ctx?.closePath();
    this.ctx?.fill();
  }

  anchorHitTest(x: number, y: number)
  {

    var dx, dy;

    // top-left
    dx = x - this.imageX;
    dy = y - this.imageY;
    if (dx * dx + dy * dy <= this.rr)
    {
      return (0);
    }
    // top-right
    dx = x - this.imageRight;
    dy = y - this.imageY;
    if (dx * dx + dy * dy <= this.rr)
    {
      return (1);
    }
    // bottom-right
    dx = x - this.imageRight;
    dy = y - this.imageBottom;
    if (dx * dx + dy * dy <= this.rr)
    {
      return (2);
    }
    // bottom-left
    dx = x - this.imageX;
    dy = y - this.imageBottom;
    if (dx * dx + dy * dy <= this.rr)
    {
      return (3);
    }
    return (-1);

  }


  hitImage(x: number, y: number)
  {
    return (x > this.imageX && x < this.imageX + this.imageWidth && y > this.imageY && y < this.imageY + this.imageHeight);
  }


  handleMouseDown(e: MouseEvent)
  {
    this.startX = e.clientX - this.offsetX;
    this.startY = e.clientY - this.offsetY;
    this.draggingResizer = this.anchorHitTest(this.startX, this.startY);
    this.draggingImage = this.draggingResizer < 0 && this.hitImage(this.startX, this.startY);
  }

  handleMouseUp(e: MouseEvent)
  {
    this.draggingResizer = -1;
    this.draggingImage = false;
    this.draw(true, false);
    this.canvas.width = this.imageWidth;
    this.canvas.height = this.imageHeight;
  }

  handleMouseOut(e: MouseEvent)
  {
    this.handleMouseUp(e);
  }

  handleMouseMove(e: MouseEvent)
  {

    if (this.draggingResizer > -1)
    {

      this.mouseX = e.clientX - this.offsetX;
      this.mouseY = e.clientY - this.offsetY;

      // resize the image
      switch (this.draggingResizer)
      {
        case 0:
          //top-left
          this.imageX = this.mouseX;
          this.imageWidth = this.imageRight - this.mouseX;
          this.imageY = this.mouseY;
          this.imageHeight = this.imageBottom - this.mouseY;
          break;
        case 1:
          //top-right
          this.imageY = this.mouseY;
          this.imageWidth = this.mouseX - this.imageX;
          this.imageHeight = this.imageBottom - this.mouseY;
          break;
        case 2:
          //bottom-right
          this.imageWidth = this.mouseX - this.imageX;
          this.imageHeight = this.mouseY - this.imageY;
          break;
        case 3:
          //bottom-left
          this.imageX = this.mouseX;
          this.imageWidth = this.imageRight - this.mouseX;
          this.imageHeight = this.mouseY - this.imageY;
          break;
      }

      if (this.imageWidth < 25) { this.imageWidth = 25; }
      if (this.imageHeight < 25) { this.imageHeight = 25; }

      // set the image right and bottom
      this.imageRight = this.imageX + this.imageWidth;

      this.imageBottom = this.imageY + this.imageHeight;

      // redraw the image with resizing anchors
      this.draw(true, true);

    } else if (this.draggingImage)
    {

      this.imageClick = false;

      this.mouseX = e.clientX - this.offsetX;
      this.mouseY = e.clientY - this.offsetY;

      // move the image by the amount of the latest drag
      var dx = this.mouseX - this.startX;
      var dy = this.mouseY - this.startY;
      this.imageX += dx;
      this.imageY += dy;
      this.imageRight += dx;
      this.imageBottom += dy;
      // reset the startXY for next time
      this.startX = this.mouseX;
      this.startY = this.mouseY;
      // redraw the image with border
      this.draw(false, true);
    }
  }



}
