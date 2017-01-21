
AFRAME.registerComponent('sphere', {
  schema: {},
  init: function () {

  },
  play: function (ev) {
    this.el.addEventListener('triggerdown', this.onTriggerDown.bind(this));
    this.el.addEventListener('gripdown', this.onGripDown.bind(this));
  },
  pause: function(ev) {
    this.el.removeEventListener('triggerdown', this.onTriggerDown.bind(this));
    this.el.removeEventListener('gripdown', this.onGripDown.bind(this));
  },
  tick: function (time, delta) {

  },
  onTriggerDown: function(ev) {
    console.log('trigger');
  },
  onGripDown: function(ev) {
    console.log('grip');
  }
});

ROOMEDIT.registerTool({name:'sphere'});