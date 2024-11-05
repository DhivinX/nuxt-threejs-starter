import Stats from 'stats.js';
import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export const useViewerStore = defineStore('viewer-store', () => {
  const scene = shallowRef<Scene>();
  const camera = shallowRef<PerspectiveCamera>();
  const renderer = shallowRef<WebGLRenderer>();
  const controls = shallowRef<OrbitControls>();
  const stats = shallowRef<Stats>();

  const container = ref<HTMLElement | null>(null);
  render();

  function init() {
    container.value = document.getElementById('viewer');
    if (!container.value) return;

    scene.value = new Scene();
    scene.value.background = new Color("#191919");

    const aspect = window.innerWidth / window.innerHeight;
    camera.value = new PerspectiveCamera(50, aspect, 1, 1000);
    camera.value.position.z = 700;

    renderer.value = new WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true
    });

    renderer.value.setPixelRatio(window.devicePixelRatio);
    renderer.value.setSize(window.innerWidth, window.innerHeight);
    renderer.value.render(scene.value, camera.value);

    container.value.appendChild(renderer.value.domElement);
    window.addEventListener("resize", () => onResize());

    stats.value = new Stats();
    container.value.appendChild(stats.value.dom);

    controls.value = new OrbitControls(camera.value, renderer.value.domElement);
    controls.value.update();
  }

  async function render() {
    if (stats.value && renderer.value && scene.value && camera.value) {
      stats.value.begin();
      renderer.value.render(scene.value, camera.value);
      stats.value.end();
    }

    requestAnimationFrame(render);
  }

  function onResize() {
    if (camera.value instanceof PerspectiveCamera) {
      camera.value.aspect = window.innerWidth / window.innerHeight;
      camera.value.updateProjectionMatrix();
    }
    
    renderer.value?.setSize(window.innerWidth, window.innerHeight);
  }

  function destroy() {
    window.removeEventListener("resize", () => onResize());

    scene.value?.clear();
    camera.value?.clear();
    renderer.value?.clear();
    
    if (renderer.value) container.value?.removeChild(renderer.value.domElement);
    if (stats.value) container.value?.removeChild(stats.value.dom);

    scene.value = undefined;
    camera.value = undefined;
    renderer.value = undefined;
  }

  return {
    init,
    destroy,
    scene,
    camera,
    renderer,
    controls,
    stats
  }
});