var canvas = document.getElementById('logo');

canvas.width = 400;
canvas.height =  200;

var boards = [];

function Board(parentCanvas, x, y, number, color) {
	console.log('new board');
	var boardWidth = 40;
	var boardHeight = 40;
	this.largeRoundRadius = 6;
	this.smallRoundRadius = 2;
	this.parent = parentCanvas;
	this.ctx= parentCanvas.getContext('2d');
	this.x = x;
	this.y = y;
	this.w = boardWidth;
	this.h = boardHeight;
	this.number = number || 0;
	this.color = color || "blue";
}

Board.prototype.animate = function(step) {
	var ctx = this.ctx;
	var x = this.x;
	var y = this.y;
	var w = this.w;
	var h = this.h;
	var lrr = this.largeRoundRadius;
	var srr = this.smallRoundRadius;

	function pro(delay) {
		return new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve(true);
			}, delay);
		});
	}

	ctx.translate(x, y);
	for(var i=0; i<0.5; i+=0.1) {
		var p = new Promise(function(resolve, reject) {
			console.log('frame');
		  ctx.save();
	    ctx.transform(1, 0, i, 1-i, 0, 0);
      ctx.beginPath();
	    ctx.moveTo(lrr, 0);
	    ctx.arc(lrr, lrr, lrr, 3*Math.PI/2, Math.PI, true);
	    ctx.lineTo(0, h-lrr);
	    ctx.arc(srr, h - srr, srr, Math.PI, Math.PI/2, true);
	    ctx.lineTo(w-srr, h);
	    ctx.arc(w - srr, h - srr, srr, Math.PI/2, 0, true);
	    ctx.lineTo(w, lrr);
	    ctx.arc(w - lrr, lrr, lrr, 0, -Math.PI/2, true);
	    ctx.lineTo(lrr, 0);
	    ctx.lineWidth = 2;
	    ctx.stroke();
	    ctx.fillStyle = "blue";
	    ctx.fill();
	    ctx.closePath();
	    ctx.beginPath();
	    ctx.fillStyle = "white";
	    ctx.arc(w/3, lrr, srr, 0, 2*Math.PI);
	    ctx.arc(w*2/3, lrr, srr, 0, 2*Math.PI);
	    ctx.fill();
		  ctx.font = "35px Verdana";
		  ctx.fillText("9", w/4, 35);
		  ctx.restore();
		});

		Promise.all([p, pro(10000*i)]).then(function(values) {console.log(values)});
	}

	//for(var i=0.5; i<1.1; i+=0.1) {
	//	setTimeout(function() {
	//	//ctx.fillStyle = "white";
	//	//ctx.fillRect(0, 0, 200, 200);
	//  //ctx.transform(1, 0, 0.75, 1, 0, 0);
	//  ctx.beginPath();
	//  ctx.moveTo(x + lrr, y);
	//  ctx.arc(x + lrr, y + lrr, lrr, 3*Math.PI/2, Math.PI, true);
	//  ctx.lineTo(x, y+this.h-lrr);
	//  ctx.arc(x + srr, y + this.h - srr, srr, Math.PI, Math.PI/2, true);
	//  ctx.lineTo(x+this.w-srr, y + this.h);
	//  ctx.arc(x + this.w - srr, y + this.h - srr, srr, Math.PI/2, 0, true);
	//  ctx.lineTo(x + this.w, y + lrr);
	//  ctx.arc(x + this.w - lrr, y + lrr, lrr, 0, -Math.PI/2, true);
	//  ctx.lineTo(x + lrr, y);
	//  ctx.lineWidth = 2;
	//  ctx.stroke();
	//  ctx.fillStyle = "blue";
	//  ctx.fill();
	//  ctx.closePath();
	//  ctx.beginPath();
	//  ctx.fillStyle = "white";
	//  ctx.arc(x+this.w/3, y+this.h-lrr, srr, 0, 2*Math.PI);
	//  ctx.arc(x+this.w*2/3, y+this.h-lrr, srr, 0, 2*Math.PI);
	//  ctx.fill();
	//	}, i*1000);
	//}

}


var b = new Board(canvas, 20, 20, 1, "blue");

b.animate();
