// This module provides utilities that can be run from any context.

// Returns the key for the provided URL, or null if the URL is unusable.
export function getKey(url) {
  try { url = new URL(url); }
  catch (err) { return null; }
  switch (url.protocol) {
    case 'http:':
    case 'https:':
    case 'file:':
    case 'ftp:':
    case 'urn:':
      return url.origin + url.pathname;
    default:
      return null;
  }
}

// Is `x` a string?
export function isString(x) {
  return typeof x === 'string';
}
