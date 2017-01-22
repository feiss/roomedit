AFRAME.registerComponent('menu', {
  schema: {},
  init: function() {
    this.el.addEventListener('trackpaddown', this.onTrackpadDown.bind(this));
    this.currentToolIdx = undefined;
    this.defaultMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: 0x666666});
    var self = this;
    this.el.sceneEl.addEventListener('loaded', function (ev) {
      self.setTool(ROOMEDIT.defaultTool);
    });
  },
  
  getTool: function () {
    var tool = ROOMEDIT.tools[this.currentToolIdx];
    return document.getElementById('pointer').components[tool.name];
  },

  onTrackpadDown: function (ev) {
      var newToolIdx= (this.currentToolIdx + 1) % ROOMEDIT.tools.length;
      this.setTool(newToolIdx);
  },

  onGripDown: function (ev) {
    if (this.currentToolIdx === undefined) { return; }
    var tool = this.getTool();
    if (tool && tool['done']) {
      tool.done(false);
    }
  },

  setTool: function (idx) {
    var pointer = document.getElementById('pointer');
    if (this.currentToolIdx !== undefined) {
      var oldTool = ROOMEDIT.tools[this.currentToolIdx];
      var oldComponent = pointer.components[oldTool.name];
      if (oldComponent && oldComponent['done']) {
        oldComponent.done(false);
      }
      pointer.removeAttribute(oldTool.name);
    }
    var newTool = ROOMEDIT.tools[idx];
    pointer.setAttribute(newTool.name, newTool.params || '');
    pointer.components[newTool.name].material = this.defaultMaterial;
    this.currentToolIdx = idx;
  },


});


ROOMEDIT = {
  tools: [],
  defaultTool: 0,
  registerTool: function(tool) {
    this.tools.push(tool);
    console.info('Tool ' + tool.name + ' registered');
  }
};
