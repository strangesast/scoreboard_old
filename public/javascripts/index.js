var colors = ['607d8b', '35baf8', '33c9dd', '33aba0', '70bf73', 'd7e361'];

var intro = intro || function(canvas, _anim) {
	var cw = canvas.width
	var ch = canvas.height
	var chars = [];
	var text = "sportsync";
	var psize = Math.min(800, ww-40)/(text.length*5);
	var xstart = 0; //Math.floor((ww - psize*text.length*5)/2)


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
			  ctx.clearRect(chars[i].x-1, chars[i].y-8, chars[i].ps*5+2, chars[i].ps*8+16);
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


}


var ii;
var foreground = "#00274D";
var background = "#E8E8E8";

// var sent with page.  if true, run animation
var anim = anim || false;
addEventListener('template-bound', function() {
	function intro() { 
		var timer = document.getElementById('timer');
		timer.width = window.innerWidth;
		timer.height = window.innerHeight;
	  var canvi = []
	  for(var i=1; i<=10; i++) {
	  	var c = document.getElementById('canvas' + i);
	  	if(c) {
        c.style.zIndex= i; 
      	c.width = window.innerWidth;
        c.height = window.innerHeight;
	  	 	canvi.push(c);
	  	}
	  	else break;
	  }
	  var cw = window.innerWidth;
	  var ch = window.innerHeight;

	  var kickoff = function(_ctx, _color, _i) {
	  	return setTimeout(function() {
        animateCircles(cw/2, ch/2, Math.max(cw, ch), _ctx, _color);
	  	}, delay);
	  }

	  var amt = 1000;
	  for(var i in canvi) {
	  	var color = "#" + colors[i];
	  	var canvas = canvi[i];
	  	var ctx = canvas.getContext('2d');
	  	var delay = i*amt;
	  	kickoff(ctx, color, delay);
	  }
	  setTimeout(function() {
	  	//document.querySelector('#mother').$.pages.selected = "index";
			
      //timer.style.zIndex= -1; // when finished;
	    //window.history.replaceState({}, "index", "/index");
	  }, canvi.length*amt);
    //canvas.style.zIndex= -1; // when finished;
		animateTimer(cw/2, ch/2, "sportsync", timer.getContext('2d'), "white", timer);
	}

	if(document.querySelector('#mother').$.pages.selected == "loading") intro();

});

var animateTimer = function(xcenter, ycenter, text, _ctx, _color, _canvas) {
	var length = 1000; 
	var start = new Date().getTime();

	var Character = function(x, y, _charCode, ps, color) {
		this.x = x;
		this.y = y;

		this.cc = _charCode; // goal
		this.cn = _charCode - 12;

		this.color = color;

		this.ps = ps || 4;

		this.draw = function() {
			_ctx.clearRect(this.x, this.y, this.ps*5, this.ps*9);
			_ctx.fillStyle = this.color;
		  var i = (this.cn - 32)*5;
		  var t = fonts.asciiBasic.slice(i, i+5);
			//_ctx.lineWidth = 3;
		  for(var j=0; j<t.length; j++) {
		  	var p = ('000000' + t[j].toString(2)).slice(-7);
		  	for(var i=0; i<p.length; i++) {
		  		if(p[i] == '1') _ctx.fillRect(this.x + j*this.ps, this.y+(7-i)*this.ps, this.ps, this.ps);
		  	}
		  }
		}
	}


	var pw_m = Math.floor(window.innerWidth/54)
	var pw = Math.min(pw_m, 10);
	var char_width = pw*6
	var chars = [];

	for(var i=0; i<text.length; i++) {
		var x = xcenter-char_width*text.length/2 + i*char_width;
		var c = new Character(x, ycenter-pw*7, text[i].charCodeAt(0), pw, "black");
		c.draw();
		chars.push(c);
	}


	var j = 0;
  var i = 0;
	var step = function() {
		var t = new Date().getTime();
		var d = t - start;
		var br = false;

		if(Math.floor(d/50) > j) {
			j+=1;
			inc=1
		} else inc = 0;	

		br = false;
		var c = chars[i];
		if(c.cn < c.cc) c.cn += inc;
		else i += 1;
		c.draw();
		if(i==text.length) br = true;

		if(!br) { requestAnimationFrame(step) }
		else {
			//_canvas.height = 100;
			//for(var n=0; n<chars.length; n++) {
			//	chars[n].y = 0;
			//	chars[n].draw()
			//}
		}
	}

	return step();
}


var animateCircles = function(xcenter, ycenter, radius, _ctx, _color) {
	var duration = 10000;
	var start = new Date().getTime();
	var end = start + duration;
	
	var func = function(x) {
		x = 50*x
		var y = Math.sin(5/Math.PI*x)
	  var y = 1 - 1/(x+1);
		return y;
	}

	var step = function() {
		var t = new Date().getTime();
		var p = Math.min((duration - (end - t)) / duration, 1);

		s = func(p);

    _ctx.beginPath();
	  _ctx.arc(xcenter, ycenter, radius*s, 0, Math.PI*2, false);
	  _ctx.fillStyle= _color;
    _ctx.fill();



		if(p < 0.75) requestAnimationFrame(step);
	}

	return step();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
