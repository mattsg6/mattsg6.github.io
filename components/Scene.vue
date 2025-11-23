<template>
  <canvas id="c"></canvas>
</template>
<script setup>
import * as THREE from "three";

onMounted(() => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(0xffffff, 1);
  renderer.setPixelRatio(window.devicePixelRatio);

  let width = window.innerWidth;
  let height = window.innerHeight;

  const groundLevel = 250;

  const camera = new THREE.OrthographicCamera(0, width, height, 0, -10, 10);
  camera.position.z = 1;

  const scene = new THREE.Scene();

  // Sun
  const geometry = new THREE.TorusGeometry(50, 1, 16, 100); // radius, thickness
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const sun = new THREE.Mesh(geometry, material);
  sun.position.set(200, window.innerHeight - 150, 0);
  scene.add(sun);

  // Ground
  const groundPoints = [];
  groundPoints.push(new THREE.Vector3(0, groundLevel, 0));
  groundPoints.push(new THREE.Vector3(width, groundLevel, 0));
  const groundGeometry = new THREE.BufferGeometry().setFromPoints(groundPoints);
  const groundLine = new THREE.Line(groundGeometry, material)
  scene.add(groundLine);

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    renderer.setSize(width, height);

    camera.left = 0;
    camera.right = width;
    camera.top = height;
    camera.bottom = 0;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", onWindowResize, false);

  renderer.setSize(width, height);
  renderer.render(scene, camera);
});
</script>
<style scoped>
#c {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
