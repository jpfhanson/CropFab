/*
 * spa.opconfig.js
 * Provides convinient access to the configurations of the operations 
 * to be done on an image
 *
 * John Paul Hanson
*/

/*jshint          browser   : true, regexp   : true,
  devel   : true, indent    : 2,    maxerr   : 50,
  newcap  : true, nomen     : true, plusplus : true,
  white   : true, esversion : 6,    laxbreak : true
*/

/*global spa, classes */

classes.OpConfig = class {
  constructor(saveName,mainCanvasWidth,mainCanvasHeight,
              cropLeft,cropTop,cropWidth,cropHeight,scale) {
    this.saveName = saveName;
    this.mainCanvasWidth = mainCanvasWidth;
    this.mainCanvasHeight = mainCanvasHeight;
    this.cropLeft = cropLeft;
    this.cropTop = cropTop;
    this.cropWidth = cropWidth;
    this.cropHeight = cropHeight;
    this.scale = scale;
  }
  setDefaultIfNull(mainCanvasWidth,mainCanvasHeight) {
    if(this.mainCanvasWidth == null) {
      this.mainCanvasWidth = mainCanvasWidth;
    }
    if(this.mainCanvasHeight == null) {
      this.mainCanvasHeight = mainCanvasHeight;
    }
    if(this.cropWidth == null) {
      this.cropWidth = Math.floor(this.mainCanvasWidth/3);
    }
    if(this.cropHeight == null) {
      this.cropHeight = Math.floor(this.mainCanvasHeight/3);
    }
    if(this.cropLeft == null) {
      this.cropLeft = Math.floor(this.mainCanvasWidth/2-this.cropWidth/2);
    }
    if(this.cropTop == null) {
      this.cropTop = Math.floor(this.mainCanvasHeight/2-this.cropHeight/2);
    }
    if(this.scale == null) {
      this.scale = 1;
    }
  }
  clone() {
    return new classes.OpConfig(this.saveName,
                            this.mainCanvasWidth,this.mainCanvasHeight,
                            this.cropLeft,this.cropTop,
                            this.cropWidth,this.cropHeight,
                            this.scale);
  }
  /*
  update(config) {
    // the order is important
    // each method modifies the things set before it, so, if only
    // one thing has changed in config, that will affect the other values
    // correctly
    this.saveName = config.saveName;
    this.cropLeft = config.cropLeft;
    this.cropTop = config.cropTop;
    this.setCropSize(config.cropWidth,config.cropHeight);
    this.setMainCanvasSize(config.mainCanvasWidth,config.mainCanvasHeight);
    this.setScale(config.scale);
    this.moveCropWithinMainCanvas();
  }*/
  get scaledCropLeft() {
    return this.cropLeft/this.scale;
  }
  set scaledCropLeft(x) {
    this.cropLeft = Math.floor(x*this.scale);
  }
  get scaledCropRight() {
    return (this.cropLeft+this.cropWidth)/this.scale;
  }
  set scaledCropRight(x) {
    this.cropLeft = Math.floor(x*this.scale)-this.cropWidth;
  }
  get scaledCropTop() {
    return this.cropTop/this.scale;
  }
  set scaledCropTop(y) {
    this.cropTop = Math.floor(y*this.scale);
  }
  get scaledCropBottom() {
    return (this.cropTop+this.cropHeight)/this.scale;
  }
  set scaledCropBottom(y) {
    this.cropTop = Math.floor(y*this.scale)-this.cropHeight;
  }
  get scaledCropWidth() {
    return this.cropWidth/this.scale;
  }
  set scaledCropWidth(w) {
    this.cropWidth = Math.floor(w*this.scale);
  }
  get scaledCropHeight() {
    return this.cropHeight/this.scale;
  }
  set scaledCropHeight(h) {
    this.cropHeight = Math.floor(h*this.scale);
  }
  setCropPosition(x,y) {
    this.cropLeft = x;
    this.cropTop = y;
    this.moveCropWithinMainCanvas();
  }
  setCropSize(width,height) {
    this.cropLeft -= Math.floor((width-this.cropWidth)/2);
    this.cropWidth = width;
    this.cropTop -= Math.floor((height-this.cropHeight)/2);
    this.cropHeight = height;
    this.moveCropWithinMainCanvas();
  }
  setScale(scale) {
    //this.cropLeft *= Math.floor(scale/this.scale);
    //this.cropTop *= Math.floor(scale/this.scale);
    console.log(this.scaledCropLeft);
    this.cropLeft = Math.floor((this.cropLeft+this.cropWidth/2)
                              *scale/this.scale-this.cropWidth/2);
    this.cropTop = Math.floor((this.cropTop+this.cropHeight/2)
                              *scale/this.scale-this.cropHeight/2);
    this.scale = scale;
    this.moveCropWithinMainCanvas();
  }
  setMainCanvasSize(width,height) {
    this.scaledCropLeft += (width-this.mainCanvasWidth)/2;
    this.scaledCropTop += (height-this.mainCanvasHeight)/2;
    this.mainCanvasWidth = width;
    this.mainCanvasHeight = height;
    this.moveCropWithinMainCanvas();
  }
  increaseMainCanvasSize(width,height) {
    if(this.mainCanvasWidth > width) {
      width = this.mainCanvasWidth;
    }
    if(this.mainCanvasHeight > height) {
      height = this.mainCanvasHeight;
    }
    this.setMainCanvasSize(width,height);
  }
  get cropEdgeColisionWidth() {
    // the denominator is just a magic number that feels good
    // for detecting when the user has clicked the edge of the crop box
    return Math.max(this.mainCanvasWidth,this.mainCanvasHeight)/100*this.scale;
  }

  onCropTopEdge(x,y) {
    if(Math.abs(this.scaledCropTop-y) <= this.cropEdgeColisionWidth) {
      if(this.scaledCropLeft-this.cropEdgeColisionWidth <= x &&
          x <= this.scaledCropRight+this.cropEdgeColisionWidth) {
        return true;
      }
    }
    return false;
  }
  onCropBottomEdge(x,y) {
    return this.onCropTopEdge(x,y-this.scaledCropHeight);
  }
  onCropLeftEdge(x,y) {
    if(Math.abs(this.scaledCropLeft-x) <= this.cropEdgeColisionWidth) {
      if(this.scaledCropTop-this.cropEdgeColisionWidth <= y &&
          x <= this.scaledCropBottom+this.cropEdgeColisionWidth) {
        return true;
      }
    }
    return false;
  }
  onCropRightEdge(x,y) {
    return this.onCropLeftEdge(x-this.scaledCropWidth,y);
  }
  onCropBox(x,y) {
    if(this.scaledCropLeft < x && x < this.scaledCropRight) {
      if(this.scaledCropTop < y && y < this.scaledCropBottom) {
        return true;
      }
    }
    return false;
  }
  dragCropSize(vw,vh) {
    this.setCropSize(this.cropWidth+vw*this.scale,
                     this.cropHeight+vh*this.scale);
    this.moveCropWithinMainCanvas();
  }
  dragCropPosition(vx,vy) {
    this.setCropPosition(this.cropLeft+vx*this.scale,
                         this.cropTop+vy*this.scale);
    this.moveCropWithinMainCanvas();
  }
  moveCropWithinMainCanvas() {
    if(this.scaledCropWidth < 1) {
      this.cropWidth = 1;
    } else if(this.scaledCropWidth > this.mainCanvasWidth) {
      this.scaledCropWidth = this.mainCanvasWidth;
    }
    if(this.scaledCropHeight < 1) {
      this.cropHeight = 1;
    } else if(this.scaledCropHeight > this.mainCanvasHeight) {
      this.scaledCropHeight = this.mainCanvasHeight;
    }
    if(this.scaledCropTop < 0) {this.cropTop = 0;}
    if(this.scaledCropLeft < 0) {this.cropLeft = 0;}
    if(this.scaledCropRight > this.mainCanvasWidth) {
      this.scaledCropRight = this.mainCanvasWidth;
    }
    if(this.scaledCropBottom > this.mainCanvasHeight) {
      this.scaledCropBottom = this.mainCanvasHeight;
    }
  }
}
