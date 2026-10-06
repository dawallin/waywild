import { BOUNDARY_WALL_THICKNESS, type World } from '../core/world';

export function mountMap(canvas: HTMLCanvasElement, world: World): { draw: () => void; dispose: () => void } {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is unavailable');
  const draw = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = '#182922'; context.fillRect(0, 0, width, height);
    const size = Math.min(width, height) * .82;
    const rows = world.cells.length, columns = world.cells[0].length;
    const unit = size / Math.max(rows, columns);
    const mapWidth = columns * unit, mapHeight = rows * unit;
    const left = (width - mapWidth) / 2, top = (height - mapHeight) / 2;
    world.cells.forEach((row, z) => [...row].forEach((cell, x) => {
      context.fillStyle = cell === 'x' ? '#64746c' : '#b5c999';
      context.fillRect(left + x * unit, top + z * unit, unit, unit);
      context.strokeStyle = '#182922'; context.lineWidth = 2;
      context.strokeRect(left + x * unit, top + z * unit, unit, unit);
      context.fillStyle = cell === 'x' ? '#e3ece5' : '#324632';
      context.font = `${Math.max(12, unit * .18)}px system-ui`;
      context.textAlign = 'center'; context.textBaseline = 'middle';
      context.fillText(cell, left + (x + .5) * unit, top + (z + .5) * unit);
    }));
    const inset = BOUNDARY_WALL_THICKNESS / 2 / world.cellSize * unit;
    context.strokeStyle = '#e3ece5'; context.lineWidth = 2;
    context.strokeRect(left + inset, top + inset, mapWidth - 2 * inset, mapHeight - 2 * inset);
    context.save();
    context.translate(left + world.player.x / world.cellSize * unit, top + world.player.z / world.cellSize * unit);
    context.rotate(world.player.heading);
    context.fillStyle = '#ffe8a0'; context.strokeStyle = '#182922'; context.lineWidth = 2;
    const marker = Math.max(5, unit * .17);
    context.beginPath(); context.moveTo(0, -marker); context.lineTo(marker * .6, marker * .6); context.lineTo(-marker * .6, marker * .6); context.closePath(); context.fill(); context.stroke();
    context.restore();
    canvas.dataset.seed = String(world.seed);
    canvas.dataset.cells = JSON.stringify(world.cells);
    canvas.dataset.player = JSON.stringify(world.player);
  };
  const observer = new ResizeObserver(draw); observer.observe(canvas); draw();
  return { draw, dispose: () => observer.disconnect() };
}
