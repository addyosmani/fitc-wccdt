(function() {

var rafId = null;
var PREFIXES = {
  'webkit': 'WebKit',
  'moz': 'Moz',
  'ms': 'MS',
  'o': 'O'
};

var transEndEventNames = {
  'WebkitTransition': 'webkitTransitionEnd',
  'MozTransition': 'transitionend',
  'OTransition': 'oTransitionEnd',
  'msTransition': 'MSTransitionEnd',
  'transition': 'transitionend'
};

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

window.cancelAnimationFrame = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame ||
    window.msCancelAnimationFrame || window.oCancelAnimationFrame;

// Find the correct transitionEnd vendor prefix.
window.transEndEventName = transEndEventNames[Modernizr.prefixed('transition')];

window.$ = function(selector, opt_scope) {
  var scope = opt_scope || document;
  return scope.querySelector(selector);
};

window.$$ = function(selector, opt_scope) {
  var scope = opt_scope || document;
  return Array.prototype.slice.call(scope.querySelectorAll(selector) || []);
};

HTMLElement.prototype.$ = function(selector) {
  return $(selector, this);
};

HTMLElement.prototype.$$ = function(selector) {
console.log($, $$)
  return $$(selector, this);
};

HTMLElement.prototype.listen = HTMLElement.prototype.addEventListener;
document.listen = document.addEventListener;

// If DOM is ready, run our setup. Otherwise wait for it to finish.
if (document.readyState === 'complete') {
  initContent();
} else {
  document.listen('readystatechange', function() {
    if (document.readyState === 'complete') {
      initContent();
    }
  });
}


function addVendorPrefixes() {
  $$('[data-tooltip-property]').forEach(function(tip, i) {
    var property  = tip.dataset.tooltipProperty;

    var support = Object.keys(PREFIXES); // Default to all prefixes if support array is missing.
    var includeUnprefixedVersion = false;
    if (tip.dataset.tooltipSupport) {
      support = JSON.parse(tip.dataset.tooltipSupport);
      // A 'unprefix' in the array indicates not to include unprefixed property.
      var idx = support.indexOf('unprefixed');
      if (idx != -1) {
        includeUnprefixedVersion = true;
        support.splice(idx, 1);
      }
    }

    var str = ['/* Requires vendor prefixes. */'];

    if ('tooltipJs' in tip.dataset) {
      tip.href = 'http://caniuse.com/#search=' + property;

      support.forEach(function(prefix, i) {
        // Capitalized Properties should remain so, unless explicitly called out.
        if (property[0] == property[0].toUpperCase() &&
            !('tooltipLowercase' in tip.dataset)) {
          var val = PREFIXES[prefix] + property;
        } else {
          var upperCasedProperty = property[0].toUpperCase() + property.substring(1);
          var val = prefix + upperCasedProperty;
        }
        if (!('tooltipJsProperty' in tip.dataset)) {
          val += '(...);';
        }
        str.push(val);
      });

      if (includeUnprefixedVersion) {
        str.push(property + '(...);');
      }

    } else {
      tip.href = 'http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#including_a_mixin';

      support.forEach(function(prefix, i) {
        str.push('-' + prefix + '-' + property);// + ': ...');

      });
      
      str.push(property);// + ': ...'); // Include unprefixed property by default for CSS.
    }

    tip.dataset.tooltip = str.join('\n');
    tip.role = 'tooltip';
    tip.innerHTML = '<span class="property">' +
                    //(!('tooltipJs' in tip.dataset) ? '+' : '') + property +
                    property +
                    '</span>';
    tip.dataset.tooltipActive = '';
  });
}

function fetchAndInjectSamples() {

  var pres = $$('pre[data-url]');

  pres.forEach(function(pre, i) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', pre.dataset.url);

    xhr.onloadend = function(e) {
      if (e.target.status == 200) {
        pre.textContent = e.target.response + pre.textContent;
        if (i == pres.length - 1) {
          prettyPrint();
        }
      }
    };

    xhr.send();
  });
}

function setupSnippetDemos() {

  var pres = $$('pre[data-run-demo]');

  pres.forEach(function(pre, i) {
    var a = document.createElement('a');
    a.href = pre.dataset.runDemo;
    //a.textContent = 'RUN DEMO';
    a.classList.add('snippet-demo');
    pre.appendChild(a);
  });
}


// DOM Ready business.
function initContent(e) {
  var currentSlide = slidedeck.slides[slidedeck.curSlide_];
  if (currentSlide.classList.contains('nobackdrop')) {
    document.body.classList.add('nobackdrop');
  }
  if (currentSlide.dataset.bodyClass) {
    document.body.classList.add(currentSlide.dataset.bodyClass);
  }

  slidedeck.container.listen('slideenter', function(e) {
    var slide = e.target;
    if (slide.classList.contains('nobackdrop')) {
      document.body.classList.add('nobackdrop');
    }

    if (slide.dataset.bodyClass) {
      document.body.classList.add(slide.dataset.bodyClass);
    }
  });

  slidedeck.container.listen('slideleave', function(e) {
    var slide = e.target;
    if (slide.classList.contains('nobackdrop')) {
      document.body.classList.remove('nobackdrop');
    }
    if (slide.dataset.bodyClass) {
      document.body.classList.remove(slide.dataset.bodyClass);
    }

  });

  document.listen('keydown', function(e) {
    switch (e.keyCode) {
      case 80: // P
        document.body.classList.toggle('with-devtools');
        break;
      default:
        break;
    }
  }, false);

  // Writing in markdown leaves off the .prettyprint class. Find those that
  // don't have the class and get em colored.
  $$('pre:not(.prettyprint)').forEach(function(pre, i) {
    pre.classList.add('prettyprint');
  });

  fetchAndInjectSamples(); // pulls custom element samples files into pre tags.

  addVendorPrefixes(); // adds vendor prefix tooltips

  setupSnippetDemos();

  prettyPrint();

  enableDiagramAnimations();

  initDemos();
}

})();


// Inline slide examples -------------------------------------------------------

function initDemos() {

  // function initCodeSnippetCycler(slide) {
  //   var pre = slide.querySelector('[data-code-cycle]');
  //   pre.innerHTML = encodeHTMLEntities(slide.querySelector('textarea[selected]').value);

  //   var textareas = slide.querySelectorAll('textarea');
  //   pre.dataset.lang = '1/' + textareas.length;

  //   prettyPrint();

  //   pre.listen('click', function(e) {
  //     if (!e.metaKey) {
  //       cycleToCodeSnippet(slide, textareas, e.shiftKey);
  //     }
  //   });
  // }

  // function cycleToCodeSnippet(slide, textareas, backwards) {
  //   var selectedTextarea = slide.querySelector('textarea[selected]');

  //   var idx = -1;
  //   [].forEach.call(textareas, function(textarea, i) {
  //     textarea.removeAttribute('selected');
  //     if (textarea == selectedTextarea) {
  //       idx = i;
  //     }
  //   });

  //   idx += (backwards ? -1 : 1);
  //   idx %= textareas.length;
  //   if (idx < 0) {
  //     idx = textareas.length - 1;
  //   }
  //   textareas[idx].setAttribute('selected', '');

  //   var pre = slide.querySelector('[data-code-cycle]');
  //   pre.innerHTML = encodeHTMLEntities(textareas[idx].value);

  //   pre.dataset.lang = (idx + 1) + '/' + textareas.length;

  //   prettyPrint();
  // }

  (function() {
    var demo = $('#polymer-ajax-demo');
    var output = demo.querySelector('output');

    demo.querySelector('.snippet-demo').listen('click', function(e) {
      e.preventDefault();

      output.innerHTML = '';

      var ajax = document.createElement('polymer-ajax');
      ajax.url = 'demos/components/bower_components/polymer-ajax/results.json';
      ajax.params = {
        alt: 'json',
        q: 'chrome'
      };
      ajax.handleAs = 'json';
      ajax.addEventListener('polymer-response', function(e) {
        var entries = e.target.response.feed.entry;
        entries.forEach(function(entry) {
          output.innerHTML += '<li>' + entry.title.$t + '</li>';
        });
      });
      ajax.go();
    });
  })();

  (function() {
    var demo = $('#polymer-flex-demo');
    var output = demo.querySelector('output');

    var flexLayout = output.querySelector('polymer-flex-layout');
    var flexDiv = flexLayout.querySelector('div[flex]');

    flexLayout.listen('click', function(e) {
      var div = document.createElement('div');
      div.textContent = 'new div!';
      this.appendChild(div);
    });

    demo.querySelector('[data-action="vertical"]').listen('click', function(e) {
      flexLayout.vertical = !flexLayout.vertical;
      e.target.classList.toggle('inactive');
    });

    demo.querySelector('[data-action="flex"]').listen('click', function(e) {
      var flexing = flexDiv.getAttribute('flex') != undefined;
      if (flexing) {
        flexDiv.removeAttribute('flex');
      } else {
        flexDiv.setAttribute('flex');
      }
      e.target.classList.toggle('inactive');
    });

  })();

  // (function() {
  //   var slide = $('#more-complex-elements');
  //   initCodeSnippetCycler(slide);
  // })();

  // (function() {
  //   var slide = $('#published-properties');
  //   initCodeSnippetCycler(slide);
  // })();

  (function() {
    var slides = $$('slide.googlecomtoday');

    var onTransEnd_ = function(e) {
      if (!this.classList.contains('current')) {
        return;
      }
      if (e.propertyName == '-webkit-transform' ||
          e.propertyName == '-moz-transform' ||
          e.propertyName == '-ms-transform' ||
          e.propertyName == 'transform') {
        slidedeck.nextSlide();
        this.classList.remove('active');
      }
    };

    slides.forEach(function(slide, i) {
      slide.listen('click', function() {
        this.classList.add('active');
      });

      slide.listen(transEndEventName, onTransEnd_.bind(slide));
    });

  })();

  (function() {
    var slide = $('#title-slide');
    var video = slide.$('video');
    var audio = slide.$('audio');

    var PLAYBACKRATE = 2;

    video.listen('ended', function(e) {
      video.load(); // video.currentTime = 0; doesn't work.
      video.playbackRate = PLAYBACKRATE; // screenflow captured at 30fps. get us to 60.
      video.play();
    });

    slide.listen('slideenter', function(e) {
      if (video.currentTime >= video.duration) {
        video.load();
      }
      video.playbackRate = PLAYBACKRATE;
      video.play();
      audio.play();
    });

    slide.listen('slideleave', function() {
      video.pause();
      audio.pause();
    });

    // If this slide is current on pageload, start playing video.
    if (slidedeck.slides[slidedeck.curSlide_] == slide) {
      video.playbackRate = PLAYBACKRATE;
      video.play();
      audio.play();
    }
  })();

  (function() {
    var slide = $('#platform-polyfills');
    slide.listen('slidebuild', function(e) {
      var rows = $$('.browser-support-row div', slide);
      rows.forEach(function(row) {
        row.classList.add('supported');
        row.classList.remove('partial');
      });
    });
  })();
}

function encodeHTMLEntities(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}

function enableDiagramAnimations() {

  (function() {
    var slide = $('#layers-of-polymer');
    slide.addEventListener('slideenter', function(e) {
      animations.captureElements();
      animations.setupFades();
    });

    slide.addEventListener('slidebuild', function(e) {
      var segment = slide.querySelector('.build-current');

      switch (segment.id) {
        case 'diagram-animate-in':
          animations.animateIn();
          break;

        case 'diagram-explode':
          animations.explode();
          break;

        case 'diagram-native':
          animations.focusOn('native-3d');
          break;

        case 'diagram-platform':
          animations.focusOn('platform-3d');
          break;

        case 'diagram-polymer':
          animations.focusOn('polymer-3d');
          break;

        case 'diagram-elements':
          animations.focusOn('elements-3d');
          break;

        case 'diagram-contract':
          animations.contract();
          break;
      }
    });
  })();

  (function() {
    var slide = $('#using-elements');
    slide.addEventListener('slideenter', function(e) {
      animations.captureElements();
      animations.setupFades();
      setTimeout(function() {
        animations.focusOnSeq('elements-3d');
      }, 1500);
    });
  })();

  (function() {
    var slide = $('#creating-elements');
    slide.addEventListener('slideenter', function(e) {
      animations.captureElements();
      animations.setupFades();
      setTimeout(function() {
        animations.focusOnSeq('polymer-3d');
      }, 1500);
    });
  })();

  (function() {
    var slide = $('#the-platform');
    slide.addEventListener('slideenter', function(e) {
      animations.captureElements();
      animations.setupFades();
      setTimeout(function() {
        animations.focusOnSeq('platform-3d');
      }, 1500);
    });
  })();

  (function() {
    var slide = $('#evaporate-platform');
    slide.addEventListener('slideenter', function(e) {
      animations.captureElements();
      animations.setupFades();
      animations.animateIn();
    });

    slide.addEventListener('slidebuild', function(e) {
      var segment = slide.querySelector('.build-current');

      switch (segment.id) {
        case 'diagram-animate-in':
          animations.animateIn();
          break;

        case 'platform-shrink':
          animations.platformShrink();
          break;
      }
    });
  })();

  var animations = {
    captureElements: function() {
      this.slide = slidedeck.slides[slidedeck.curSlide_];

      this.blocks3d = this.slide.$('#blocks-3d');
      this.native3d = this.slide.$('#native-3d');
      this.platform3d = this.slide.$('#platform-3d');
      this.polymer3d = this.slide.$('#polymer-3d');
      this.elements3d = this.slide.$('#elements-3d');

      this.blocks = [this.native3d, this.platform3d, this.polymer3d, this.elements3d];
    },
    setupFades: function() {
      this.blocks.forEach(function(block, index) {
        block.fadeOut = new Animation(block, [
          { opacity: 0.3 }
        ], { duration: 0.3, ease: 'ease-in-out' });
        
        block.fadeIn = new Animation(block, [
          { opacity: 1 }
        ], { duration: 0.3, ease: 'ease-in-out' });
      });
    },
    animateIn: function() {
      var group = new ParGroup();
      this.blocks.forEach(function(block, index) {
        group.append(new Animation(block, [
          { opacity: 0, transform: 'translate3d(0, -600px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 1, delay: 0.3 * index, easing: 'ease-in-out' }));
      });
      document.timeline.play(group);
    },
    explode: function() {
      var group = new ParGroup();
      this.blocks.forEach(function(block, index) {
        var posY1 = 5 + (index * 10);
        var posY2 = 70 - (index * 70);
        group.append(new Animation(block, [
          { offset: 0.4, transform: 'translate3d(0, ' + posY1 + 'px' + ', 0)' },
          { offset: 1, transform: 'translate3d(0, ' + posY2 + 'px' + ', 0)' }
        ], { duration: 0.5, easing: 'ease-in-out' }));
      });
      document.timeline.play(group);
      setTimeout(this.idle.bind(this), 400);
    },
    idle: function() {
      var group = new ParGroup();
      this.blocks.forEach(function(block, index) {
        var posY = (70 - (index * 70)) - 20;
        group.append(new Animation(block, [
          { transform: 'translate3d(0, ' + posY + 'px' + ', 0)' }
        ], {
            direction: 'alternate', duration: 1,
            delay: index == 3 ? 0 : 0.3 * index,
            iterations: Infinity, easing: 'ease-in-out'
        }));
      });
      document.timeline.play(group);
    },
    contract: function() {
      var group = new ParGroup();
      this.blocks.forEach(function(block, index) {
        group.append(new Animation(block, [
          { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 0.5, easing: 'ease-in-out' }));
      });
      document.timeline.play(group);
    },
    focusOn: function(name) {
      this.blocks.forEach(function(block) {
        if (block.id == name) {
          document.timeline.play(block.fadeIn);
          block.faded = false;
          return;
        }

        if (!block.faded) {
          document.timeline.play(block.fadeOut);
          block.faded = true;
        }
      });
    },
    focusOnSeq: function(name) {
      var fades = [];

      this.blocks.forEach(function(block) {
        if (block.id == name) {
          document.timeline.play(block.fadeIn);
          block.faded = false;
          return;
        }

        if (!block.faded) {
          fades.push(block.fadeOut.clone());
          block.faded = true;
        }
      });

      if (fades.length) {
        document.timeline.play(new SeqGroup(fades));
      }
    },
    platformShrink: function() {
      var animationShrink = new Animation(this.platform3d, [
          { opacity: 1, transform: 'scale3d(1, 1, 1)' },
          { opacity: 0, transform: 'scale3d(0, 0, 0)' }
        ], { duration: 1, easing: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)' });

      var animations = [this.polymer3d, this.elements3d].map(function(el) {
        return new Animation(el, [
            { transform: 'translate3d(0, 90px, 0)' }
          ], { duration: 1, easing: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)' });
      });

      var animationBottom = new Animation(this.native3d, [
          { transform: 'translate3d(0, -20px, 0)' }
        ], { duration: 1, easing: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)' });

      animations.unshift(animationShrink);
      animations.push(animationBottom);
      document.timeline.play(new ParGroup(animations));
    },
  };
}
