import { TIMEOUT_SEC } from './config.js';
import { HttpError } from './errors.js';

/**
 * Sends a GET or POST request (POST when `uploadData` is provided) and
 * races it against a timeout so a hung request can't stall the UI forever.
 * @param {string} url
 * @param {Object} [uploadData] - JSON body to POST; omit for a GET request
 * @returns {Promise<Object>} parsed JSON response
 */
export const AJAX = async function (url, uploadData = undefined) {
  const fetchReq = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);

  const res = await Promise.race([fetchReq, timeout(TIMEOUT_SEC)]);

  // read the body regardless of status.
  // If it's not valid JSON, fall back gracefully instead of throwing a confusing parse error.
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) throw new HttpError(data?.message || res.statusText, res.status);

  return data;
};

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${sec} second`));
    }, sec * 1000);
  });
};

/**
 * Tag function for template literals. It's a pure runtime no-op (just
 * reassembles the string) — its only purpose is letting Prettier and the
 * es6-string-html extension recognize and format the contents as HTML.
 */
export const html = (strings, ...values) =>
  strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
