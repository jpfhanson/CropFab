"use strict";

// At the moment the following public methods are implimented.
// loadImages(input): loads image files from file inputs
//  example html: <input type="file" onchange="imageColumn.loadImages(this)"
//  accept="image/*" multiple>
// saveImages()
// changeCropSize(width,height): change the size of the crop boxes
// changeCropWidth(width)
// changeCropHeight(height)

// this function will be replaced with a node module soon
function saveFile(dataURL,filename) {
  let fakeLink = document.createElement("a");
  fakeLink.href = dataURL;
  fakeLink.download = filename;
  fakeLink.click();
  setTimeout(() => {window.URL.revokeObjectURL(dataURL);});
}

class ImageColumn {
  constructor() {
    this.images = new Array();
    window.onresize = () => {this.resize()};
    this.currentImagePanel = null;

    this.greatestImageWidth = 0;
    this.greatestImageHeight = 0;

    this.imagesStillLoading = 0;
  }
  loadImages(input) {
    this.imagesStillLoading += input.files.length;
    for (let file of input.files) {
      const reader = new FileReader();
      reader.onload = () => {
        let image = new Image();
        image.onload = () => {
          this.addImage(file.name,file.lastModified,image);
          this.imageLoadEnded();
        }
        image.onerror = () => {
          this.imageLoadEnded();
        }
        image.src = reader.result;
      };
      reader.onabort = () => {this.imageLoadEnded()};
      reader.onerror = () => {this.imageLoadEnded()};
      reader.readAsDataURL(file);
    }
  }
  addImage(name,lastModified,image) {
    this.greatestImageWidth = Math.max(this.greatestImageWidth,image.naturalWidth);
    this.greatestImageHeight = Math.max(this.greatestImageHeight,image.naturalHeight);
    let imageBox = new ImageBox(name,lastModified,image);
    this.images.push(imageBox);
    spa.shell.handleImageLoad(imageBox);
  }
  imageLoadEnded() {
    this.imagesStillLoading--;
    if(this.imagesStillLoading < 0) {
      console.log("There are a negative number of images loading.");
    }
    if(this.imagesStillLoading == 0) {
      this.resize();
      this.resizeCanvases();
    }
  }
  resize() {
    for(let image of this.images) {
      image.resizeExternal();
    }
  }
  resizeCanvases() {
    for(let image of this.images) {
      image.resizeCanvas(this.greatestImageWidth,this.greatestImageHeight);
    }
  }
  changeCropSize(width,height) {
    //untested
    for(let image of this.images) {
      image.changeCropSize(width,height);
    }
  }
  changeCropWidth(width) {
    //untested
    for(let image of this.images) {
      image.changeCropWidth(width);
    }
  }
  changeCropHeight(height) {
    //untested
    for(let image of this.images) {
      image.changeCropWidth(height);
    }
  }
  async saveImages() {
    let zip = new JSZip();
    for(let image of this.images) {
      await image.addToZip(zip);
    }
    zip.generateAsync({type:"blob"}).then((content) => saveFile(URL.createObjectURL(content),"croped_images.zip"));
  }
}

spa.imagecolumn = new ImageColumn();