export function normalizePointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
) {
  if (rect.width === 0 || rect.height === 0) {
    return { x: 0, y: 0 };
  }

  const rawX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const rawY = ((clientY - rect.top) / rect.height) * 2 - 1;

  return {
    x: Math.max(-1, Math.min(1, rawX)),
    y: Math.max(-1, Math.min(1, rawY)),
  };
}