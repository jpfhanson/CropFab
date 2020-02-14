"use strict"

//use: This script must be loaded in the body of the html.
// There must be a div with id="image-column" to put the images in.
// Make the body tag have onload="imageColumn = new ImageColumn()"
// Varius inputs can call imageColumns methods. At the moment the following are implimented.
// loadImages(input): loads image files from file inputs
//  example html: <input type="file" onchange="imageColumn.loadImages(this)" accept="image/*" multiple>

class Configuration {
	constructor() {
		this.greatestImageWidth = 0;
		this.greatestImageHeight = 0;
		// these must be set before this config is used in an ImagePanel
		this.cropWidth = null;
		this.cropHeight = null;

		// This is a bit of a hack.
		// It isn't configuration. It is just the ImagePanel
		// that the mouse is currently interacting with so the
		// the ImageColumn can tell it when the mouse is released.
		this.currentImagePanel = null;
	}
}

class ImagePanel {
	constructor(name,lastModified,originalImage,config,div) {
		// after construction, resize must be called to finish setting up
		this.name = name;
		this.lastModified = lastModified;
		this.originalImage = originalImage;
		this.config = config;

		this.cropCenterX = this.originalImage.naturalWidth/2;
		this.cropCenterY = this.originalImage.naturalHeight/2;

		this.mouseMode = "none";

		// note: if the canvas gets padding, the geomotry things using clientHeight and clientWidth will have to be changed to take it into acount
		this.canvas = document.createElement('canvas');
		this.canvas.onmousedown = (event) => {this.onMouseDown(event)};
		this.canvas.onmousemove = (event) => {this.onMouseMove(event)};
		// onmousemove and onmouseup are handed to this object by the ImageColumn
		this.canvas.style.width = "100%";
		div.append(this.canvas);
	}
	convertToCanvasX(x) {
		return x*this.canvas.width/this.canvas.clientWidth;
	}
	convertToCanvasY(y) {
		return y*this.canvas.height/this.canvas.clientHeight;
	}
	onMouseDown(event) {
		// calculate the mouse posision in the canvases coordinate system
		const x = this.convertToCanvasX(event.offsetX);
		const y = this.convertToCanvasY(event.offsetY);
		if(this.cropLeft <= x && x <= this.cropRight) {
			if(this.cropTop <= y && y <= this.cropBottom) {
				this.mouseMode = "move";
				this.config.currentImagePanel = this;
			}
		}
	}
	onMouseUp(event) {
		this.mouseMode = "none";
		if(this.config.currentImagePanel === this) {
			this.config.currentImagePanel = null;
		}
	}
	onMouseMove(event) {
		if(this.mouseMode == "move") {
			this.cropCenterX += this.convertToCanvasX(event.movementX);
			this.cropCenterY += this.convertToCanvasY(event.movementY);
			if(this.cropLeft < 0) {
				this.cropCenterX = this.config.cropWidth/2-this.xOffset;
			} else if(this.cropRight > this.canvas.width) {
				this.cropCenterX = this.canvas.width-this.config.cropWidth/2-this.xOffset;
			}
			if(this.cropTop < 0) {
				this.cropCenterY = this.config.cropHeight/2-this.yOffset;
			} else if(this.cropBottom > this.canvas.height) {
				this.cropCenterY = this.canvas.height-this.config.cropHeight/2-this.yOffset;
			}
			this.redraw();
		}
	}
	resize(divWidth) {
		const invAspectRatio = this.config.greatestImageHeight/this.config.greatestImageWidth;
		this.canvas.style.height = Math.ceil(divWidth*invAspectRatio);
		this.redraw();
	}
	redraw() {
		this.canvas.width = this.config.greatestImageWidth;
		this.canvas.height = this.config.greatestImageHeight;


		let ctx = this.canvas.getContext('2d');
		// draw the image
		ctx.drawImage(this.originalImage,this.xOffset,this.yOffset);

		// draw the croping rectangle
		ctx.lineWidth = 10;
		ctx.strokeRect(this.cropLeft,this.cropTop,this.config.cropWidth,this.config.cropHeight);
		/*for(let center of [[left,up],[left,down],[right,up],[right,down]]) {
			ctx.fillRect(center[0]-10,center[1]-10,center[0]+10,center[1]+10);
		}*/
	}
	get xOffset() {
		return (this.canvas.width-this.originalImage.naturalWidth)/2;
	}
	get yOffset() {
		return(this.canvas.height-this.originalImage.naturalHeight)/2;
	}
	get cropLeft() {
		return this.xOffset+this.cropCenterX-this.config.cropWidth/2;
	}
	get cropTop() {
		return this.yOffset+this.cropCenterY-this.config.cropHeight/2;
	}
	get cropRight() {
		return this.xOffset+this.cropCenterX+this.config.cropWidth/2;
	}
	get cropBottom() {
		return this.yOffset+this.cropCenterY+this.config.cropHeight/2;
	}
}

class ImageColumn {
	constructor() {
		this.div = document.getElementById("image-column");
		this.images = new Array();
		this.config = new Configuration();
		window.onresize = () => {this.resize()};
		this.currentImagePanel = null;
		window.onmouseup 	= (event) => {this.onMouseEnd(event)};
		window.onmousemove 	= (event) => {this.onMouseMove(event)};

		this.imagesStillLoading = 0;
	}
	// I want mouse up and move to work on the current pannel even if they happen somewhere else on the page
	onMouseMove(event) {
		if(event.which == 0) {
			this.onMouseEnd(event);
		}
	}
	onMouseEnd(event) {
		if(this.config.currentImagePanel != null) {
			this.config.currentImagePanel.onMouseUp(event);
		}
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
			reader.onabourt = () => {this.imageLoadEnded()};
			reader.onerror = () => {this.imageLoadEnded()};
			reader.readAsDataURL(file);
		}
	}
	addImage(name,lastModified,image) {
		this.config.greatestImageWidth = Math.max(this.config.greatestImageWidth,image.naturalWidth);
		this.config.greatestImageHeight = Math.max(this.config.greatestImageHeight,image.naturalHeight);
		if(this.config.cropWidth == null) {
			this.config.cropWidth = image.naturalWidth/3;
		}
		if(this.config.cropHeight == null) {
			this.config.cropHeight = image.naturalHeight/3;
		}
		this.images.push(new ImagePanel(name,lastModified,image,this.config,this.div));
	}
	imageLoadEnded() {
		this.imagesStillLoading--;
		if(this.imagesStillLoading < 0) {
			console.log("There are a negative number of images loading.");
		}
		if(this.imagesStillLoading == 0) {
			this.resize();
		}
	}
	resize() {
		for(let image of this.images) {
			image.resize(this.div.clientWidth);
		}
	}
        
}
