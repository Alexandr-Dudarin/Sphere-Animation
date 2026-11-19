export const MAX_WATER_IMPACTS = 24;
export const IMPACT_LIFETIME = 5.5;
export const RAIN_FALL_SECONDS = 0.62;
export const RAIN_DROP_SCALE = 1.5;
export const CROWN_LIFETIME = 0.88;

export interface WaterImpact { x: number; y: number; time: number; strength: number }
export interface ImpactSchedule { next: number; index: number; impacts: WaterImpact[] }

export function createImpactSchedule(): ImpactSchedule {
  return { next: 0, index: 0, impacts: [] };
}

function random(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function retainImpacts(impacts: WaterImpact[], time: number) {
  return impacts.filter((impact) => time - impact.time <= IMPACT_LIFETIME).slice(-MAX_WATER_IMPACTS);
}

/** A bounded schedule shared by falling streaks and their water impacts. */
export function scheduleImpacts(state: ImpactSchedule, time: number, intensity: number, waterfall = false) {
  const rate = (waterfall ? 3.4 : 3.15) * Math.min(2, Math.max(0.3, intensity));
  // Only a short look-ahead is needed to show a drop before it touches the water.
  for (let count = 0; state.next <= time + RAIN_FALL_SECONDS && count < MAX_WATER_IMPACTS; count++) {
    const index = state.index++;
    const angle = random(index, 1) * Math.PI * 2;
    const radius = Math.sqrt(random(index, 2)) * 1.7;
    state.impacts.push({
      x: waterfall ? (random(index, 3) - 0.5) * 1.7 : Math.cos(angle) * radius,
      y: waterfall ? (random(index, 4) - 0.5) * 0.12 : Math.sin(angle) * radius,
      time: state.next,
      strength: waterfall ? 0.20 + random(index, 5) * 0.10 : 0.55 + random(index, 5) * 0.4,
    });
    state.next += (0.82 + random(index, 6) * 0.36) / rate;
  }
  state.impacts = retainImpacts(state.impacts, time);
  return state.impacts;
}

/** Acceleration ends exactly at the impact timestamp. */
export function rainHeight(time: number, impactTime: number) {
  const progress = (time - impactTime + RAIN_FALL_SECONDS) / RAIN_FALL_SECONDS;
  return progress >= -1e-10 && progress < 1 ? 1.65 * (1 - Math.max(0, progress) ** 2) : null;
}

export function canTraceWave(previous: WaterImpact | undefined, next: WaterImpact) {
  return !previous || (next.time - previous.time >= 0.085 &&
    Math.hypot(next.x - previous.x, next.y - previous.y) >= 0.12);
}
