"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.DB = exports.Connection = void 0;
var mysql_1 = __importDefault(require("mysql"));
var transform_1 = require("./lib/transform");
var configDefault = {
    mapUnderscoreToCamelCase: false,
};
var Connection = (function () {
    function Connection(connection, config) {
        this.connection = connection;
        this.tableName = '';
        this.sqlStrWhere = '';
        this.sqlStrOrderBy = '';
        this.config = config || configDefault;
    }
    Connection.toCamelCase = function (obj) {
        var camelCaseObj = {};
        Object.keys(obj).forEach(function (key) {
            camelCaseObj[transform_1.toCamelCase(key)] = obj[key];
        });
        return camelCaseObj;
    };
    Connection.toMapUnderscore = function (obj) {
        var mapUnderscoreObj = {};
        Object.keys(obj).forEach(function (key) {
            mapUnderscoreObj[transform_1.toMapUnderscore(key)] = obj[key];
        });
        return mapUnderscoreObj;
    };
    Connection.prototype.connect = function (tableName) {
        this.sqlStrWhere = '';
        this.sqlStrOrderBy = '';
        this.tableName = tableName;
        return this;
    };
    Connection.prototype.where = function (obj) {
        this.sqlStrWhere = ' WHERE (';
        if (Object.keys(obj).length) {
            for (var key in obj) {
                key = this.config.mapUnderscoreToCamelCase ? transform_1.toMapUnderscore(key) : key;
                this.sqlStrWhere += key + '=? and ';
            }
            this.sqlStrWhere = this.sqlStrWhere.slice(0, -4);
            this.sqlStrWhere += ')';
            this.sqlStrWhere = mysql_1.default.format(this.sqlStrWhere, __spreadArrays(Object.values(obj)));
        }
        return this;
    };
    Connection.prototype.orWhere = function (obj) {
        if (Object.keys(obj).length && this.sqlStrWhere) {
            this.sqlStrWhere += ' OR (';
            for (var key in obj) {
                key = this.config.mapUnderscoreToCamelCase ? transform_1.toMapUnderscore(key) : key;
                this.sqlStrWhere += key + '=? and ';
            }
            this.sqlStrWhere = this.sqlStrWhere.slice(0, -4);
            this.sqlStrWhere += ')';
            this.sqlStrWhere = mysql_1.default.format(this.sqlStrWhere, __spreadArrays(Object.values(obj)));
        }
        return this;
    };
    Connection.prototype.orderBy = function (obj) {
        if (Object.keys(obj).length) {
            this.sqlStrOrderBy = ' ORDER BY ';
            for (var key in obj) {
                var orderKey = this.config.mapUnderscoreToCamelCase ? transform_1.toMapUnderscore(key) : key;
                this.sqlStrOrderBy += ' ' + orderKey + ' ' + (obj[key] ? 'ASC' : 'DESC') + ', ';
            }
            this.sqlStrOrderBy = this.sqlStrOrderBy.slice(0, -2);
        }
        return this;
    };
    Connection.prototype.transaction = function (func) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.connection.beginTransaction(function (transactionErr) { return __awaiter(_this, void 0, void 0, function () {
                            var err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (transactionErr) {
                                            reject({ flag: false, message: 'Transaction failed.', info: transactionErr });
                                        }
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4, func()];
                                    case 2:
                                        _a.sent();
                                        this.connection.commit();
                                        resolve({ flag: true, message: 'Transaction successful.' });
                                        return [3, 4];
                                    case 3:
                                        err_1 = _a.sent();
                                        this.connection.rollback(function () {
                                            reject({ flag: false, message: 'Transaction failed.', info: err_1 });
                                        });
                                        return [3, 4];
                                    case 4: return [2];
                                }
                            });
                        }); });
                    })];
            });
        });
    };
    Connection.prototype.query = function (sql, args) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var that = _this;
                        _this.connection.query(sql, args, function (err, result, fields) {
                            if (err) {
                                reject({ flag: false, message: 'Query failed.', info: err });
                            }
                            if (result instanceof Array) {
                                var data_1 = [];
                                result.forEach(function (row) {
                                    var item = __rest(row, []);
                                    data_1.push(that.config.mapUnderscoreToCamelCase ? Connection.toCamelCase(item) : item);
                                });
                                resolve({ flag: true, message: 'Query successful', info: data_1 });
                            }
                            resolve({ flag: true, message: 'Query successful', info: result });
                        });
                    })];
            });
        });
    };
    Connection.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = "SELECT * FROM ?? " + this.sqlStrWhere + this.sqlStrOrderBy;
                return [2, this.query(sql, [this.tableName])];
            });
        });
    };
    Connection.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                sql = "DELETE FROM ?? " + this.sqlStrWhere;
                return [2, this.query(sql, [this.tableName])];
            });
        });
    };
    Connection.prototype.update = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                obj = this.config.mapUnderscoreToCamelCase ? Connection.toMapUnderscore(obj) : obj;
                sql = "UPDATE ?? SET ?" + this.sqlStrWhere;
                return [2, this.query(sql, [this.tableName, obj])];
            });
        });
    };
    Connection.prototype.add = function (rows) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, rowValues, sql, _i, rows_1, row;
            return __generator(this, function (_a) {
                keys = Object.keys(rows[0]);
                keys = this.config.mapUnderscoreToCamelCase ? keys.map(function (key) { return transform_1.toMapUnderscore(key); }) : keys;
                rowValues = [];
                sql = "INSERT INTO ?? (??) VALUES ";
                for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                    row = rows_1[_i];
                    sql += '(?),';
                    rowValues.push(Object.values(row));
                }
                sql = sql.slice(0, -1);
                return [2, this.query(sql, __spreadArrays([this.tableName, keys], rowValues))];
            });
        });
    };
    Connection.prototype.release = function () {
        this.connection.release();
    };
    return Connection;
}());
exports.Connection = Connection;
var DB = (function (_super) {
    __extends(DB, _super);
    function DB(_a) {
        var database = _a.database, user = _a.user, password = _a.password, _b = _a.host, host = _b === void 0 ? 'localhost' : _b, _c = _a.port, port = _c === void 0 ? 3306 : _c, _d = _a.config, config = _d === void 0 ? configDefault : _d;
        var _this = _super.call(this, mysql_1.default.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        }), config) || this;
        _this.connection.connect();
        return _this;
    }
    DB.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.connection.end(function (err) {
                            if (err) {
                                reject({ flag: false, message: 'Connection close failed.', info: err });
                            }
                            resolve({ flag: true, message: 'Connection close successful.' });
                        });
                    })];
            });
        });
    };
    return DB;
}(Connection));
exports.DB = DB;
var Pool = (function (_super) {
    __extends(Pool, _super);
    function Pool(_a) {
        var database = _a.database, user = _a.user, password = _a.password, _b = _a.host, host = _b === void 0 ? 'localhost' : _b, _c = _a.port, port = _c === void 0 ? 3306 : _c, _d = _a.connectionLimit, connectionLimit = _d === void 0 ? 10 : _d, _e = _a.config, config = _e === void 0 ? configDefault : _e;
        var _this = _super.call(this, null, config) || this;
        _this.pool = mysql_1.default.createPool({
            connectionLimit: connectionLimit,
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        });
        return _this;
    }
    Pool.prototype.getConnection = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                }
                resolve(new Connection(connection, _this.config));
            });
        });
    };
    Pool.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.pool.end(function (err) {
                            if (err) {
                                reject({ flag: false, message: 'Connection pool close failed.', info: err });
                            }
                            resolve({ flag: true, message: 'Connection pool close successful.' });
                        });
                    })];
            });
        });
    };
    return Pool;
}(Connection));
exports.Pool = Pool;
