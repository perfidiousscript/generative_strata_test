import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  PlaneGeometry,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight,
  TextureLoader,
  Texture,
  RepeatWrapping,
  NearestFilter,
  DoubleSide,
  AxesHelper,
  WireframeGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

function displayObj() {
  const canvas = document.querySelector("#c");
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new Scene();
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(0, 5, 10);
    scene.add(light);
  }

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set = (0, 20, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 3, 0);
  controls.update();

  // Checker Plane
  {
    const planeSize = 40;
    const loader = new TextureLoader();
    const texture = loader.load(
      "http://localhost:8080/resources/images/checker.png"
    );
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.magFilter = NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new PlaneGeometry(planeSize, planeSize);
    const planeMat = new MeshPhongMaterial({
      map: texture,
      side: DoubleSide,
    });

    const mesh = new Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  // Makes Cubes
  const geometry = new BoxGeometry(1, 1, 1);

  function makeInstance(geometry, color, xPos) {
    const material = new MeshPhongMaterial({ color });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = xPos;
    cube.position.y = 3;

    return cube;
  }

  const cubeAttributeArray = [[0xaa8844, 5]];

  const cubes = cubeAttributeArray.map((cube) =>
    makeInstance(geometry, cube[0], cube[1])
  );

  {
    var material = new MeshPhongMaterial({
      color: "white",
      side: DoubleSide,
    });
    const objLoader = new OBJLoader();
    objLoader.load("http://localhost:8080/objects/GS_Obj_Test.obj", function (
      obj
    ) {
      obj.traverse(
        function (child) {
          if (child instanceof Mesh) {
            child.material = material;
          }
          scene.add(obj);
          obj.scale.multiplyScalar(0.03);
          obj.position.set(-30, 2, 0);
          scene.add(obj);
          renderer.render(scene, camera);
          requestAnimationFrame(render);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.log("An error happened", error);
        }
      );
    });
  }

  function render(time) {
    time *= 0.001;

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

displayObj();
