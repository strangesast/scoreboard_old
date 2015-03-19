var intro = intro || function(canvas, _anim) {
	var ww = window.innerWidth;
	var wh = window.innerHeight;
	var chars = [];
	var text = "sportsync";
	var psize = Math.min(800, ww-40)/(text.length*5);
	var xstart = 0; //Math.floor((ww - psize*text.length*5)/2)


	canvas.width = ww;
	canvas.height = psize*7;

	var ctx = canvas.getContext('2d');

	var Character = function(x, y, _charCode, ps, color) {
		this.x = x;
		this.y = y;

		this.cc = _charCode; // goal
		this.cn = _anim ? 90 : _charCode;

		this.color = color;

		this.ps = ps || 4;

		this.draw = function() {
			ctx.fillStyle = this.color;
		  var i = (this.cn - 32)*5;
		  var t = fonts.asciiBasic.slice(i, i+5);
			//ctx.lineWidth = 3;
		  for(var j=0; j<t.length; j++) {
		  	var p = ('000000' + t[j].toString(2)).slice(-7);
		  	for(var i=0; i<p.length; i++) {
		  		if(p[i] == '1') ctx.fillRect(this.x + j*this.ps, this.y+(7-i)*this.ps, this.ps, this.ps);
		  	}
		  }
		}

		this.transition = function() {
			if(this.cn < this.cc) {
				this.cn++;
  			ctx.clearRect(this.x, this.y, this.ps*5, this.ps*7);
  			this.draw();
			}
		}
	}


	for(var i=0; i<text.length; i++) {
		var code = text[i].charCodeAt(0);
		console.log(code);
		chars.push(new Character(xstart + i*(5*psize), canvas.height-psize-(7*psize), code, psize, "white"));
	}

	var j = 0;
	var animLoop = setInterval(function() {
		br = true;
		for(var i=0; i<chars.length; i++) {
		  if(chars[i].cn < chars[i].cc) {
				ctx.fillStyle = "black";
			  ctx.fillRect(chars[i].x-1, chars[i].y-4, chars[i].ps*5+2, chars[i].ps*8+8);
		    chars[i].cn++;
		    chars[i].draw();
				br = false;
	    } else {
				ctx.fillStyle = background;
			  ctx.fillRect(chars[i].x-1, chars[i].y-8, chars[i].ps*5+2, chars[i].ps*8+16);
				chars[i].color = foreground;
		    chars[i].draw();
			}
		}
		if(br) {
			clearInterval(animLoop); 
			window.history.replaceState({}, "index", "/index");
			$('body').css("background-color", background);
		}
	}, 80);
	return {
		'redraw' : function() {
			ww = window.innerWidth;
	    psize = Math.min(800, ww-40)/(text.length*5);
			wh = psize*7;
			canvas.width = ww;
			canvas.height = wh;
	    xstart = 0; // Math.floor((ww - psize*text.length*5)/2)
			ctx.clearRect(0, 0, ww, wh);
			for(var i=0; i<chars.length; i++) {
				chars[i].x = xstart + i*(5*psize);
				chars[i].y = wh-psize-(7*psize);
				chars[i].ps = psize;
				chars[i].draw();
			}
		}
	}


}


var ii;
var foreground = "#00274D";
var background = "#E8E8E8";

// var sent with page.  if true, run animation
var anim = anim || false;
$(document).ready(function() {
	ii = intro(document.getElementById('canvas'), anim);
});

$(window).resize(function() {
	clearTimeout(jj);
	var jj = setTimeout(function() {
		ii.redraw();
	}, 200);
});
