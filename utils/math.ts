export const getPercent = (current: number = 0, max: number = 0) => (
  max ? (current / max) * 100 : 0
)

const ONE_MINUTE = 1000 * 60
export const getTimeFromUnixTimestamp = (unixTimestamp: number = 0) => 
  (unixTimestamp / ONE_MINUTE)
    .toFixed(2)
    .replace('.', ':')

