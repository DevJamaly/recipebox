import { TIMEOUT_SEC } from './config';

export const getJson = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    if (!res.ok) throw new Error(`${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${sec} second`));
    }, sec * 1000);
  });
};
