// This module provides utilities that can be run from any context.

// Trim the hash from a URL.
export function getKey(url) {
  return url.split('#')[0];
}
