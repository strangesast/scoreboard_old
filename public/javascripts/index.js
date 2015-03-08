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

	function returnGradient(x, y, outerRadius, innerRadius, color1, color2) {
	  var _grd = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
	  _grd.addColorStop(1, color1)
	  _grd.addColorStop(0, color2);
		return _grd;
	}


	var circle = function(x, y) {
		this.x = x,
		this.y = y,
		this.sradius: Math.floor(Math.sqrt(Math.pow(window_width/2, 2) + Math.pow(window_height/2, 2)))/2,
		this.lradius: Math.floor(Math.sqrt(Math.pow(window_width/2, 2) + Math.pow(window_height/2, 2))),
		this.draw = function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.lradius, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fillStyle=this.color;
			ctx.fill();
		}
	}
	circle.color = returnGradient(circle.x, circle.y, circle.sradius, circle.lradius, "rgb(255,255,255)", "rgb(0,0,0)");
	console.log(circle.color);



	circle.draw();


	function animate(obj, prop, val, duration) {
		var start = new Date().getTime();
		var end = start + duration;
		var current = obj[prop];
		var distance = val - current;


	  var step = function() {
			ctx.clearRect(0, 0, window_width, window_height);
	  	var t = new Date().getTime();
	  	var d = Math.min((duration - (end - t))/ duration, 1);

			obj[prop] = current + (distance*d);
			obj.draw();

			if(d < 1) requestAnimationFrame(step);
	  }
		requestAnimationFrame(step);
	}

	function animateGrd(obj, sval, lval, duration) {
		var start = new Date().getTime();
		var end = start + duration;
		var scur = obj.sradius;
		var lcur = obj.lradius;
		var sdist = sval - scur;
		var ldist = lval - lcur;

	  var step = function() {
	  	var t = new Date().getTime();
	  	var d = Math.min((duration - (end - t))/ duration, 1);

			obj.color = returnGradient(obj.x, obj.y, scur + (sdist*d),lcur+(ldist*d),
					'rgb(' + [255, 255, 255].map(function(x) {return Math.floor(x*(1-d));}).join(', ') + ')',
						"white"
						);
			console.log(('rgb(' + [255, 255, 255].map(function(x) {return Math.floor(x*d);}).join(', ') + ')'));

			//obj.draw();

			if(d < 1) requestAnimationFrame(step);
	  }
		requestAnimationFrame(step);
	}

	animateGrd(circle, circle.lradius*0.2, circle.lradius*0.4, 4000);
	animate(circle, 'lradius', circle.lradius*0.2, 4000);

}

$(document).ready(function() {
  back_animation(document.getElementById('canvas'));
});
