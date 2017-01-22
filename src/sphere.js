
AFRAME.registerComponent('sphere', {
  schema: {
  },
  
  init: function () {
    this.model = null;
  },
  
  done: function (commit) {
    if (commit===undefined) commit = true;
    if (!commit) {
      this.model.parentNode.removeChild(this.model);
    }
    this.model = null;
  },

  play: function (ev) {
    this.el.addEventListener('triggerdown', this.onTriggerDown.bind(this));
  },
  
  pause: function(ev) {
    this.el.removeEventListener('triggerdown', this.onTriggerDown.bind(this));
  },
  
  tick: function (time, delta) {
    if (!this.model) { return; }
    var pos = this.el.getAttribute('position');
    var startpos = this.model.getAttribute('position');
    var v1 = new THREE.Vector3(startpos.x, startpos.y, startpos.z);
    var v2 = new THREE.Vector3(pos.x, pos.y, pos.z);
    var dist = v2.distanceTo(v2);
    this.model.scale.set(dist, dist, dist);
  },
  
  onTriggerDown: function(ev) {
    if (this.model) {
      this.done();
      return;
    }

    var mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), this.material);
    this.model = document.createElement('a-entity');
    this.model.className = 'roomItem';
    this.model.setAttribute('position', this.el.getAttribute('position'));
    this.model.setObject3D('mesh', mesh);
    this.el.sceneEl.appendChild(this.model);
  },
  
});

ROOMEDIT.registerTool({name:'sphere'});
