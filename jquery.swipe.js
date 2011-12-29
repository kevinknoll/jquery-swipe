/*jquery swipe 1.0 by kevin knoll (https://github.com/kevinknoll/jquery-swipe)*/
(function($) {
  $.fn.swipe = function(method) {
    var self = this.swipe;
    var $this = $(this);
    var x = null;
    var y = null;
    var swiping = false;
    /*public methods*/
    var methods = {
      init: function(options) {
        self.settings = $.extend({}, self.defaults, options);
        return this.each(function() {
          $this.unbind('.swipe');
          $this.bind('touchstart.swipe', helpers.onTouchStart);
          $this.bind('touchmove.swipe', helpers.onTouchMove);
        });
      }
    };
    /*private methods*/
    var helpers = {
      onTouchMove: function(e) {
        /*grab the original event (jquery's event doesn't contain direct access to the touches)*/
        e = e.originalEvent;
        /*if swiping has started*/
        if (swiping) {
          var dx = x - e.touches[0].pageX;
          var dy = y - e.touches[0].pageY;
          var l = false;
          var r = false;
          var u = false;
          var d = false;
          if (Math.abs(dx) >= self.settings.min_x) {
            l = (dx > 0);
            r = !l;
          }
          if (Math.abs(dy) >= self.settings.min_y) {
            u = (dy > 0);
            d = !u;
          }
          if (l || r || u || d) {
            /*swiping has ended (can't use touchend because: 1. we count a swipe as soon as it happens, not when the user lifts their finger, 2. touchend isn't reliable on all devices)... set swiping = true on touchstart, trip to false after first successful touchmove (can't swipe again until next touchstart)*/
            swiping = false;
            self.settings.swipe(l, r, u, d);
          }
        }
      },
      onTouchStart: function(e) {
        /*grab the original event (jquery's event doesn't contain direct access to the touches)*/
        e = e.originalEvent;
        /*don't trigger swipe on multitouch swipe*/
        if (e.touches.length === 1) {
          x = e.touches[0].pageX;
          y = e.touches[0].pageY;
          /*swiping has started*/
          swiping = true;
        }
      }
    };

    /*entry point, invoke method, initialize, or error out*/
    if (methods[method]) {
      /*if a method as the given argument exists, call the respective method*/
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      /*if an object is given as method OR nothing is given as argument, init*/
      return methods.init.apply(this, arguments);
    } else {
      /*error out*/
      $.error('Method "' +  method + '" does not exist in swipe plugin!');
      return false;
    }
  };
  $.fn.swipe.defaults = {
    min_x: 20,
    min_y: 20,
    swipe: function(l,r,u,d){}
  };
  $.fn.swipe.settings = {};
})(jQuery);