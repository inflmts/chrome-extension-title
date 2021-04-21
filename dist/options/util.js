export function parseTitleMap(map) {
  if (typeof map !== 'string') return {};
  try { map = JSON.parse(map); }
  catch (err) { return (console.warn(`Invalid 'titleMap' value: ${err.message}`), {}); }
  return typeof map === 'object' && map !== null ? map
    : (console.warn(`Invalid 'titleMap' value: Parsed JSON is not an object.`), {});
}
