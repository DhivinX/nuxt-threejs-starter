<template>
  <div>
    <button v-if="!mesh" @click="addCube">Add cube</button>
    <button v-else @click="removeCube">Remove cube</button>
    <div id="viewer"></div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;

  overflow: hidden;
}

button {
  padding: 10px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>

<script setup lang="ts">
import { BoxGeometry, Mesh, MeshNormalMaterial } from 'three';

const viewerStore = useViewerStore();
const mesh = shallowRef<Mesh>();

onMounted(() => {
  viewerStore.init();
  addCube();
});

onUnmounted(() => {
  viewerStore.destroy();
});

function addCube() {
  if (!viewerStore.scene) return;

  const geometry = new BoxGeometry(200, 200, 200);
  const material = new MeshNormalMaterial();
  mesh.value = new Mesh(geometry, material);

  viewerStore.scene.add(mesh.value);
}

function removeCube() {
  if (!viewerStore.scene || !mesh.value) return;
  viewerStore.scene.remove(mesh.value);
  mesh.value = undefined;
}
</script>
