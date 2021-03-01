/* eslint-disable */
export const requestAnimationFramePolyfill =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  function (callback: any) {
    return window.setTimeout(callback, 1000 / 60);
  };

export const cancelAnimationFramePolyfill =
  window.cancelAnimationFrame || window.webkitCancelAnimationFrame || clearTimeout;
