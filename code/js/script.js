// Jquery Placeholder
/*! http://mths.be/placeholder v2.0.7 by @mathias */

;(function(window, document, $) {

  var isInputSupported = 'placeholder' in document.createElement('input');
  var isTextareaSupported = 'placeholder' in document.createElement('textarea');
  var prototype = $.fn;
  var valHooks = $.valHooks;
  var propHooks = $.propHooks;
  var hooks;
  var placeholder;

  if (isInputSupported && isTextareaSupported) {

    placeholder = prototype.placeholder = function() {
      return this;
    };

    placeholder.input = placeholder.textarea = true;

  } else {
    placeholder = prototype.placeholder = function() {
      var $this = this;
      $this
      .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
      .not('.placeholder')
      .bind({
        'focus.placeholder': clearPlaceholder,
        'blur.placeholder': setPlaceholder
      })
      .data('placeholder-enabled', true)
      .trigger('blur.placeholder');
      return $this;
    };

    placeholder.input = isInputSupported;
    placeholder.textarea = isTextareaSupported;

    hooks = {
      'get': function(element) {
        var $element = $(element);

        var $passwordInput = $element.data('placeholder-password');
        if ($passwordInput) {
          return $passwordInput[0].value;
        }

        return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
      },
      'set': function(element, value) {
        var $element = $(element);

        var $passwordInput = $element.data('placeholder-password');
        if ($passwordInput) {
          return $passwordInput[0].value = value;
        }

        if (!$element.data('placeholder-enabled')) {
          return element.value = value;
        }
        if (value == '') {
          element.value = value;
          // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
          if (element != safeActiveElement()) {
          // We can't use `triggerHandler` here because of dummy text/password inputs :(
            setPlaceholder.call(element);
          }
        } else if ($element.hasClass('placeholder')) {
          clearPlaceholder.call(element, true, value) || (element.value = value);
        } else {
          element.value = value;
        }
        // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
        return $element;
      }
    };

    if (!isInputSupported) {
      valHooks.input = hooks;
      propHooks.value = hooks;
    }
    if (!isTextareaSupported) {
      valHooks.textarea = hooks;
      propHooks.value = hooks;
    }

    $(function() {
      // Look for forms
      $(document).delegate('form', 'submit.placeholder', function() {
        // Clear the placeholder values so they don't get submitted
        var $inputs = $('.placeholder', this).each(clearPlaceholder);
        setTimeout(function() {
          $inputs.each(setPlaceholder);
        }, 10);
      });
    });

    // Clear placeholder values upon page reload
    $(window).bind('beforeunload.placeholder', function() {
      $('.placeholder').each(function() {
        this.value = '';
      });
    });

  }

              function args(elem) {
                // Return an object of element attributes
                var newAttrs = {};
                var rinlinejQuery = /^jQuery\d+$/;
                $.each(elem.attributes, function(i, attr) {
                  if (attr.specified && !rinlinejQuery.test(attr.name)) {
                    newAttrs[attr.name] = attr.value;
                  }
                });
                return newAttrs;
              }

              function clearPlaceholder(event, value) {
                var input = this;
                var $input = $(input);
                if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
                  if ($input.data('placeholder-password')) {
                    $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                                if (event === true) {
                                  return $input[0].value = value;
                                }
                                $input.focus();
                              } else {
                                input.value = '';
                                $input.removeClass('placeholder');
                                input == safeActiveElement() && input.select();
                              }
                            }
                          }

                          function setPlaceholder() {
                            var $replacement;
                            var input = this;
                            var $input = $(input);
                            var id = this.id;
                            if (input.value == '') {
                              if (input.type == 'password') {
                                if (!$input.data('placeholder-textinput')) {
                                  try {
                                    $replacement = $input.clone().attr({ 'type': 'text' });
                                  } catch(e) {
                                    $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                                  }
                                  $replacement
                                  .removeAttr('name')
                                  .data({
                                    'placeholder-password': $input,
                                    'placeholder-id': id
                                  })
                                  .bind('focus.placeholder', clearPlaceholder);
                                  $input
                                  .data({
                                    'placeholder-textinput': $replacement,
                                    'placeholder-id': id
                                  })
                                  .before($replacement);
                                }
                                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                                // Note: `$input[0] != input` now!
                              }
                              $input.addClass('placeholder');
                              $input[0].value = $input.attr('placeholder');
                            } else {
                              $input.removeClass('placeholder');
                            }
                          }

  function safeActiveElement() {
    // Avoid IE9 `document.activeElement` of death
    // https://github.com/mathiasbynens/jquery-placeholder/pull/99
    try {
      return document.activeElement;
    } catch (err) {}
  }
}(this, document, jQuery));


/* ------------- Animate v1.1.5 */
// MIT License
// Original Code by Sean MacIsaac

function animate(el) {
  return {
    getCssProperty: function (property) {
      var arr     = ['','ms','webkit','Moz','O'];
      var style   = window.getComputedStyle(el[0]);
      var r;
      function capitalize(str) {
        return str[0].toUpperCase()+str.substr(1,str.length-1);
      }
      if (style !== null) {
        for (var i=0;i < arr.length;i++) {
          if (arr[i].length < 1) {
            r = property;
          } else {
            r = arr[i]+capitalize(property);
          }
          if (typeof style[r] === 'string') {
            return style[r];
          }
        }
      }
      return false;
    },
    getTime: function () {
      var obj = {
        duration : 0,
        delay    : 0
      };
      // For IE 8
      if (typeof window.getComputedStyle === 'function') {
        obj.duration  = animate(el).jsTime(animate(el).getCssProperty('transitionDuration'));
        obj.delay     = animate(el).jsTime(animate(el).getCssProperty('transitionDelay'));

        if (obj.delay === 0 && obj.duration === 0) {
          obj.duration  = animate(el).jsTime(animate(el).getCssProperty('animationDuration'));
          obj.delay     = animate(el).jsTime(animate(el).getCssProperty('animationDelay'));
        }
      }
      return obj;
    },
    jsTime: function (style) {
      if (style) {
        return parseFloat(style.match(/([0-9]+(\.[0-9]+|))s/)[1])*1000;
      } else {
        return 0;
      }
    },
    start: function (callback) {
      return animate(el).init('in',callback);
    },
    end: function (callback) {
      return animate(el).init('out',callback);
    },
    custom: function (name,callback) {
      el.addClass(name);
      var time = animate(el).getTime();
      setTimeout(function () {
        el.removeClass(name);
        if (typeof callback === 'function') {
          callback(el);
        }
      },time.duration+time.delay);
      return el;
    },
    toggle: function () {
      if (el.hasClass('_animated-in')) {
        animate(el).end();
      } else {
        animate(el).start();
      }
    },
    classSwitch: function (arr) {
      el.removeClass('_animated-'+arr[1]);
      el.addClass('_animated-'+arr[0]);
      return animate(el);
    },
    ifOut: function (direction,arr,callback) {
      var time = animate(el).getTime();
      setTimeout(function () {
        if (direction === 'out') {
          el.removeClass('_animated-'+arr[0]);
        }
        if (typeof callback === 'function') {
          callback(el);
        }
      },time.duration+time.delay);
      return animate(el);
    },
    init: function (direction,callback) {
      if (typeof el[0] === 'undefined') {
        return false;
      } else {
        var arr = (direction === 'out')?['out','in']:['in','out'];
        function exe() {
          animate(el).classSwitch(arr).ifOut(direction,arr,callback);
        }
        if (direction === 'in') {
          exe();
        } else if (direction === 'out' && el.hasClass('_animated-in')) {
          exe();
        }
        return el;
      }
    },
    scroll: function () {
      var time   = 70;
      var pos    = (el.offset().top-el.height()/2)-($(window).height()/2);
      var start  = window.pageYOffset;
      var i      = 0;
      var frames = 20;

      function s() {
        i++;
        window.scrollTo(0,(start-((start/frames)*i))+((pos/frames)*i));
        if (i<frames) {
          setTimeout(function () {
            s();
          },(time/frames));
        }
      };
      s();
    }
  }
};

// Dingo Version 1.1.2
// MIT License
// Coded by Sean MacIsaac
// seanjmacisaac@gmail.com

var dingoStore = {};
var dingo = {
  isMobile: function () {
    //return ($(window).width() <= 400);
    if (navigator.userAgent.match(/iPhone|iPod|iPad|Android|BlackBerry/)) {
      return true;
    } else {
      return false;
    }
  },
  htmlEvents: function () {
    if (dingo.isMobile()) {
      return ['touchend','touchmove','touchstart','touchleave','keyup','keydown','keypress','change','focus','blur'];
    } else {
      return ['click','mousedown','mouseup','mouseenter','mouseleave','mousemove','keyup','keydown','keypress','change','focus','blur'];
    }
  },
  is: function (k,dingoEvent) {
    return (typeof dingo[k] === 'object' && typeof dingo[k][dingoEvent] === 'function');
  },
  get: function (el,event) {
    event      = event||'';
    var dingos = el.attr('data-dingo').match(/[a-zA-Z0-9_-]+(\s+|)(\{[^}]*?\}|)/g);
    var chain  = [];

    $.each(dingos,function (i,k) {
      chain.push(dingo.toJs({dingo: k,el: el,event: event}));
    });
    return chain;
  },
  toJs: function (options) {
    var match = options.dingo.match(/([a-zA-Z0-9_-]+)(?:\s+|)(\{([^}]*)\}|)/);
    var options = {el:options.el,event: options.event,dingo: match[1]};

    if (typeof match[3] === 'string' && match[3].length > 0) {
      $.each(match[3].split(';'),function (i,k) {
        var _match = k.match(/([a-zA-Z0-9_-]+):([^}]*)/);
        _match[2]  = _match[2].replace(/^\s+|\s+$/g,'');

        if (_match[2] === 'true') {
          _match[2] = true;
        } else if (_match[2] === 'false') {
          _match[2] = false;
        }

        options[_match[1]] = _match[2];
      });
    }

    return { dingoEvent: match[1], data: options };
  },
  getMouse: function (event) {
    var x = 0,
        y = 0;
    function init() {
      if (typeof event.originalEvent.changedTouches !== 'undefined') {
        x = event.originalEvent.changedTouches[0].pageX||0;
        y = event.originalEvent.changedTouches[0].pageY||0;
      } return {
        pageX: x,
        pageY: y
      }
    }
    if (dingo.isMobile()) {
      return init();
    } else {
      return event;
    }
  },
  uniMouse: function (event) {
    return {
      mousedown  : 'down',
      touchstart : 'down',
      mouseup    : 'up',
      touchend   : 'up',
      mousemove  : 'move',
      touchmove  : 'move'
    }[event];
  },
  swipeEvent: function (options,dingoEvent) {
    var rvalue = false,
        pageX  = dingo.getMouse(options.event).pageX,
        pageY  = dingo.getMouse(options.event).pageY,
        lr,
        ud;
    if (dingo.uniMouse(options.htmlEvent) === 'down') {
      dingoStore.swipeEvent[dingoEvent] = {
        x: pageX,
        y: pageY
      }
      // A Swipe event only triggers during a certain amount of time
      setTimeout(function () {
        dingoStore.swipeEvent[dingoEvent] = false;
      },300);
    } else if (dingo.uniMouse(options.htmlEvent) === 'up') {
      if (dingoStore.swipeEvent[dingoEvent]) {
        rvalue = {
          options : options,
          dingo   : dingoEvent,
          originX : dingoStore.swipeEvent[dingoEvent].x,
          originY : dingoStore.swipeEvent[dingoEvent].y
        }
        lr = dingoStore.swipeEvent[dingoEvent].x-pageX;
        ud = dingoStore.swipeEvent[dingoEvent].y-pageY;
        if (Math.abs(lr) > Math.abs(ud) && Math.abs(lr) > 44) {
          // Left or Right
          if (lr > 0) {
            rvalue.event = 'swipeleft';
          } else {
            rvalue.event = 'swiperight';
          }
        } else if (Math.abs(ud) > 44) {
          // Up or Down
          if (ud > 0) {
            rvalue.event = 'swipeup';
          } else {
            rvalue.event = 'swipedown';
          }
        } else {
          rvalue = false;
        }
      }
    }
    return rvalue;
  },
  dragEvent: function (options,dingoEvent) {
    var rvalue = false,
        pageX  = dingo.getMouse(options.event).pageX,
        pageY  = dingo.getMouse(options.event).pageY;

    if (dingo.uniMouse(options.htmlEvent) === 'down') {
      dingoStore.dragEvent[dingoEvent] = {
        originX: pageX,
        originY: pageY,
        dragstart: false
      }
    } else if (dingo.uniMouse(options.htmlEvent) === 'move' && dingoStore.dragEvent[dingoEvent]) {
      if (Math.abs(dingoStore.dragEvent[dingoEvent].originX-pageX) > 10 || Math.abs(dingoStore.dragEvent[dingoEvent].originY-pageY) > 10) {
        rvalue = {
          originX : dingoStore.dragEvent[dingoEvent].x,
          originY : dingoStore.dragEvent[dingoEvent].y,
          pageX   : pageX,
          pageY   : pageY,
          options : options,
          dingo   : dingoEvent
        }
        if (dingoStore.dragEvent[dingoEvent].dragstart) {
          rvalue.event = 'drag';
        } else {
          rvalue.event = 'dragstart';
          dingoStore.dragEvent[dingoEvent].dragstart = true;
        }
      } else {
        rvalue = false;
      }
    } else if (dingo.uniMouse(options.htmlEvent) === 'up') {
      if (dingoStore.dragEvent[dingoEvent].dragstart) {
        rvalue = {
          originX : dingoStore.dragEvent[dingoEvent].x,
          originY : dingoStore.dragEvent[dingoEvent].y,
          pageX   : pageX,
          pageY   : pageY,
          options : options,
          dingo   : dingoEvent,
          event   : 'dragend'
        }
        dingoStore.dragEvent[dingoEvent] = false;
      }
    }
    return rvalue;
  },
  exe: function (options) {
    var chain   = dingo.get(options.el,options.event);
    var tagname = options.el[0].tagName.toLowerCase();

    function mouseEvents(data,dingoEvent) {
      var swipe = dingo.swipeEvent(options,dingoEvent);
      var drag  = dingo.dragEvent(options,dingoEvent);

      if (swipe && dingo.is(swipe.event,dingoEvent)) {
        dingo[swipe.event][dingoEvent](data);
      }
      if (drag && dingo.is(drag.event,dingoEvent)) {
        dingo[drag.event][dingoEvent](data);
      }
      if (dingo.is(options.htmlEvent,dingoEvent)) {
        dingo[options.htmlEvent][dingoEvent](data);
      }
    }

    $.each(chain,function (i,k) {
      mouseEvents(k.data,k.dingoEvent);
    });
  },
  init: function (el) {
    dingoStore.swipeEvent = {};
    dingoStore.dragEvent = {};
    dingo.on($('[data-dingo]'));
  },
  on: function (el) {
    $.each(dingo.htmlEvents(),function (i,htmlEvent) {
      el.on(htmlEvent,function (event) {
        dingo.exe({htmlEvent:htmlEvent,el:$(this),event: event});
      });
    });
  }
};

function changeCaptcha() {
  $('#captcha-image')[0].src = 'get_captcha.php';
}

/* Dingo Abstraction Layer */

dingoAbs = {
  captchaRefresh: function (options) {
    changeCaptcha();
  },
  closePopouts: function (options) {
    var target = $(options.event.target);
    function popouts() {
      var activeClass = '._is-popout._animated-in';
      var activePopout = $(activeClass);
      if (activePopout.size() > 0 && $('body').hasClass('popout-safe')) {
        if (target.closest(activeClass).size() < 1) {
          animate(activePopout).end();
          $('body').removeClass('popout-safe');
        }
      } else {
        $('body').addClass('popout-safe');
      }
    }
    function submenu() {
      function isSubmenu() {
        return (target.closest('.submenu').size() < 1 && target.closest('[data-dingo="submenu"]').size() < 1);
      }
      if (isSubmenu() && $('body').hasClass('submenu-safe')) {
        animate($('.submenu._animated-in')).end();
        $('body').removeClass('submenu-safe');
      } else {
        $('body').addClass('submenu-safe');
      }
    }
    popouts();
    submenu();
  },
  modal: function (options) {
    animate($('#modal-' + options.which)).start();
    $('body').removeClass('popout-safe');
  },
  submenu: function (options) {
    animate($('.submenu._animated-in')).end();
    animate(options.el.find('.submenu')).start();
    $('body').removeClass('submenu-safe');
  }
}

dingo.click = {
  closePopouts: function (options) {
    dingoAbs[options.dingo](options);
  },
  captchaRefresh: function (options) {
    dingoAbs[options.dingo](options);
  },
  modal: function (options) {
    dingoAbs[options.dingo](options);
  },
  submenu: function (options) {
    dingoAbs[options.dingo](options);
  },
}

$(function () {
  dingo.init();
  changeCaptcha();
  $('textarea,input').placeholder();
});