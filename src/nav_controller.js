(function () {
  var defaultNavBar = '<a class="nav-back"></a><span class="nav-title"></span>';
  var hammerOpts = {
    drag: false,
    swipe: false,
    transform: false,
    tap: true,
    double_tap: false,
    hold: false
  };
  
  $.fn.navController = function (options) {
    options.events = options.events || {};
    var $this = this;
    var topId = options.topId;
    init(options);

    function init(options) {
      var top = $this.find('#' + topId);
      $this.bind(options.events);
      $this.find('.nav-url').bind('tap', hammerOpts, navUrl);
      $this.find('.nav-go').bind('tap', hammerOpts, navGo);
      top.addClass('current');
      $this.find('.nav-container').height(top.height());
      $this.find('.nav-view:not(.current)').each(function () {
        cssTranslate(this, '100%', 0, 0);
      });
      updateBar(topId);
    }
    function updateTitle (text) {
      var title = $this.find('.nav-title');
      var back = $this.find('.nav-back');
      var backWidth = back.outerWidth() + parseInt(back.css('left'), 10);
      var headerWidth = $this.find('.nav-bar').outerWidth();
      var padding = 0;
      var titleWidth;
      title.text(text);
      titleWidth = title.outerWidth();
      if ((headerWidth - titleWidth) / 2 < backWidth) {
        padding = backWidth;
      }
      title.css({
        'padding-left': '' + padding + 'px'
      });
    }
    function updateBack (fromId, toId) {
      var back = $this.find('.nav-back');
      var from = $this.find('#' + fromId);
      back.attr('data-nav-id', fromId);
      back.text(from.data('nav-title'));
      if (toId === topId) {
        back.addClass('hide');
      } else {
        back.removeClass('hide');
      }
    }
    function updateBar (fromId, toId) {
      toId = toId || fromId;
      var from = $this.find('#' + fromId);
      var to = $this.find('#' + toId);
      var navBar = $this.find('.nav-bar');
      var barContent = $this.find('#nav-bar-content-' + toId);
      if (barContent.length) {
        navBar.html(barContent.html());
        $this.trigger('nav:' + toId);
      } else {
        var text = to.data('nav-title');
        navBar.html(defaultNavBar);
        $this.find('.nav-back').bind('tap', hammerOpts, navBack);
        updateBack(fromId, toId);
        updateTitle(text);
      }
    }
    function navGo (e) {
      var ct = $(e.currentTarget);
      var toId = '' + $this.find(e.currentTarget).data('nav-id');
      var to = $this.find('#' + toId);
      var from = $this.find('.nav-view.current');
      var fromId = from.attr('id');
      var h = to.height();

      cssTranslate(to, '100%',0,0);
      cssTranslate(from, 0,0,0);
      $this.find('.nav-container').height(h);
      ct.addClass('tapped');
      to.addClass('slide');
      from.removeClass('current').addClass('slide');
      cssTranslate(to, 0,0,0);
      cssTranslate(from, '-100%',0,0);

      setTimeout(function () {
        ct.removeClass('tapped');
        to.removeClass('slide').addClass('current');
        from.removeClass('slide');
        updateBar(fromId, toId);
      }, 300);
    }
    function navBack(e) {
      var ct = $(e.currentTarget);
      var toId = '' + $this.find(e.currentTarget).data('nav-id');
      var to = $this.find('#' + toId);
      var fromId = $this.find('.nav-view.current').attr('id');
      var from = $this.find('#' + fromId);
      var h = to.height();

      cssTranslate(to, '-100%',0,0);
      cssTranslate(from, 0,0,0);
      $this.find('.nav-container').height(h);
      ct.addClass('tapped');
      to.addClass('slide');
      from.removeClass('current').addClass('slide');
      cssTranslate(to, 0,0,0);
      cssTranslate(from, '100%',0,0);

      setTimeout(function () {
        ct.removeClass('tapped');
        to.removeClass('slide').addClass('current');
        from.removeClass('slide');
        updateBar(fromId, toId);
      }, 300);
    }
    function navUrl (e) {
      var ct = $(e.currentTarget);
      if (ct.data('url')) {
        ct.addClass('tapped');
        location = ct.data('url');

        setTimeout(function () {
          ct.removeClass('tapped');
        }, 300);
      }
    }
  };


  function propPrefix(prop) {
    var el = $('<div/>')[0];
    var style = el.style;
    var prefixes = ['Webkit', 'Moz', 'O', 'ms'];

    if (prop in el.style) {
      return '';
    }
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i in prefixes) {
      if (prefixes[i]+prop in el.style) {
        return '-'+prefixes[i].charAt(0).toLowerCase()+prefixes[i].slice(1)+'-';
      }
    }
    return false;
  }
  function supports3d () {
    return 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
  }


  var cssTranslate = (function () {
    var transformProp = propPrefix('transform') + 'transform';
    var hasTranslate3d = supports3d();

    return function (el, x, y, z) {
      var translate = 'translate';
      if (typeof x !== "string") {
        x = '' + x + 'px'
      }
      if (typeof y !== "string") {
        y = '' + y + 'px'
      }
      if (typeof z !== "string") {
        z = '' + z + 'px'
      }

      if (hasTranslate3d) {
        translate += '3d('+x+','+y+','+z+')';
      } else {
        translate += '('+x+','+y+')';
      }

      $(el).css(transformProp, translate);
    };
  })();
}());