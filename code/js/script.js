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

// Dingo Version 1.1.3
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
      el.off(htmlEvent);
      el.on(htmlEvent,function (event) {
        dingo.exe({htmlEvent:htmlEvent,el:$(this),event: event});
      });
    });
  }
};

/*
  Form Validate Version 1.0.1
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

  function nullBool(value) {
    if (value) {
      return true;
    } else {
      return false;
    }
  }

  return {
    confirm: function () {

      function region() {
        return form.attr('data-region')||'United States of America';
      }

      function convert (el) {
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
          } else {
            return 'text';
          }
        } else {
          return tag;
        }
      }

      function rules (el) {
        var string = el.val()||'';
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

      fullfill(base,rules(base)[convert(base)]());

      if (confirm.size() > 0) {
        fullfill(confirm,(rules(confirm)[convert(base)]() && base.val() === confirm.val()));
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
    }
  }
};

/* Carousel */

function carousel(el) {
  var container     = el.find('.carousel-item-container');
  var items         = el.find('.carousel-item');
  var index         = items.filter('._animated-in').index();
  var pillContainer = el.find('.carousel-pills');
  return {
    select: function (newIndex) {
      if (newIndex > items.size()-1) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = items.size()-1;
      }
      var activePill = pillContainer.find('._animated-in');
      var newPill    = pillContainer.find('.carousel-pill').eq(newIndex);
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
    create: function () {
      function makePills() {
        var pilltemplate  = '<div class="carousel-pill {{class}}" data-dingo="carouselPill{which: {{carousel}}}"><div class="carousel-pill-background"></div></div>';
        var pills         = [];
        var data;
        items.each(function (i) {
          data = {
            carousel : el.attr('id').replace(/carousel-/,''),
            id       : i
          }
          if (i<1) { data.class = '_animated-in' }
          pills.push(template(pilltemplate).fill(data));
        });
        pillContainer.append(pills.join(''));
        dingo.on(pillContainer.find('[data-dingo]'));
      };
      makePills();
      carousel(el).select(0);
    },
    init: function () {
      el.each(function () {
        if (!$(this).attr('id').match(/carousel-[a-zA-Z-]+item/)) {
          carousel($(this)).create();
        }
      });
    }
  }
};

function changeCaptcha() {
  $('#captcha-image')[0].src = 'get_captcha.php';
};

/* --------------- Main Events */

var dingoEvents = {
  'btn-nav': function (options) {
    var navContainer = options.el.closest('.btn-nav');
    navContainer.find('.btn-nav_btn_is-active').removeClass('btn-nav_btn_is-active');
    options.el.addClass('btn-nav_btn_is-active');
  },
  'nav-view':function (options) {
    var container = $(options.view);
    var notActive = container.find('.nav-view_item_is-active');
    var active    = $(options.view+'_'+options.nav);
    notActive
      .show()
      .removeClass('nav-view_item_is-active')
      .stop().animate({'opacity':'0'},200);
    active
      .show()
      .stop().animate({'opacity':'1'},200)
      .addClass('nav-view_item_is-active')
      .appendTo(container);
  },
  'dropdown': function (options) {
    var container = options.el.closest('.dropdown-container');
    container.find('.dropdown').addClass('dropdown_is-active');
  },
  'close-popups': function (options) {
    if (options.target.closest('.dropdown-container').size() < 1) {
      $('.dropdown_is-active').removeClass('dropdown_is-active');
    }
  },
  'table-click': function(options) {
    window.location = options.href;
  },
  'form-validate_keyup': function (options) {
    formValidate(options.el).confirm();
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
  },
  carouselPrev: function (options) {
    carousel($('#carousel-'+options.which)).prev();
  },
  carouselNext: function (options) {
    carousel($('#carousel-'+options.which)).next();
  },
  carouselPill: function (options) {
    carousel($('#carousel-'+options.which)).select(options.el.index());
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
  carouselPill: function (options) {
    dingoEvents[options.dingo](options);
  }
};

dingo.keyup = {
  'form-validate': function (options) {
    dingoEvents[options.dingo + '_keyup'](options);
  }
};

dingo.blur = {
  'form-validate': function (options) {
    if (options.el[0].tagName.toLowerCase() === 'input') {
      dingoEvents[options.dingo + '_keyup'](options);
    }
  }
};


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
      return context.replace(/\{\{[a-zA-Z0-9_-]+}}/g,function (m) {
        m = m.match(/(?:\{\{)([a-zA-Z0-9_-]+)(?:\}\})/)[1];
        return (object.hasOwnProperty(m))?object[m]:'';
      });
    }
  }
};

/* ------------- Execute ------------- */

$(function() {
  dingo.init();
  template($('#carousel-testimonial .carousel-item-container')).load('testimonials.txt',function () {
    carousel($('[id*="carousel"]')).init();
  });
  changeCaptcha();
  $('textarea,input').placeholder();
});
