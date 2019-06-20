(function($) {
  'use strict';

  /**  Returns the animation css prefix supported by the browser  */
  //  اینجا نوع بروزر رو چک میکنه تغییر لازم نیست
  var _prefix = (function(domNode) {
    var prefixs = ['webkit', 'Moz', 'o', 'ms'],
        props;

    for(var i in prefixs) {
      props = prefixs[i] + 'Transition';
      if(domNode.style[props] !== undefined) {
        return '-' + prefixs[i].toLowerCase() + '-';
      }
    }
    return false;
  })(document.createElement('div'));

  /** Default configuration parameters */
  //کانفیگ دیفالت اینم نیاز به تغییر نداره
  var DEFAULT = {
    /** dom结构类名 */
    selectors: {
      sections: '.sections',
      section: '.section',
      page: '.page',
      active: '.active'
    },
    /** 当前页索引 */
    index: 0,
    /** 动画曲线 */
    timing: 'ease',
    /** 动画时间 */
    duration: 2500,
    /** 是否循环播放 */
    loop: false,
    /** 是否显示分页dot */
    pagination: true,
    /** 是否支持键盘操作 */
    keyboard: false,
    /** 滑动开始的事件 */
    direction: 'vertical',
    beforeScroll: null,
    /** 滑动结束后的事件 */
    afterScroll: null
  };

  function FsScroll(element, options) {
    this.element = element;
    this.options = $.extend({}, DEFAULT, options || {});
    this.init();
  }

  FsScroll.prototype = {
    /** 初始化属性，事件入口 */
    init: function() {
      this.selectors = this.options.selectors;
      this.sections = this.element.find(this.selectors.sections);
      this.section = this.element.find(this.selectors.section);
      this.isVertical = this.options.direction === 'vertical' ? true : false;
      this.pagesCount = this.pagesCount();
      this.index = (this.options.index >=0 && this.options.index < this.pagesCount) ? this.options.index : 0;
      this.canScroll = true;

      this._addPosition();

      if(!this.isVertical || this.index) {
        this._initLayout();
      }
      if(this.options.pagination) {
        this._initPagination();
      }
      this._initEvent();
    },

    /** تعداد صفحات رو حساب میکنه */
    pagesCount: function() {
      return this.section.length;
    },

    /** میره صفحه قبل */
    prev: function() {
      if(this.index) {
        this.index--;
      }else {
        this.index = this.pagesCount - 1;
      }
      this._scrollPage();
    },

    /** میره صفحه بعد */
    next: function() {
      if(this.index === this.pagesCount - 1) {
        this.index = 0;
      }else {
        this.index++;
      }
      this._scrollPage();
    },
    home: function() {
      this.index = 0;
    },
    /**
     * Get the distance per slide
     */
    _getScrollLength: function() {
      return this.isVertical ? this.element.height() : this.element.width();
    },

    /** In order to correctly calculate the position of each page,
    the father container should be relatively positioned */
    _addPosition: function() {
      var position = this.sections.css('position');
      if(!position || position !== 'relative') {
        this.sections.css('position', 'relative');
      }
    },
    /** 初始化水平滑动的布局 */
    _initLayout: function() {
      if(!this.isVertical) {
        var width = this.pagesCount * 100 + '%',
            pageWidth = (100/this.pagesCount).toFixed(2) + '%';
        this.sections.width(width);
        this.section.width(pageWidth).css('float', 'left');
      }

      if(this.index) {
        this._scrollPage(true);
      }
    },
    /** Initialize pagination
    چیزهایی که توی تمام صفحات ثابت هستند باید اینجا اضافه شوند */
    _initPagination: function() {

      var pageCls = this.selectors.page.substring(1),
          pageHtml = '<ul class=' + pageCls + '>';
          pageHtml += '<div class="textEvent"> </div>';
      // علامت های سمت چپ صفحه برای رفتن به صفحات بعد
      for(var i = 0; i < this.pagesCount; i++) {
        pageHtml += `<li><div class=""><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.13 14.03">
        <defs><style>.cls-1{fill:none;stroke:#fff;stroke-miterlimit:10;stroke-width:0.75px;}</style></defs>
        <path class="cls-1 icon" d="M11.87,13.66H3.28a2.9,2.9,0,0,1-2.9-2.9,2.82,2.82,0,0,1,.4-1.5l4.3-7.4a2.94,
        2.94,0,0,1,4-1.1,2.15,2.15,0,0,1,1,1.1l4.3,7.4a2.93,2.93,0,0,1-1.1,4A2.3,2.3,0,0,1,11.87,13.66Z"/></svg></div></li>`;
      }
      pageHtml += '</ul>';
      this.element.append(pageHtml);

      var pages = this.element.find(this.selectors.page);
      this.pageItem = pages.find('li');
      this.activeCls = this.selectors.active.substring(1);
      this.pageItem.eq(this.index).addClass(this.activeCls);

      if(this.isVertical) {
        pages.addClass('vertical');
      }else {
        pages.addClass('horizontal');
      }
    },

    /** Initialize event */
    _initEvent: function() {
      var self = this;

      /** 绑定鼠标滚轮事件
       * firefox 滚轮事件为 DOMMouseScroll
       */
      self.element.on('mousewheel DOMMouseScroll', function(e) {
        e.preventDefault();
        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        if(self.canScroll) {
          if(delta > 0 && (self.options.loop || self.index)) {            
            self.prev();              
          }else if(delta < 0 && (self.options.loop || self.index < self.pagesCount - 1)) {
              // if(self.index==0){
              //   test(event);
              // }
              self.next();
            
          }
        }
      });
      
      /** Binding keyboard events */
      if(self.options.keyboard) {
        $(document).on('keyup', function(e) {
          var keyCode = e.keyCode;
          if(keyCode === 37 || keyCode === 38) {
            self.prev();
          }else if(keyCode === 39 || keyCode === 40) {
            self.next();
          }
        })
      }

      /**
       * Window resize event
       * Get the offset of the current page, relative to the offset of the viewport,
        slides when the offset is more than half
       */
      var timer = null;
      $(window).on('resize', function(){
        clearTimeout(timer);
        timer = setTimeout(function() {
          // The offset on the first page is always 0 during the zoom process, does not affect
          if(!self.index) {
            return;
          }

          var offset = self.section.eq(self.index).offset();
          var scrollLength = self._getScrollLength();
          var offsetDelta = self.isVertical ? offset.top : offset.left;
          if(Math.abs(offsetDelta) > scrollLength / 2) {
            if(offsetDelta > 0) {
              self.index--;
            }else {
              self.index++;
            }
          }
          self._scrollPage();
        }, 200)
      });

      /** Paging click event */
      self.element.on('click', this.selectors.page + ' li', function(e) {
        self.index = $(this).index();
        self._scrollPage();
      });

      /** Triggered after the transition animation ends */
      if(_prefix) {
        self.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
          self.canScroll = true;
          self._afterScroll();
        })
      }
    },

    /** Swipe to current page */
    _scrollPage: function(init) {
      var self = this,
          dest = self.section.eq(self.index).position();

      if(!dest) return;

      self.canScroll = false;
      this._beforeScroll();

      if(_prefix) {
        var translate = self.isVertical ? 'translateY(-' + dest.top + 'px)' : 'translateX(-' + dest.left + 'px)';
        self.sections.css(_prefix + 'transition', 'all ' + self.options.duration + 'ms ' + self.options.timing);
        self.sections.css(_prefix + 'transform', translate);
      }else {
        // Compatible with jquery animation functions that do not support css3 transition animations
        var animateCss = self.isVertical ? {top: -dest.top} : {left: -dest.left};
        self.sections.animate(animateCss, self.options.duration, function() {
          self.canScroll = true;
          self._afterScroll();
        })
      }

      if(self.options.pagination && !init) {
        self.pageItem.eq(self.index).addClass(self.activeCls).siblings('li').removeClass(self.activeCls);
      }
    },

    /** Sliding start processing */
    _beforeScroll: function() {
      var self = this;
      if(self.options.beforeScroll && $.type(self.options.beforeScroll) === 'function') {
        self.options.beforeScroll.call(self, self.section.eq(self.index), self.index);
      }
    },

    /** Sliding end processing */
    _afterScroll: function() {
      var self = this;
      if(self.options.afterScroll && $.type(self.options.afterScroll) === 'function') {
        self.options.afterScroll.call(self, self.section.eq(self.index), self.index);
      }
    }
  }

  /**
   * Binding plugin jquery prototype object
   */
  $.fn.fsScroll = function(options) {
    return this.each(function() {
      var self = $(this),
          instance = self.data('fsScroll');

      if(!instance) {
        instance = new FsScroll(self, options);
        self.data('fsScroll', instance);
      }

      if(typeof options === 'string' && instance[options]) {
        return instance[options]();
      }
    })
  }

  $(function() {
    $('[data-fs-scroll]').fsScroll();
  })

})(jQuery);
