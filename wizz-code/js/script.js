function nullBool(value) {
  if (value) {
    return true;
  } else {
    return false;
  }
}

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

// Dingo Version 1.1.7
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
    var out = false;
    $.each(k.split(','),function (i,event) {
      if (typeof dingo[event] === 'object' && typeof dingo[event][dingoEvent] === 'function') {
        out = true;
      }
    });
    return out;
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
        if (k.length > 0) {
          var _match = k.match(/([a-zA-Z0-9_-]+):([^}]*)/);
          _match[2]  = _match[2].replace(/^\s+|\s+$/g,'');

          if (_match[2] === 'true') {
            _match[2] = true;
          } else if (_match[2] === 'false') {
            _match[2] = false;
          }

          options[_match[1]] = _match[2];
        }
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
    /*
      Track the single element-A on mousedown
      while mouse is down, if mouse moves initiate drag for element-A
      mouse up, release
    */
    var pageX = dingo.getMouse(options.event).pageX;
    var pageY = dingo.getMouse(options.event).pageY;

    function mouseEvent(string) {
      return (dingo.uniMouse(options.htmlEvent) === string);
    }

    function transferOptions() {
      options.el = dingoStore.dragEvent.el;
      for (var k in dingoStore.dragEvent.options) {
        if (!k.match(/^(htmlEvent|el|event)$/)) {
          options[k] = dingoStore.dragEvent.options[k];
        }
      }
      return options;
    }

    function trigger(event) {
      if (dingo.is(event,dingoStore.dragEvent.dingoEvent)) {
        dingo[event][dingoStore.dragEvent.dingoEvent](transferOptions());
      }
    }

    function set() {
      if (dingo.is('drag,dragstart,dragend',dingoEvent)) {
        dingoStore.dragEvent = {
          dingoEvent: dingoEvent,
          el: options.el,
          pageX: pageX,
          pageY: pageY,
          options: options,
          mousedown: true
        }
        trigger('dragstart');
      }
    }

    function clear() {
      trigger('dragend');
      dingoStore.dragEvent = {};
    }

    function drag() {
      if (Math.abs(dingoStore.dragEvent.pageX - pageX) > 10 || Math.abs(dingoStore.dragEvent.pageY - pageY) > 10) {
        trigger('drag');
      }
    }

    if (mouseEvent('down')) {
      set();
    } else if (mouseEvent('up')) {
      clear();
    }
    if (mouseEvent('move') && dingoStore.dragEvent.mousedown) {
      drag();
    }
  },
  exe: function (options) {
    var chain   = dingo.get(options.el,options.event);
    var tagname = options.el[0].tagName.toLowerCase();

    function mouseEvents(data,dingoEvent) {
      var swipe = dingo.swipeEvent(options,dingoEvent);

      if (swipe && dingo.is(swipe.event,dingoEvent)) {
        dingo[swipe.event][dingoEvent](data);
      }
      if (dingo.is(options.htmlEvent,dingoEvent)) {
        dingo[options.htmlEvent][dingoEvent](data);
      }

      dingo.dragEvent(options,dingoEvent);
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
    $(window).on('scroll',function (event) {
      if (typeof dingo.scroll === 'function') {
        dingo.scroll(event);
      }
    });
    if (typeof el.attr('data-dingo') === 'string') {
      $.each(dingo.htmlEvents(),function (i,htmlEvent) {
        el.off(htmlEvent);
        el.on(htmlEvent,function (event) {
          dingo.exe({htmlEvent:htmlEvent,el:$(this),event: event});
        });
      });
    }
  }
};

/*
  Form Validate Version 1.1.5
  MIT License
  by Sean MacIsaac
*/

function formValidate(el) {
  var form = el.closest('form');
  if (typeof el[0] !== 'undefined' && el[0].tagName.toLowerCase() === 'form') {
    form = el;
  } else {
    var baseName = (el.attr('name'))?el.attr('name').replace(/^confirm-/g,''):'';
    var base     = form.find('[name="' + baseName + '"]');
    var confirm  = form.find('[name="confirm-' + baseName + '"]');
  }

  function camelCase(string) {
    string = string||'';
    string = string.replace(/\(|\)/,'').split(/-|\s/);
    var out = [];
    for (var i = 0;i<string.length;i++) {
      if (i<1) {
        out.push(string[i].toLowerCase());
      } else {
        out.push(string[i][0].toUpperCase() + string[i].substr(1,string[i].length).toLowerCase());
      }
    }
    return out.join('');
  }

  return {
    type: function () {
      var attr = camelCase(el.attr('name')).toLowerCase();
      var tag  = (el.attr('type') === 'checkbox') ? 'checkbox' : el[0].tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        if (attr.match(/^zip(code|)$/)) {
          return 'zipCode';
        } else if (attr.match(/^(confirm|)(new|old|current|)password$/)) {
          return 'password'
        } else if (attr.match(/^(confirm|)(new|old|current|)email$/)) {
          return 'email';
        } else if (attr.match(/^(confirm|)phone(number|)$/)) {
          return 'phone';
        } else if (attr.match(/^merchantid$/)) {
          return 'merchantId';
        } else if (attr.match(/^marketplaceid$/)) {
          return 'marketplaceId';
        } else if (attr.match(/currency/)) {
          return 'currency';
        } else if (attr.match(/number/)) {
          return 'number';
        } else {
          return 'text';
        }
      } else {
        return tag;
      }
    },
    confirm: function () {

      function region() {
        return form.attr('data-region')||'United States of America';
      }

      function rules (el) {
        var string = $.trim(el.val())||'';
        return {
          text: function () {
            return (string.length > 0);
          },
          password: function () {
            return (string.length > 0 && nullBool(string.match(/[a-zA-Z0-9_-]+/)));
          },
          zipCode: function () {
            return (nullBool(string.match(/[0-9]{5}/)));
          },
          email: function () {
            return (nullBool(string.match(/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.([a-z]{2}|[a-z]{3})/)));
          },
          number: function () {
            return (nullBool(string.match(/^[0-9\.\-\,]+$/)));
          },
          currency: function () {
            return (nullBool(string.match(/^[0-9,]+(\.[0-9]{2}|)$/)))
          },
          merchantId: function () {
            var match = string.match(/^[A-Z0-9]+$/);
            return ((match) && (match[0].length > 9 && match[0].length < 22));
          },
          marketplaceId: function () {
            var match  = string.match(/^[A-Z0-9]+$/);
            var length = {'United States of America':13}[region()];
            return ((match) && (match[0].length === length));
          },
          select: function () {
            return (el[0].selectedIndex > 0);
          },
          checkbox: function () {
            return el[0].checked;
          },
          phone: function () {
            return (nullBool(string.replace(/\s|\(|\)|\-/g,'').match(/^([0-9]{7}|[0-9]{10})$/)));
          }
        }
      }; // Rules

      function fullfill(el,bool) {
        var label  = $('[for="' + el.attr('name') + '"]');
        var prompt = el.closest('.input-group').find('.form-validate-prompt');
        if (bool) {
          el.removeClass('form-validate');
          label.addClass('label_is-fulfilled');
          animate(prompt).end();
        } else {
          el.addClass('form-validate');
          label.removeClass('label_is-fulfilled');
        }
      };
      // Confirmation field check, checks is first condition is truthy then
      // checks if the fields are mirrors

      // Make sure that base & confirm satisfies rules

      fullfill(base,rules(base)[formValidate(base).type()]());

      if (confirm.size() > 0) {
        fullfill(confirm,(rules(confirm)[formValidate(base).type()]() && base.val() === confirm.val()));
      }
    },
    init: function (base, confirm) {
      if (el.size() > 0) {
        parameters.bool = bool;
        formValidate(el).fufilled();
        return formValidate(el);
      } else {
        return false;
      }
    },
    is: function () {
      return (form.find('.form-validate').size() < 1);
    },
    check: function () {
      form.find('[data-dingo*="form-validate"]').each(function () {
        if (!nullBool($(this).attr('data-dingo').match(/form-validate-submit/))) {
          formValidate($(this)).confirm();
        }
      });
      return form.find('.form-validate');
    },
    submit: function (event) {
      var requiredField = formValidate(form).check();
      var prompt;
      if (requiredField.size() > 0) {
        event.preventDefault();
        requiredField.each(function () {
          prompt = $(this).closest('.input-group').find('.form-validate-prompt');
          prompt.addClass('form-validate-prompt_is-active');
          animate(prompt).start();
        });
        if (requiredField.eq(0).closest('[class*="modal"]').size() < 1) {
          animate(requiredField.eq(0)).scroll();
        }
      }
    },
    clear: function (event) {
      var requiredField = form.find('input,textarea');
      var prompt;
      requiredField.each(function () {
        prompt = $(this).closest('.input-group').find('.form-validate-prompt');
        prompt.removeClass('form-validate-prompt_is-active').removeClass('is-animated_in');
        $(this).val('');
      });
    },
    guard: function (options) {
      var type = formValidate(el).type();
      if (type.match(/number|currency/)) {
        if (!nullBool(options.event.which.toString().match(/^(8|0)$/)) && !nullBool(String.fromCharCode(options.event.which).match(/[0-9\.,]+/))) {
          options.event.preventDefault();
        }
      }
    }
  }
};

/* Filters */

function filter(options) {
  /*
    If the filter is a slider pass the range
    If the filter is a switch pass the state
  */
  function inRange(selectedRange,range) {
    return (selectedRange >= range.left && selectedRange <= range.right);
  }
  var sliderEl    = $('#slider_' + options.name + '_' + options.match);
  var toggle      = $('#toggle_' + options.name + '_' + options.match);
  if (sliderEl.size() > 0) {
    var reg = new RegExp(options.match + '_([0-9]+)');
    var n   = parseInt(options.el.attr('class').match(reg)[1]);
    return inRange(n,slider(sliderEl).getPos());
  } else if (toggle.size() > 0) {
    var state = toggle.find('input[type="checkbox"]')[0].checked;
    var reg = new RegExp(options.match);
    var match = options.el.attr('class').match(reg);
    return (match && state || !match && state || !match && !state);
  }
}

function filterAll(options) {
  /*
    Scan each row
    Check to if row fulfills all cases
    if yes: display
    if no: hide
  */
  var target = $('.filter-target_' + options.name);
  var cases  = options.cases;

  target.each(function () {
    var el = $(this);
    var caseCheck = [];

    $.each(cases,function (i,k) {
      options.el = el;
      options.match = k;
      caseCheck[i] = filter(options);
    });

    if (caseCheck.indexOf(false) < 0) {
      el.show();
    } else {
      el.hide();
    }
  });

  if (target.filter(':visible').size() < 1) {
    target.closest('.slider-target').addClass('_empty');
  } else {
    target.closest('.slider-target').removeClass('_empty');
  }
}

/*
  Slider v1.2

  Made possible by the demands imposed by WizzSolutions.com
  coded by Sean MacIsaac
*/

var sliderFn = {
  all: function (options) {
    options.name   = 'servers';
    options.cases  = ['cpu','ram','hd','uplink','price','location-usa','location-eur','location-other'];
    filterAll(options);
  },
  vpsPower: function (options) {
    var tabContent = $('#vps_' + options.which);
    tabContent.find('.vps_item._active').removeClass('_active');
    tabContent.find('.vps_item').eq(options.right).addClass('_active');
  }
};

function slider(el,event) {
  var bar    = el.find('.slider-bar');
  var range  = el.attr('data-range').split(',');
  var fun    = el.attr('data-function');
  var steps  = range.length-1;
  function isRange() {
    return (el.hasClass('_range'));
  }
  function normalize(n) {
    if (n < 0) {
      return 0;
    } else if (n > steps) {
      return steps;
    } else {
      return n;
    }
  }
  function convert(n) {
    return normalize(Math.round((parseInt(n)/el.width())*steps));
  }
  function getPos() {
    return {
      left: convert(parseInt(bar.css('margin-left'))),
      right: steps-convert(parseInt(bar.css('margin-right')))
    }
  }
  function decontaminate(direction,out) {
    /* Prevents slider values from overlapping */
    if (isRange()) {
      if (direction === 'left' && out.left >= out.right) {
        out.left = out.right-1;
      } else if (direction === 'right' && out.right <= out.left) {
        out.right = out.left+1;
      }
    }
    return out;
  }
  function setPos(direction) {
    var out   = getPos();
    var pageX = dingo.getMouse(event).pageX-el.offset().left;
    if (direction === 'left') {
      out.left = convert(pageX);
    } else if (direction === 'right') {
      out.right = convert(pageX);
    }
    return decontaminate(direction,out);
  }
  function toFunction() {
    var match = fun.match(/([a-zA-Z0-9_]+)(?:\:([a-zA-Z0-9_\s]+)|)/);
    if (typeof sliderFn[match[1]] === 'function') {
      sliderFn[match[1]]({
        slider: el,
        range: range,
        left: getPos().left,
        right: getPos().right,
        which: match[2]
      });
    }
  }
  function sliderPrevNext(direction) {
    var pos = getPos();
    if (direction === 'prev' && pos.right > 0) {
      pos.right = pos.right-1;
    } else if (direction === 'next' && pos.right < steps) {
      pos.right = pos.right+1;
    }
    slider(el).move(pos);
    slider(el).slideEnd(direction);
  }
  function updateValues(pos) {
    el.find('.slider-text_left').html(range[pos.left]);
    el.find('.slider-text_right').html(range[pos.right]);
  }
  function position(direction) {
    slider(el).move(setPos(direction));
  }
  return {
    click: function () {
      slider(el,event).slide('right');
      toFunction();
    },
    move: function (pos) {
      var left  = (pos['left']/steps)*100+'%';
      var right = (100-(pos['right']/steps)*100)+'%';
      bar.css('margin-left',left);
      bar.css('margin-right',right);
      updateValues(pos);
    },
    next: function () {
      sliderPrevNext('next');
    },
    prev: function () {
      sliderPrevNext('prev');
    },
    getPos: function () {
      return getPos();
    },
    slide: function (direction) {
      position(direction);
    },
    slideStart: function (direction) {
      $('body').addClass('select-none');
      el.find('.slider_knob-'+direction).addClass('_active');
      el.addClass('_active');
      animate(el).start();
    },
    slideEnd: function (direction) {
      $('body').removeClass('select-none');
      el.find('.slider_knob-'+direction).removeClass('_active');
      el.removeClass('_active');
      if (!el.hasClass('_focus')) {
        animate(el).end();
      }
      toFunction();
    },
  }
}

var template_store = {};
var template_fn = {};
function template(context) {
  return {
    load: function (templateFile,callback) {
      function toObject(xml,i) {
        var xml  = xml.match(/<data>([\s\S]*?)<\/data>/)[1];
        var arr  = xml.match(/<([a-zA-Z0-9_-]+)>([\s\S]*?)<\/([a-zA-Z0-9_-]+)>/g);
        var data = {
          id: i
        };
        var match;
        $.each(arr,function (i,k) {
          match = k.match(/<([a-zA-Z0-9_-]+)>([\s\S]*?)<\/([a-zA-Z0-9_-]+)>/);
          data[match[1]] = match[2].replace(/^\s+|\s+$/g,'');
        });
        return data;
      };
      function toHTML(templateFrame,arr) {
        var out = [];
        $.each(arr,function (i,k) {
          out.push(template(templateFrame).fill(k));
        });
        return out.join('');
      };
      function convert(text) {
        var templateFrame = text.match(/<template>([\s\S]*?)<\/template>/)[1];
        var data = text.match(/<data>[\s\S]*?<\/data>/g);
        var arr = [];
        $.each(data,function (a,b) {
          arr.push(toObject(b,a));
        });
        return toHTML(templateFrame,arr);
      };
      function init() {
        $('<div/>').load(templateFile,function (text,k) {
          var result = convert(text);
          context.append(result);
          if (typeof callback === 'function') {
            callback(result);
          }
        });
      }
      if (context.size() > 0) {
        init();
      }
    },
    fill: function (object) {
      function convert(string) {
        if (nullBool(string.match(/\\/))) {
          return string.replace(/\\/,'');
        } else {
          return (object.hasOwnProperty(string))?object[string]:'';
        }
      }
      function condition(string) {
        var variable, alternate;
        var match = string.match(/\{\{([a-zA-Z0-9_-]+)\?([\S\s]*?)}}/);
        if (nullBool(match)) {
          variable  = convert(match[1]);
          alternate = convert(match[2]);
          if (variable.length > 0) {
            return variable;
          } else {
            return alternate;
          }
        } else {
          return string;
        }
      }
      function fill(string) {
        var match = string.match(/(?:\{\{)([a-zA-Z0-9_-]+)(?:\}\})/);
        if (nullBool(match)) {
          string = convert($.trim(match[1]));
        }
        return string;
      }
      return context.replace(/\{\{[\?\\a-zA-Z0-9_-]+\}\}/g,function (m) {
        m = condition(m);
        m = fill(m);
        return m;
      });
    },
    init: function (options) {
      function getData(string) {
        var contents = string.match(/^(\s+|)[a-zA-Z0-9_-]+(\s+|):(\s+|)([\s\S]*?$)/gm);
        var out = {};
        if (contents !== null) {
          $.each(contents,function (i,k) {
            if ($.trim(k).length > 0) {
              var match = k.match(/([a-zA-Z0-9_-]+)(?:\s+|):(?:\s+|)([^}]*)/);
              out[match[1]] = $.trim(match[2]);
            }
          });
        }
        return out;
      };
      function scan(string,file) {
        var temp = string.match(/<template name="[a-zA-Z0-9_-]+">[\s\S]*?<\/template>/g);
        var out = {};
        if (temp) {
          $.each(temp,function (i,k) {
            var match   = k.match(/<template name="([a-zA-Z0-9_-]+)">([\s\S]*?)<\/template>/);
            var name    = $.trim(match[1]);
            var content = match[2];
            template_store[name] = {
              file: file,
              content: content
            }
          });
        }
        return false;
      }

      function load(callback) {
        var arr = [];
        $('link[template]').each(function () {
          arr.push($.trim($(this).attr('template')));
        });
        function loadIt(i) {
          $('<div/>').load(arr[i],function (a,b) {
            scan(a,arr[i]);
            if (i+1 === arr.length) {
              callback();
            } else {
              loadIt(i+1);
            }
          });
        }
        loadIt(0);
      }

      load(function () {
        function init(object) {
          if (typeof template_store[object.which] === 'object') {
            var processed = $(template(template_store[object.which].content).fill(object.data));
            if (typeof template_fn[object.which] === 'function') {
              template_fn[object.which](object,processed);
            }
            object.el.replaceWith(processed);
            dingo.on(processed);
            dingo.on(processed.find('[data-dingo]'));
          }
        }
        $('[data-template]').each(function () {
          var el     = $(this);
          var out    = {
            el    : el,
            which : el.attr('data-template'),
            data  : getData(el.html())
          }
          init(out);
        });
      });
    }
  }
};

function changeCaptcha(arr) {
  $.each(arr,function (i,k) {
    if (k.find('#captcha-image').size() > 0) {
      k.find('#captcha-image')[0].src = 'get_captcha.php';
    }
  });
};

function navActivate(el,which) {
  el.find('[data-nav="' + which +'"]').addClass('_active');
}

template_fn.header = function (object,processed) {
  changeCaptcha([processed,$('body')]);
  navActivate(processed,object.data.page);
}

template_fn.footer = function (object,processed) {
  navActivate(processed,object.data.page);
}

/* Carousel */

function carousel(el) {
  var container     = el.find('.carousel-item-container');
  var items         = el.find('.carousel-item');
  var index         = items.filter('._animated-in').index();
  var selections    = el.find('.carousel-selections');
  return {
    select: function (newIndex) {
      if (newIndex > items.size()-1) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = items.size()-1;
      }
      var activePill = selections.find('._animated-in');
      var newPill    = selections.find('[data-dingo*="carouselSelect"]').eq(newIndex);
      if (index > -1) {
        animate(items.eq(index)).end(function () {
          animate(items.eq(newIndex)).start();
        });
      } else {
        animate(items.eq(newIndex)).start();
      }
      animate(activePill).end();
      animate(newPill).start();
    },
    next: function () {
      carousel(el).select(index+1)
    },
    prev: function () {
      carousel(el).select(index-1)
    },
  }
};

/* Segment Control */

var segmentControl = {
  standardVps: function (which) {
    $('#vps_standard').removeClass('_'+{linux: 'windows',windows: 'linux'}[which]).addClass('_' + which);
  },
  ssdVps: function (which) {
    $('#vps_ssd').removeClass('_'+{linux: 'windows',windows: 'linux'}[which]).addClass('_' + which);
  },
  segmentToggle: function (which) {
    var toggles = $('[id*="' + which.match('([a-zA-Z0-9-]+)_([a-zA-Z0-9]+)')[1] + '"]');
    toggles.filter('._active').removeClass('_active');
    $('#' + which).addClass('_active');
  }
}

/* Sticky Header */

function stickHeader(event) {
  function init() {
    var scroll = $(window).scrollTop();
    var headerHeight = $('#header').outerHeight();

    if (scroll > headerHeight && !$('body').hasClass('header-sticky')) {
      $('body').addClass('header-sticky');
    } else if (scroll < headerHeight && $('body').hasClass('header-sticky')) {
      $('body').removeClass('header-sticky');
    }
  }
  if (!dingo.isMobile()) {
    init();
  }
}

/* --------------- Main Events */

function touchDelay() {
  $('body').addClass('touch-delay');
  setTimeout(function () {
    $('body').removeClass('touch-delay');
  },100);
}

var dingoEvents = {
  'btn-nav': function (options) {
    var navContainer = options.el.closest('.btn-nav');
    navContainer.find('.btn-nav_btn_is-active').removeClass('btn-nav_btn_is-active');
    options.el.addClass('btn-nav_btn_is-active');
  },
  'form-validate_keyup': function (options) {
    formValidate(options.el).confirm();
  },
  'form-validate_keypress': function (options) {
    formValidate(options.el).guard(options);
  },
  'form-validate_click': function (options) {
    if (options.el.attr('type') === 'checkbox') {
      formValidate(options.el).confirm(options.el.attr('type'));
    }
  },
  'form-validate_change': function (options) {
    if (options.el[0].tagName === 'SELECT') {
      formValidate(options.el).confirm(options.el[0].tagName.toLowerCase());
    }
  },
  'form-validate-submit': function (options) {
    formValidate($('#'+options.which)).submit(options.event);
  },
  captchaRefresh: function (options) {
    changeCaptcha();
  },
  closePopouts: function (options) {
    var target = $(options.event.target);

    if ($('body').hasClass('touch-delay')) {
      options.event.preventDefault();
    }

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
    function nav() {
      function isnav() {
        return (target.closest('.nav-menu').size() < 1 && target.closest('.mobile-nav-menu_trigger').size() < 1);
      }
      if (isnav() && $('body').hasClass('navmenu-safe')) {
        $('body').removeClass('_nav-open');
      } else {
        $('body').addClass('navmenu-safe');
      }
    }
    popouts();
    submenu();
    nav();
  },
  modal: function (options) {
    animate($('#modal-' + options.which)).start();
    $('body').removeClass('popout-safe');
  },
  submenu: function (options) {
    animate($('.submenu._animated-in')).end();
    animate(options.el.find('.submenu')).start();
    $('body').removeClass('submenu-safe');
  },
  carouselPrev: function (options) {
    carousel($('#carousel-'+options.which)).prev();
  },
  carouselNext: function (options) {
    carousel($('#carousel-'+options.which)).next();
  },
  carouselSelect: function (options) {
    carousel($('#carousel-'+options.which)).select(options.el.index());
  },
  navMenuInit: function (options) {
    $('body').toggleClass('_nav-open');
    if ($('body').hasClass('_nav-open')) {
      touchDelay();
    }
  },
  featureBannerToggle: function (options) {
    var featureBanner = options.el.closest('.feature-banner');
    options.el.toggleClass('_on');
    if (options.el.hasClass('_on')) {
      animate(featureBanner).start();
    } else {
      animate(featureBanner).end();
    }
  },
  switchControl: function (options) {
    options.el.toggleClass('_on');
    options.el.find('.switch-checkbox')[0].checked = options.el.hasClass('_on');
    if (options.which === 'server-filters') {
      sliderFn.all({});
    }
  },
  mobileTooltip: function (options) {
    $('.server_feature._active').not(options.el).removeClass('_active');
    options.el.toggleClass('_active');
  },
  sliderNext: function (options) {
    slider($('#' + options.which)).next();
  },
  sliderPrev: function (options) {
    slider($('#' + options.which)).prev();
  },
  sliderFocus: function (options) {
    if (!options.el.hasClass('_range')) {
      slider(options.el,options.event).click();
    }
  },
  segmentSelect: function (options) {
    options.el.closest('.segment-control').find('.segment._active').not(options.el).removeClass('_active');
    options.el.addClass('_active');
    if (typeof segmentControl[options['function']] === 'function') {
      segmentControl[options['function']](options.which);
    }
  },
  tabs: function (options) {
    var container = options.el.closest('.tab-container');
    var index = options.el.index();
    var active = container.find('.tab._active');
    if (active[0] !== options.el[0]) {
      container.find('.tab._active').removeClass('_active')
      options.el.addClass('_active');

      $('#' + options.which).find('.tab_content._active').removeClass('_active');
      $('#' + options.which).find('.tab_content').eq(index).addClass('_active');
    }
  },
  'morePopout': function (options) {
    var popout = options.el.find('.more-popout');
    popout.css('margin-top','-' + Math.round(popout.outerHeight()/2) + 'px');
    animate(popout).start();
  }
}

dingo.touchstart = {
  sliderFocus: function (options) {
    /* Stops the phone from scrolling */
    options.event.preventDefault();
  }
}

dingo.touchend = {
  closePopouts: function (options) {
    dingoEvents[options.dingo](options);
  },
  captchaRefresh: function (options) {
    dingoEvents[options.dingo](options);
  },
  modal: function (options) {
    dingoEvents[options.dingo](options);
  },
  submenu: function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate_keyup': function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate_click': function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate_change': function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate-submit': function (options) {
    dingoEvents[options.dingo](options);
  },
  carouselNext: function (options) {
    dingoEvents[options.dingo](options);
  },
  carouselPrev: function (options) {
    dingoEvents[options.dingo](options);
  },
  carouselSelect: function (options) {
    dingoEvents[options.dingo](options);
  },
  navMenuInit: function (options) {
    dingoEvents[options.dingo](options);
  },
  featureBannerToggle: function (options) {
    dingoEvents[options.dingo](options);
    touchDelay();
  },
  switchControl: function (options)  {
    dingoEvents[options.dingo](options);
  },
  mobileTooltip: function (options) {
    dingoEvents[options.dingo](options);
  },
  sliderFocus: function (options) {
    dingoEvents[options.dingo](options);
  },
  sliderNext: function (options) {
    dingoEvents[options.dingo](options);
  },
  sliderPrev: function (options) {
    dingoEvents[options.dingo](options);
  },
  segmentSelect: function (options) {
    dingoEvents[options.dingo](options);
  },
  tabs: function (options) {
    dingoEvents[options.dingo](options);
  },
  'morePopout': function (options) {
    dingoEvents[options.dingo](options);
  }
};

dingo.click = {
  closePopouts: function (options) {
    dingoEvents[options.dingo](options);
  },
  captchaRefresh: function (options) {
    dingoEvents[options.dingo](options);
  },
  modal: function (options) {
    dingoEvents[options.dingo](options);
  },
  submenu: function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate_keyup': function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate_click': function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate_change': function (options) {
    dingoEvents[options.dingo](options);
  },
  'form-validate-submit': function (options) {
    dingoEvents[options.dingo](options);
  },
  carouselNext: function (options) {
    dingoEvents[options.dingo](options);
  },
  carouselPrev: function (options) {
    dingoEvents[options.dingo](options);
  },
  carouselSelect: function (options) {
    dingoEvents[options.dingo](options);
  },
  navMenuInit: function (options) {
    dingoEvents[options.dingo](options);
  },
  featureBannerToggle: function (options) {
    dingoEvents[options.dingo](options);
  },
  switchControl: function (options)  {
    dingoEvents[options.dingo](options);
  },
  sliderFocus: function (options) {
    dingoEvents[options.dingo](options);
  },
  sliderNext: function (options) {
    dingoEvents[options.dingo](options);
  },
  sliderPrev: function (options) {
    dingoEvents[options.dingo](options);
  },
  segmentSelect: function (options) {
    dingoEvents[options.dingo](options);
  },
  tabs: function (options) {
    dingoEvents[options.dingo](options);
  },
  'morePopout': function (options) {
    dingoEvents[options.dingo](options);
  }
};

dingo.mouseenter = {
  sliderFocus: function (options) {
    animate(options.el).start();
    options.el.addClass('_focus');
  }
}

dingo.mouseleave = {
  sliderFocus: function (options) {
    if (!options.el.hasClass('_active')) {
      animate(options.el).end();
    }
    options.el.removeClass('_focus');
  }
}

dingo.dragstart = {
  rangeSliderKnobLeft: function (options) {
    slider(options.el.closest('.slider'),options.event).slideStart('left');
  },
  rangeSliderKnobRight: function (options) {
    slider(options.el.closest('.slider'),options.event).slideStart('right');
  }
}

dingo.dragend = {
  rangeSliderKnobLeft: function (options) {
    slider(options.el.closest('.slider'),options.event).slideEnd('left');
  },
  rangeSliderKnobRight: function (options) {
    slider(options.el.closest('.slider'),options.event).slideEnd('right');
  }
}

dingo.drag = {
  rangeSliderKnobLeft: function (options) {
    slider(options.el.closest('.slider'),options.event).slide('left');
  },
  rangeSliderKnobRight: function (options) {
    slider(options.el.closest('.slider'),options.event).slide('right');
  }
}

dingo.keyup = {
  'form-validate': function (options) {
    dingoEvents[options.dingo + '_keyup'](options);
  }
};

dingo.keypress = {
  'form-validate': function (options) {
    dingoEvents[options.dingo + '_keypress'](options);
  }
};

dingo.blur = {
  'form-validate': function (options) {
    if (options.el[0].tagName.toLowerCase() === 'input') {
      dingoEvents[options.dingo + '_keyup'](options);
    }
  }
};

dingo.scroll = function (event) {
  stickHeader(event);
}

/* ------------- Execute ------------- */

$(function() {
  dingo.init();
  template().init();
  $('textarea,input').placeholder();
});
