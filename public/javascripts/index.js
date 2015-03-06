//$('.section').hover(function() {
//	this.setZ(1);
//}, function() {
//	this.setZ(0);
//});



var back_animation = back_animation || function(canvas) {
	var ctx = canvas.getContext('2d'); // context
	var window_width = window.innerWidth;
	var window_height = window.innerHeight;

	canvas.width = window_width;
	canvas.height = window_height;

	var circle = {
		x: window_width/2,
		y: window_height/2,
		radius: function(t) {
			var r = Math.sqrt(Math.pow(window_width/2, 2) + Math.pow(window_height/2, 2));
			return r*t;
		},
		color: function(t) {
			var grd = ctx.createRadialGradient(this.x, this.y, this.radius(t), this.x, this.y, this.radius(t));
		  grd.addColorStop(0, "black");
	    grd.addColorStop(1.0, "white");
			return grd;
		},
		draw: function(t) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius(t), 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fillStyle= this.color(t);
			ctx.fill();
		}
	}

	function timescale(t, t_total, onDone) {
		var frac = t/t_total;
		return frac < 1 ? frac : 1;
	}


	var stime = new Date().getTime();
	function draw() {
		var t = Math.floor(new Date().getTime());
		circle.draw(timescale(t - stime, 4000));
		ctx.clearRect(0, 0, window_width, window_height);
		circle.radius*=.99

	  window.requestAnimationFrame(draw);

	}

	window.requestAnimationFrame(draw);

}

back_animation(document.getElementById('canvas'));
