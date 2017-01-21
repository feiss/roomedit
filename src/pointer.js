AFRAME.registerComponent('pointer', {
  schema: {
  },
  init: function () {
    this.el.addEventListener('triggerdown', this.onTriggerDown.bind(this));
    this.el.addEventListener('gripdown', this.onGripDown.bind(this));

    this.points = [];
    this.helpers = [];
    this.model = null;
    this.plane = null;
  },

  setTool: function (toolname) {
    this.tool.done(false);
    this.el.removeAttribute(this.tool.name);
    this.el.setAttribute(toolname, '');
    this.tool = this.el.getAttribute(toolname);
    this.tool.name = toolname;
  },

  onTriggerDown: function (ev) {

    this.emit('onTriggerDown');
    return;
    
    var pos = this.el.getAttribute('position');

    if (this.points.length == 8){
      this.done();
      return;
    }

    if (this.points.length == 4) {
      this.plane = new THREE.Plane();
      this.plane.setFromCoplanarPoints(
        new THREE.Vector3(this.points[0].x, this.points[0].y, this.points[0].z),
        new THREE.Vector3(this.points[1].x, this.points[1].y, this.points[1].z),
        new THREE.Vector3(this.points[2].x, this.points[2].y, this.points[2].z)
        );

      this.points.push({x: pos.x, y: pos.y, z: pos.z});
      this.points.push({x: pos.x, y: pos.y, z: pos.z});
      this.points.push({x: pos.x, y: pos.y, z: pos.z});
    }

    this.points.push({x: pos.x, y: pos.y, z: pos.z});
    this.addHelper(pos);

    if (this.points.length == 2) {
      this.points.push({x: pos.x, y: pos.y, z: pos.z});
      this.points.push({x: pos.x, y: pos.y, z: pos.z});
    }
    
    if (this.points.length > 1) {
      this.updateModel();
    }
  },

  done: function (commit) {
    if (commit===undefined) commit = true;
    this.model.points = this.points; // transfer points to entity
    this.points = [];
    for (var i in this.helpers) {
      this.helpers[i].parentNode.removeChild(this.helpers[i]);
    }
    this.helpers = [];
    if (!commit) this.model.parentNode.removeChild(this.model);
    this.model = null;
  },

  onGripDown: function(ev) {
    this.done(false);
  },

  addHelper: function(pos) {
    var helper = document.createElement('a-sphere');
    helper.setAttribute('color', '#888');
    helper.setAttribute('radius', 0.002);
    helper.setAttribute('position', pos);
    this.el.sceneEl.appendChild(helper);
    this.helpers.push(helper);
  },

  updateModel: function() {
    console.log('puntos', this.points.length);
    if (this.model !== null) {
      this.model.parentNode.removeChild(this.model);
    }
    var npoints = this.points.length;
    var geometry = new THREE.Geometry();
    for (var i = 0; i < npoints; i++) {
      geometry.vertices.push(new THREE.Vector3(this.points[i].x, this.points[i].y, this.points[i].z));
    }
    if (npoints > 2) {
      geometry.faces.push(new THREE.Face3(0, 1, 2));
      geometry.faces.push(new THREE.Face3(2, 3, 0));

      if (npoints > 4) {
        geometry.faces.push(new THREE.Face3(4, 5, 6));
        geometry.faces.push(new THREE.Face3(6, 7, 4));
        geometry.faces.push(new THREE.Face3(0, 5, 1));
        geometry.faces.push(new THREE.Face3(0, 4, 5));
        geometry.faces.push(new THREE.Face3(3, 2, 7));
        geometry.faces.push(new THREE.Face3(2, 6, 7));
        geometry.faces.push(new THREE.Face3(0, 3, 4));
        geometry.faces.push(new THREE.Face3(3, 7, 4));
        geometry.faces.push(new THREE.Face3(2, 1, 6));
        geometry.faces.push(new THREE.Face3(1, 5, 6));
      } 
    }
      
    geometry.computeFaceNormals();
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:0x555555, side: THREE.DoubleSide}));
    this.model = document.createElement('a-entity');
    this.model.className = 'roomItem';
    this.model.setObject3D('mesh', mesh);
    this.el.sceneEl.appendChild(this.model);
  },

  tick: function (time, timeDelta) {
    if (!this.model) return;
    if (this.points.length > 2) {
      var pos = this.el.getAttribute('position');
      var geometry = this.model.getObject3D('mesh').geometry;
      var v, gv;
      if (this.points.length == 4) {
        v = this.points[2];
        gv = geometry.vertices[2];
        gv.x = v.x = pos.x;
        gv.y = v.y = pos.y;
        gv.z = v.z = pos.z;
        this.update4thVertex();
        var v = this.points[3];
        var gv = geometry.vertices[3];
        gv.x = v.x;
        gv.y = v.y;
        gv.z = v.z;
      }
      if (this.points.length > 4) {
        var dist = this.plane.distanceToPoint(new THREE.Vector3(pos.x, pos.y, pos.z));
        for (var i = 4; i < 8; i++) {
          gv = geometry.vertices[i];
          v = this.points[i];
          gv.x = v.x = this.points[i - 4].x + this.plane.normal.x * dist;
          gv.y = v.y = this.points[i - 4].y + this.plane.normal.y * dist;
          gv.z = v.z = this.points[i - 4].z + this.plane.normal.z * dist;
        }
      }
      geometry.computeFaceNormals();
      geometry.verticesNeedUpdate = true;
    }
  },

  update4thVertex: function (){
    this.points[3].x = this.points[0].x + this.points[2].x - this.points[1].x;
    this.points[3].y = this.points[0].y + this.points[2].y - this.points[1].y;
    this.points[3].z = this.points[0].z + this.points[2].z - this.points[1].z;
  }
});