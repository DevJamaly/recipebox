/**
 * Thrown by AJAX for any non-2xx HTTP response. Carries the real status
 * code as data instead of encoding it into the message string.
 */
export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

/**
 * Turns any caught error into one user-friendly sentence.
 * @param {Error} error
 * @param {string} entity - what we were trying to load/save, e.g. 'recipe'
 */
export const describeError = function (error, entity = 'data') {
  if (error instanceof HttpError) {
    if (error.status === 400)
      return `Invalid request. Please check the ${entity} details.`;
    if (error.status === 404) return `Could not find that ${entity}.`;
    return `Server error (${error.status}). Please try again.`;
  }

  // Network failures (offline, CORS) come through as a plain TypeError.
  if (error.message === 'Failed to fetch')
    return 'Network error. Please check your connection.';

  // Anything else (timeout, JSON parse, etc.) already has a useful message.
  return error.message || 'Something went wrong. Please try again.';
};
