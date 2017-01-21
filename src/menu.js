AFRAME.registerComponent('menu', {
  schema: {
  },
  init: function() {
    this.el.addEventListener('trackpaddown', this.onTrackpadDown.bind(this));
    this.currentTool = null;
    this.tools = ['extruder', 'sphere'];
  },
  
  onTrackpadDown: function(ev) {
      console.log(ev);
      this.currentTool = (this.currentTool + 1) % this.tools.length;
      document.getElementById('pointer').getAttribute('pointer').setTool(this.tools[this.currentTool]);
  }

});