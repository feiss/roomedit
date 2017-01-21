AFRAME.registerComponent('menu', {
  schema: {
  },
  init: function() {
    this.el.addEventListener('trackpaddown', this.onTrackpadDown.bind(this));
    this.currentToolIdx = 0;
    this.currentTool = null; // reference to current tool component
  },
  
  onTrackpadDown: function(ev) {
      this.currentToolIdx = (this.currentToolIdx + 1) % ROOMEDIT.tools.length;
      this.setTool(ROOMEDIT.tools[this.currentToolIdx]);
  },

  setTool: function (toolname) {
    var pointer = document.getElementById('pointer');
    this.tool.done(false);
    pointer.el.removeAttribute(this.currentTool.name);
    pointer.el.setAttribute(toolname, '');
    this.tool = this.el.getAttribute(toolname);
    this.tool.name = toolname;
  },


});


ROOMEDIT = {
  tools : [],
  registerTool : function(tool) {
    if (this.tools[tool.name] !== undefined) {
      console.warn(tool.name + ' is already registered');
      return;
    }
    this.tools[tool.name] = tool;
    console.info('Tool ' + tool.name + ' registered');
  }
};