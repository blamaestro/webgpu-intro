export function checkWebGpuSupport() {
  if (!navigator.gpu) {
    alert('Your browser does not support WebGPU.');
    return;
  }
  
  console.info('WebGPU browser support confirmed.');
}
