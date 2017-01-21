AFRAME.registerComponent('controls', {
  dependencies: ['tracked-controls'],
  schema: {
    hand: { default: 'right' }
  },

  init: function () {
    var self = this;

    this.onButtonChanged = this.onButtonChanged.bind(this);
    this.onButtonDown = function (evt) { self.onButtonEvent(evt.detail.id, 'down'); };
    this.onButtonUp = function (evt) { self.onButtonEvent(evt.detail.id, 'up'); };
    this.onAxisMove = this.onAxisMove.bind(this);
  },

  play: function () {
    var el = this.el;
    el.addEventListener('buttonchanged', this.onButtonChanged);
    el.addEventListener('buttondown', this.onButtonDown);
    el.addEventListener('buttonup', this.onButtonUp);
    el.addEventListener('axismove', this.onAxisMove);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('buttonchanged', this.onButtonChanged);
    el.removeEventListener('buttondown', this.onButtonDown);
    el.removeEventListener('buttonup', this.onButtonUp);
    el.removeEventListener('axismove', this.onAxisMove);
  },

  mapping: {
    axis0: 'trackpad',
    axis1: 'trackpad',
    button0: 'trackpad',
    button1: 'trigger',
    button2: 'grip',
    button3: 'menu',
    button4: 'system'
  },

  onButtonChanged: function (evt) {
    var buttonName = this.mapping['button' + evt.detail.id];
    console.log(buttonName, evt.detail.state.value); 
    console.log(this.el.getAttribute('position')); 
  },

  onAxisMove: function(evt) {
    console.log('trackpad', evt.detail.state.value); 
  },

  update: function () {
    var controller = this.data.hand === 'right' ? 0 : 1;
    this.el.setAttribute('tracked-controls', 'controller', controller);
  }
});
