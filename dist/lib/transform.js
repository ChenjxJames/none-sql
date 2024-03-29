"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCamelCase = function (str) {
    return str.replace(/\_(\w)/g, function (all, letter) { return letter.toUpperCase(); });
};
exports.toMapUnderscore = function (str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
};
