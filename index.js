"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var DB = /** @class */ (function () {
    function DB(database, user, password, host) {
        if (host === void 0) { host = 'localhost'; }
        this.connection = mysql_1.default.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
        this.connection.connect();
        this.tableName = '';
        this.sqlStrWhere = '';
        this.sqlStrOrderBy = '';
    }
    DB.prototype.connect = function (tableName) {
        this.sqlStrWhere = '';
        this.sqlStrOrderBy = '';
        this.tableName = tableName;
        return this;
    };
    DB.prototype.where = function (obj) {
        this.sqlStrWhere = ' WHERE (';
        if (Object.keys(obj).length) {
            for (var key in obj) {
                this.sqlStrWhere += key + '=? and ';
            }
            this.sqlStrWhere = this.sqlStrWhere.slice(0, -4);
            this.sqlStrWhere += ')';
            this.sqlStrWhere = mysql_1.default.format(this.sqlStrWhere, Object.values(obj).slice());
        }
        return this;
    };
    DB.prototype.orWhere = function (obj) {
        if (Object.keys(obj).length && this.sqlStrWhere) {
            this.sqlStrWhere += ' OR (';
            for (var key in obj) {
                this.sqlStrWhere += key + '=? and ';
            }
            this.sqlStrWhere = this.sqlStrWhere.slice(0, -4);
            this.sqlStrWhere += ')';
            this.sqlStrWhere = mysql_1.default.format(this.sqlStrWhere, Object.values(obj).slice());
        }
        return this;
    };
    DB.prototype.orderBy = function (obj) {
        if (Object.keys(obj).length) {
            this.sqlStrOrderBy = ' ORDER BY ';
            for (var key in obj) {
                this.sqlStrOrderBy += ' ' + key + ' ' + (obj[key] ? 'ASC' : 'DESC') + ', ';
            }
            this.sqlStrOrderBy = this.sqlStrOrderBy.slice(0, -2);
        }
        return this;
    };
    DB.prototype.transaction = function (func) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.connection.beginTransaction(function (transactionErr) {
                            if (transactionErr) {
                                reject({ flag: true, message: 'The transaction is failed.', info: transactionErr });
                            }
                            else {
                                try {
                                    func;
                                    _this.connection.commit();
                                    resolve({ flag: true, message: 'Transaction committed.' });
                                }
                                catch (err) {
                                    _this.connection.rollback(function () {
                                        reject({ flag: true, message: 'The transaction is failed.', info: err });
                                    });
                                }
                            }
                        });
                    })];
            });
        });
    };
    DB.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var sql = "SELECT * FROM ?? " + _this.sqlStrWhere + _this.sqlStrOrderBy;
                        _this.connection.query(sql, [_this.tableName], function (err, rows, fields) {
                            if (err) {
                                reject({ flag: true, message: 'The query is failed.', info: err });
                            }
                            else {
                                var data_1 = [];
                                rows.forEach(function (row) {
                                    var item = __rest(row, []);
                                    data_1.push(item);
                                });
                                resolve({ flag: true, message: 'The query is successful.', info: data_1 });
                            }
                        });
                    })];
            });
        });
    };
    DB.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var sql = "DELETE FROM ?? " + _this.sqlStrWhere;
                        _this.connection.query(sql, [_this.tableName], function (err, rows, fields) {
                            if (err) {
                                reject({ flag: true, message: 'Delete is failed.', info: err });
                            }
                            else {
                                resolve({ flag: true, message: 'Delete is successful.' });
                            }
                        });
                    })];
            });
        });
    };
    DB.prototype.update = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var sql = "UPDATE ?? SET ?" + _this.sqlStrWhere;
                        _this.connection.query(sql, [_this.tableName, obj], function (err, rows, fields) {
                            if (err) {
                                reject({ flag: true, message: 'Update is failed.', info: err });
                            }
                            else {
                                resolve({ flag: true, message: 'Update is successful.' });
                            }
                        });
                    })];
            });
        });
    };
    DB.prototype.add = function (rows) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, rowValues, sql, _i, rows_1, row;
            var _this = this;
            return __generator(this, function (_a) {
                keys = Object.keys(rows[0]);
                rowValues = [];
                sql = "INSERT INTO ?? (??) VALUES ";
                for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                    row = rows_1[_i];
                    sql += '(?),';
                    rowValues.push(Object.values(row));
                }
                sql = sql.slice(0, -1);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.connection.query(sql, [_this.tableName, keys].concat(rowValues), function (err, results, fields) {
                            if (err) {
                                reject({ flag: true, message: 'Add data is failed.', info: err });
                            }
                            else {
                                resolve({ flag: true, message: 'Add data is successful', info: results });
                            }
                        });
                    })];
            });
        });
    };
    DB.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.connection.end(function (err) {
                            if (err) {
                                reject({ flag: true, message: 'connection close failed.', info: err });
                            }
                            else {
                                resolve({ flag: true, message: 'connection closed.' });
                            }
                        });
                    })];
            });
        });
    };
    return DB;
}());
exports.DB = DB;
