export function checkWebGpuSupport() {
  if (!navigator.gpu) {
    throw new Error('Your browser does not support WebGPU.');
  }
  
  console.info('WebGPU browser support confirmed.');
}

export function setCanvasSize() {
  const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
