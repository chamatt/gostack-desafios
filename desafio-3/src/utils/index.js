/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
export function merge(obj1, obj2) {
  const answer = {};
  for (const key in obj1) {
    if (answer[key] === undefined || answer[key] === null)
      answer[key] = obj1[key];
  }
  for (const key in obj2) {
    if (answer[key] === undefined || answer[key] === null)
      answer[key] = obj2[key];
  }
  return answer;
}
