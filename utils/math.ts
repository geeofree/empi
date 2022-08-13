export const getPercent = (current: number = 0, max: number = 0) => (
  max ? (current / max) * 100 : 0
)

