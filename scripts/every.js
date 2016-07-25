'use strict';

module.exports = function every(obj, value) {
  let ok = true;
  for (let k in obj) {
    ok = ok && obj[k] === value;
  }
  return ok;
}