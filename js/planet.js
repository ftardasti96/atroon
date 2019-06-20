var planetsAnimation = [];
var planetStatus = false;

document.enablePlanet = function () {
  planetStatus = true;
  for (let i = 0; i < planetsAnimation.length; i++) {
    planetsAnimation[i]();
  }
}

document.disablePlanet = function () {
  planetStatus = false;
}

$(document).ready(function () {
  var debug = false;
  var views = [];
  var cameraPosition = 1330;
  if (WEBGL.isWebGLAvailable() === true) {
    var loader = new THREE.TextureLoader();
    planetsAnimation.push(init("#view1", "img/MARS texture.jpg", { x: 0, y: 0, z: 0 }, 0xffffff));
    planetsAnimation.push(init("#view2", "img/RUBY texture.jpg", { x: 0, y: 0, z: 0 }, 0xfca22b));
    planetsAnimation.push(init("#view3", "img/VENUS texture.jpg", { x: 0, y: 0, z: 0 }, 0xffffff));
  }

  window.addEventListener("resize", onWindowResize, false);


  function createMesh(textureName, position, mouseoutEvent, mouseoverEvent) {
    return new Promise(function (resolve, reject) {
      loader.load(textureName, function (texture) {
        var geometry = new THREE.SphereBufferGeometry(450, 100, 100);
        var material = new THREE.MeshPhongMaterial({
          map: texture,
          shininess: 8
        });

        var mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.position.set(position.x, position.y, position.z);

        mesh.on("mouseout", mouseoutEvent);
        mesh.on("mouseover", mouseoverEvent);

        resolve(mesh);
      });
    });
  }
  function init(id, textureName, position, color) {
    var width = $(id).width(),
      height = $(id).height();

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    $(id).append(renderer.domElement);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2; // approximate sRGB

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(40, width / height, 1, 4000);
    camera.position.set(0, 0, cameraPosition);

    var render = function () {
      renderer.render(scene, camera);
    };

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", render);
    controls.minDistance = cameraPosition;
    controls.maxDistance = cameraPosition;
    controls.enablePan = false;
    controls.autoRotateSpeed = 5;

    var interaction = new THREE.Interaction(renderer, scene, camera);

    createMesh(
      textureName,
      position,
      function (ev) {
        controls.autoRotate = false;
      },
      function (ev) {
        controls.autoRotate = true;
      }
    ).then(function (mesh) {
      scene.add(mesh);
      render();
    });

    if (debug) {
      // The X axis is red. The Y axis is green. The Z axis is blue.
      scene.add(new THREE.AxesHelper(2000));
    }

    var ambient = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambient);

    var frontLight, rearLight;
    frontLight = new THREE.SpotLight(color, 50);
    frontLight.position.set(520, 520, -cameraPosition + -150);
    frontLight.angle = Math.PI;
    frontLight.penumbra = 1;
    frontLight.decay = 1;
    frontLight.distance = 1600;
    frontLight.castShadow = true;
    frontLight.shadow.mapSize.width = 1024;
    frontLight.shadow.mapSize.height = 1024;
    frontLight.shadow.camera.near = 10;
    frontLight.shadow.camera.far = 200;
    camera.add(frontLight);

    rearLight = new THREE.SpotLight(0xffffff, 1);
    rearLight.position.set(1500, 1500, -cameraPosition);
    rearLight.angle = Math.PI;
    rearLight.penumbra = 10;
    rearLight.decay = 0.1;
    rearLight.distance = 2000;

    //   rearLight.castShadow = true;
    rearLight.shadow.mapSize.width = 1024;
    rearLight.shadow.mapSize.height = 1024;
    rearLight.shadow.camera.near = 1000;
    rearLight.shadow.camera.far = 2000;
    // camera.add(rearLight);

    var light = new THREE.DirectionalLight(0xffffff, 4.5);
    light.position.x = 500;
    light.position.y = 500;
    light.position.z = -cameraPosition + 100;
    camera.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.x = -800;
    light.position.y = -800;
    light.position.z = -cameraPosition + 500;
    camera.add(light);

    var view = {
      id: id,
      width: width,
      height: height,
      renderer: renderer,
      camera: camera,
      scene: scene,
      render: render
    };

    scene.add(camera);

    views.push(view);
    render();

    var animate = function () {
      controls.update();
      render();
      if (planetStatus)
        requestAnimationFrame(animate);
    };
    return animate;
  }

  function onWindowResize() {
    for (let i = 0; i < views.length; i++) {
      views[i].camera.aspect = views[i].width / views[i].height;
      views[i].camera.updateProjectionMatrix();
      views[i].renderer.setSize(views[i].width, views[i].height);
      views[i].render();
    }
  }
});
