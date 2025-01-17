export function drawWaveform(canvas: HTMLCanvasElement, data: number[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const step = Math.ceil(data.length / width);
  
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  
  for (let i = 0; i < width; i++) {
    const sliceStart = Math.floor(i * step);
    const sliceEnd = Math.floor((i + 1) * step);
    const slice = data.slice(sliceStart, sliceEnd);
    const average = slice.reduce((a, b) => a + Math.abs(b), 0) / slice.length;
    
    const y = (average * height / 2) + (height / 2);
    ctx.lineTo(i, y);
  }
  
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.stroke();
}