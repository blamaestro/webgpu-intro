import { checkWebGpuSupport, setCanvasSize } from '@/utils/browser';

import shader from '@/shaders/shaders.wgsl';

async function init() {
  checkWebGpuSupport();
  setCanvasSize();

  document.addEventListener('resize', setCanvasSize);
  
  const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement;
  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    throw new Error('Failed to get a WebGPU adapter.');
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu');
  const textureFormat: GPUTextureFormat = 'bgra8unorm';

  if (!context) {
    throw new Error('Failed to get a WebGPU context.');
  }

  context.configure({
    device,
    format: textureFormat,
    alphaMode: 'opaque',
  });

  const pipeline = device.createRenderPipeline({
    vertex: {
      module: device.createShaderModule({ code: shader }),
      entryPoint: 'vs_main',
    },
    fragment: {
      module: device.createShaderModule({ code: shader }),
      entryPoint: 'fs_main',
      targets: [{ format: textureFormat }],
    },
    primitive: {
      topology: 'triangle-list',
    },
    layout: 'auto',
  });

  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [{
      view: textureView,
      clearValue: { r: 0.5, g: 0.0, b: 0.25, a: 1.0 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });

  renderPass.setPipeline(pipeline);
  renderPass.draw(3, 1, 0, 0);
  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
}

init();
