/**
 * timer.js
 * Lógica de cronómetro countdown basada en setInterval.
 * TODO: Animación SVG y callbacks.
 */

export function start(seconds,onTick,onFinish){
  let remaining = seconds;
  onTick?.(remaining);
  const id = setInterval(()=>{
    remaining -= 1;
    onTick?.(remaining);
    if(remaining <= 0){
      clearInterval(id);
      onFinish?.();
    }
  },1000);
  return ()=>clearInterval(id);
} 