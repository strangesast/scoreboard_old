var timerAnimation = timerAnimation || function(_canvasElement) {
	var canvas = _canvasElement;
	canvas.height = 400;
	canvas.width = 400;
	var ctx = canvas.getContext('2d');

	function drawHalf(step, x, y, w, h, lr, sr) {
		//ctx.clearRect(0, 0, 500, 200);
		ctx.beginPath();
		ctx.translate(x, y+h);
		ctx.transform(1, 0, -1/8*(1-Math.cos(Math.PI*step)), Math.cos(Math.PI/2*step), 0, 0);
		ctx.translate(x, y-h);
		ctx.arc(x+lr, y+lr, lr, -Math.PI/2, -Math.PI, true);
		ctx.lineTo(x, y+h-sr);
		ctx.arc(x+sr, y+h-sr, sr, -Math.PI, -3*Math.PI/2, true);
		ctx.lineTo(x+w-sr, y+h);
		ctx.arc(x+w-sr, y+h-sr, sr, -3*Math.PI/2, -2*Math.PI, true);
		ctx.lineTo(x+w, y+lr);
		ctx.arc(x+w-lr, y+lr, lr, -2*Math.PI, -Math.PI/2, true);
		ctx.lineTo(x+lr, y);
		ctx.fillStyle = "white";
		ctx.shadowBlur = Math.floor(20/2*(1-Math.cos(Math.PI*step)))
		ctx.shadowColor = "black";
		ctx.fill();
		ctx.font = "150px Georgia";
		ctx.shadowBlur=0;
		ctx.fillStyle = "black";
		ctx.fillText("9", x+10, y+100);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	var s= 0;
	var t= 2;
	var u= 4;
	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	  drawHalf(s/10, 0, 0, 100, 100, 30, 20);
	  drawHalf(t/10, 30, 0, 100, 100, 30, 20);
	  drawHalf(u/10, 60, 0, 100, 100, 30, 20);
		s < 20 ? s++ : s=0;
		t < 20 ? t++ : t=0;
		u < 20 ? u++ : u=0;
	}, 100)


	return {
		'half' : function(step, x, y) {
			var w = 20, h = 30, lr = 10, sr = 5;
			drawHalf(step, x, y, w, h, lr, sr);

		}
	}
}


var anim = timerAnimation(document.getElementById('canvas'));
