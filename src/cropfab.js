"use strict"

//use: This script must be loaded in the body of the html.
// There must be a div with id="image-column" to put the images in.
// Make the body tag have onload="imageColumn = new ImageColumn()"
// Varius inputs can call imageColumns methods. At the moment the following are implimented.
// loadImages(input): loads image files from file inputs
//  example html: <input type="file" onchange="imageColumn.loadImages(this)" accept="image/*" multiple>

function saveFile(dataURL,filename) {
	let fakeLink = document.createElement('a');
	fakeLink.href = dataURL;
	fakeLink.download = filename;
	fakeLink.click();
}

// TODO: refactor this out
class Configuration {
	constructor() {
		// This is a bit of a hack.
		// It isn't configuration. It is just the ImagePanel
		// that the mouse is currently interacting with so the
		// the ImageColumn can tell it when the mouse is released.
		this.currentImagePanel = null;
	}
}

class Box {
	constructor(x,y,width,height) {
		this.left = x;
		this.top = y;
		this._width = width;
		this._height = height;
	}
	static fromCenter(centerX,centerY,width,height) {
		return new Box(centerX-width/2,centerY-height/2,width,height);
	}
	drawRectOn(canvasCtx,xOffset=0,yOffset=0) {
		canvasCtx.lineWidth = 10;
		canvasCtx.strokeRect(this.left+xOffset,this.top+yOffset,
								this.width,this.height);
	}
	cropImageTo(canvas,image) {
		canvas.width = this.width;
		canvas.height = this.height;
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage(image,-this.left,-this.top);
	}
	moveToWithin(left,top,right,bottom) {
		if(this.left < left) {
			this.left = left;
		} else if(this.right > right) {
			this.right = right;
		}
		if(this.top < top) {
			this.top = top;
		} else if(this.bottom > bottom) {
			this.bottom = bottom;
		}
	}
	get right() {
		return this.left+this.width;
	}
	set right(x) {
		this.left = x-this.width;
	}
	get bottom() {
		return this.top+this.height;
	}
	set bottom(y) {
		this.top = y-this.height;
	}
	get width() {return this._width}
	get height() {return this._height}
	// width and height setters are untested
	set width(width) {
		this.x += (this._width-width)/2;
	}
	set height(height) {
		this.y += (this._height-height)/2;
	}
}

class ImagePanel {
	constructor(name,lastModified,originalImage,config,containerDiv) {
		// after construction, resizeExternal and resizeCanvas must be called to finish setting up
		this.name = name;
		this.lastModified = lastModified;
		this.originalImage = originalImage;
		this.config = config;

		this.cropBox = Box.fromCenter(this.originalImage.naturalWidth/2,
										this.originalImage.naturalHeight/2,
										500,500);

		this.mouseMode = "none";
		this.initDiv(containerDiv);
	}
	initDiv(containerDiv) {
		// initiate the main canvas
		// note: if you deside to give the canvas padding, the geomotry things using clientHeight and clientWidth will have to be changed to take it into acount
		this.canvas = document.createElement('canvas');
		this.canvas.style.width = "100%";
		// height is worked out dynamicaly in this.resize
		this.canvas.onmousedown = (event) => {this.onMouseDown(event)};
		this.canvas.onmousemove = (event) => {this.onMouseMove(event)};
		// onmouseup is handed to this object by the ImageColumn

		// initiate the preview canvas
		this.preview = document.createElement('canvas');
		this.preview.style.width = "100%";

		// initiate the save button
		let saveButton = document.createElement('button');
		saveButton.onclick = () => {this.saveImage()};
		saveButton.innerHTML = "Save Image";

		// initiate the div itself
		this.div = document.createElement('div');
		this.div.appendChild(this.canvas);
		this.div.appendChild(this.preview);
		this.div.appendChild(saveButton);
		containerDiv.appendChild(this.div);
	}
	
	// methods for modifying the canvases
	resizeExternal() {
		// when the width of the canvases changes, maintain the aspect ratio
		// also called when the aspect ratio changes
		this.canvas.style.height = Math.ceil(this.canvas.clientWidth*this.canvas.height/this.canvas.width);
		this.preview.style.height = Math.ceil(this.preview.clienWidth*this.cropBox.height/this.cropBox.width);
	}
	resizeCanvas(width,height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.resizeExternal();
		this.redraw();
	}
	changeCropSize(width,height) {
		// this function is untested
		this.preview.width = width;
		this.preview.height = height;
		this.cropBox.width = width;
		this.cropBox.height = height;
	}
	redraw() {
		let ctx = this.canvas.getContext('2d');

		// blank out the canvas
		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

		// draw the image
		ctx.drawImage(this.originalImage,this.xOffset,this.yOffset);

		// draw the croping rectangle
		this.cropBox.drawRectOn(ctx,this.xOffset,this.yOffset);

		// draw the preview
		this.cropBox.cropImageTo(this.preview,this.originalImage);
	}
	
	// event handling methods
	onMouseDown(event) {
		// calculate the mouse posision in the canvases coordinate system
		const x = this.clientToCanvasX(event.offsetX);
		const y = this.clientToCanvasY(event.offsetY);
		// if the mouse is in the crop box
		if(this.cropBox.left+this.xOffset <= x && x <= this.cropBox.right+this.xOffset) {
			if(this.cropBox.top+this.yOffset <= y && y <= this.cropBox.bottom+this.yOffset) {
				// get ready to move the box
				this.mouseMode = "move";
				this.config.currentImagePanel = this;
			}
		}
	}
	onMouseEnd(event) {
		// the mouse button has been released
		// For some reason, mouseup events don't always get here, so
		// whether the button is still pressed is checked before taking action
		// in other methods. This is called if it is not still pressed.
		this.mouseMode = "none";
		if(this.config.currentImagePanel === this) {
			this.config.currentImagePanel = null;
		}
	}
	onMouseMove(event) {
		// if the mouse was released at some point and no one told us
		if(this.mouseMode != "none" && event.which == 0) {
			this.onMouseEnd(event);
			return;
		}
		if(this.mouseMode == "move") {
			this.cropBox.left += this.clientToCanvasX(event.movementX);
			this.cropBox.top += this.clientToCanvasY(event.movementY);
			this.cropBox.moveToWithin(-this.xOffset,-this.yOffset,
										this.canvas.width-this.xOffset,
										this.canvas.height-this.yOffset);
			this.redraw();
		}
	}

	saveImage() {
		let filenameParts = this.name.split('.')
		let imageType;
		if(filenameParts.length > 1) {
			imageType = filenameParts.pop();
			if(imageType == "jpg") {imageType = "jpeg"}
		} else {
			imageType = 'png';
		}
		let resultURL = this.preview.toDataURL("image/"+imageType).replace("image/"+imageType,"image/octet-stream").replace("image/png","image/octet-stream");
		saveFile(resultURL,this.name);
	}
	async addToZip(zip) {
		let blob = await new Promise((resolve) => {this.preview.toBlob(resolve,'image/jpeg')});
		zip.file(this.name,blob,{base64:true});
		return null;
	}
	
	// helper methods
	clientToCanvasX(x) {
		return x*this.canvas.width/this.canvas.clientWidth;
	}
	clientToCanvasY(y) {
		return y*this.canvas.height/this.canvas.clientHeight;
	}
	get xOffset() {
		return (this.canvas.width-this.originalImage.naturalWidth)/2;
	}
	get yOffset() {
		return(this.canvas.height-this.originalImage.naturalHeight)/2;
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

		this.greatestImageWidth = 0;
		this.greatestImageHeight = 0;

		this.imagesStillLoading = 0;
	}
	// I want mouse up move to work on the current pannel even if they happen somewhere else on the page
	onMouseMove(event) {
		if(event.which == 0) {
			this.onMouseEnd(event);
		}
	}
	onMouseEnd(event) {
		if(this.config.currentImagePanel != null) {
			this.config.currentImagePanel.onMouseEnd(event);
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
		this.greatestImageWidth = Math.max(this.greatestImageWidth,image.naturalWidth);
		this.greatestImageHeight = Math.max(this.greatestImageHeight,image.naturalHeight);
		this.images.push(new ImagePanel(name,lastModified,image,this.config,this.div));
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
	async saveImages() {
		let zip = new JSZip();
		for(let image of this.images) {
			await image.addToZip(zip);
		}
		zip.generateAsync({type:"blob"}).then((content) => saveFile(URL.createObjectURL(content),"croped_images.zip"));
	}
}
