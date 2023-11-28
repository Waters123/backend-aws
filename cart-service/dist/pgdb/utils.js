"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objKeysToCamelCase = void 0;
const toCamelCase = (value) => value.split('_')
    .map((word, idx) => (idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
const objKeysToCamelCase = (obj, keys = []) => Object.fromEntries(Object.entries(obj).map(([key, value]) => [
    keys.length && !keys.includes(key) ? key : toCamelCase(key),
    value
]));
exports.objKeysToCamelCase = objKeysToCamelCase;
//# sourceMappingURL=utils.js.map