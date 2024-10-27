// Since we can't use ES6 imports, we will use script tags in HTML to include the libraries.
// Ensure you include Tweakpane, Splitting, and GSAP via CDN in your HTML file.

// Example of how to include them in your HTML
/*
<script src="https://cdn.skypack.dev/tweakpane"></script>
<script src="https://cdn.skypack.dev/splitting"></script>
<script src="https://cdn.skypack.dev/gsap@3.12.0"></script>
<script src="https://cdn.skypack.dev/gsap@3.12.0/Draggable"></script>
*/

gsap.registerPlugin(Draggable, InertiaPlugin);

Splitting();

var popover = document.querySelector('#nav');
var themer = document.querySelector('.theme-toggle');
var debug = document.querySelector('.debug-toggle');
var placer = document.querySelector('.placement-toggle');

var deb;
document.documentElement.dataset.resizing = false;
document.documentElement.dataset.theme = 'system';
document.documentElement.dataset.placement = 'top';

window.addEventListener('resize', function () {
  if (popover.matches(':popover-open')) popover.hidePopover();
  document.documentElement.dataset.resizing = true;
  if (deb) clearTimeout(deb);
  deb = setTimeout(function () {
    document.documentElement.dataset.resizing = false;
  }, 200);
});

placer.addEventListener('click', function () {
  document.documentElement.dataset.placement =
    document.documentElement.dataset.placement === 'top' ? 'bottom' : 'top';
});

var config = {
  theme: 'system',
  debug: false,
};

var themeIndex = 0;
var themeOptions = ['system', 'light', 'dark'];
var switchTheme = function () {
  themeIndex += 1;
  config.theme = themeOptions[themeIndex % 3];
  sync();
};

themer.addEventListener('click', switchTheme);

var switchDebug = function () {
  config.debug = !config.debug;
  sync();
};

debug.addEventListener('click', switchDebug);

var update = function () {
  document.documentElement.dataset.theme = config.theme;
  document.documentElement.dataset.debug = config.debug;
};

var sync = function (event) {
  if (!document.startViewTransition) return update();
  document.startViewTransition(function () {
    update();
  });
};

update();
var dragger;
var hider = document.querySelector('.hider');
hider.removeAttribute('popovertargetaction');
var PROXY = document.createElement('div');
var threshold = function () {
  return window.innerHeight * 0.25;
};

var reset = function () {
  dragger[0].update();
  gsap.set(PROXY, { clearProps: 'y' });
  document.documentElement.dataset.complete = false;
  document.documentElement.style.setProperty('--complete', 0);
  popover.style.setProperty('--ty', 0);
};

var distance;
dragger = Draggable.create(PROXY, {
  type: 'y',
  inertia: true,
  allowContextMenu: true,
  trigger: '.hider',
  onDragStart: function () {
    reset();
    document.documentElement.dataset.dragging = true;
  },
  onPressInit: function () {
    // at this point, track the size of the viewport and drawer
    distance = popover.offsetHeight;
    popover.style.setProperty('--distance', distance);
    reset();
  },
  onDrag: function () {
    document.documentElement.style.setProperty('--complete', this.y / distance);
    popover.style.setProperty('--ty', this.y);
  },
  onRelease: function () {
    document.documentElement.dataset.dragging = false;
  },
  onThrowUpdate: function () {
    document.documentElement.dataset.throwing = true;
  },
  onThrowComplete: function () {
    document.documentElement.dataset.throwing = false;
    if (this.y > threshold() || this.endY > threshold()) {
      popover.hidePopover();
    } else {
      reset();
    }
  },
  onDragEnd: function () {
    // this is your inertia ending here.
    popover.style.setProperty('--ty', this.endY);
    document.documentElement.style.setProperty(
      '--complete',
      this.endY / distance
    );

    var transitions = popover.getAnimations();
    console.info({ transitions });
    if (this.endY / distance) document.documentElement.dataset.complete = true;
    var transition = transitions[0];
    var end = function () {
      document.documentElement.dataset.throwing = false;
      if (this.y > threshold() || this.endY > threshold()) {
        popover.hidePopover();
      } else {
        reset();
      }
    }.bind(this);
    
    if (transition && this.isThrowing) {
      transition.finished
        .then(function () {
          end();
        })
        .catch(function (err) {
          console.info('wtu');
        });
    } else {
      end();
    }
  },
});

popover.addEventListener('toggle', reset);
