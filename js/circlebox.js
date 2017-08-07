;(function($){
	var CircleBox = function(container, opts){
		if(this instanceof CircleBox){
			this.box = container;
			this.imgs = opts.imgs;
			this.count = opts.imgs.length;
			this.circle = undefined;
			this.timer = null;
			this.speedX = opts.speedX||0;
			this.speedY = opts.speedY||0;
			this.lastX = opts.lastX||0;
			this.lastY = opts.lastY||0;
			this.x = 0;
			this.y = 0;
			this.disX = 0;
			this.disY = 0;
			this.down = false;
			this._loadImg(this.imgs);
		}else{
			return new CircleBox(container, opts);
		}
	};
	CircleBox.prototype = {
		_loadImg: function(imgs){
			var _count = 0,_this = this;
			for(var i=0,len=imgs.length;i<len;i++){
				(function(index){
					var img = new Image();
					img.onload = function(){
						if(++_count >= _this.count){
							_this._init();
						}
					};
					img.src = imgs[index];
				})(i);
			}
		},
		_init: function(){
			var ul = $('<ul/>'),arr = [],num = this.count - 1,per = 360/this.count,_this = this;
			for(var i=0,len=this.count;i<len;i++) arr.push('<li><img src="'+this.imgs[i]+'"></li>');
			var lis = $(arr.join('')).appendTo(ul);
			this.box.append(ul);
			this.timer = setInterval(function(){
				var transStyle = 'rotateY('+num*per+'deg) translateZ(300px)';
				lis.eq(num).css({'WebkitTransform': transStyle, 'transform': transStyle});
				num--;
				if(num == -1){
					clearInterval(_this.timer);
					_this.timer = null;
					_this._eventInit();
				}
			}, 200);
		},
		_eventInit: function(){
			var box = this.box[0],_this = this;
			box.onmousedown = function(e){
				if(_this.down) return false;
				_this.down = true;
				_this.disX = e.clientX - _this.x;
				_this.disY = e.clientY - _this.y;
				clearInterval(_this.timer);
				_this.timer = null;
				return false;
			};
			box.onmousemove = function(e){
				if(!_this.down) return false;
				_this.x = e.clientX - _this.disX;
				_this.y = e.clientY - _this.disY;
				_this.box.find('ul').css({'WebkitTransform':'rotateY('+_this.x/5+'deg)', 'transform':'rotateY('+_this.x/5+'deg)'});
				_this.speedX = _this.x - _this.lastX;
				_this.sppedY = _this.y - _this.lastY;
				_this.lastX = _this.x;
				_this.lastY = _this.y;
				return false;
			};
			box.onmouseup = function(e){
				if(!_this.down) return false;
				_this.down = false;
				clearInterval(_this.timer);
				_this.timer = setInterval(function(){
					_this.x += _this.speedX;
					_this.y += _this.speedY;
					_this.speedX *= .95;
					_this.speedY *= .95;
					_this.box.find('ul').css({'WebkitTransform':'rotateY('+_this.x/5+'deg)', 'transform':'rotateY('+_this.x/5+'deg)'});
				}, 30);
				return false;
			};
		}
	};
	window['CircleBox'] = CircleBox;
})(jQuery);