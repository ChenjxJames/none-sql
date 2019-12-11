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
var Connection = (function () {
    function Connection(connection) {
        this.connection = connection;
        this.tableName = '';
        this.sqlStrWhere = '';
        this.sqlStrOrderBy = '';
    }
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
                this.sqlStrWhere += key + '=? and ';
            }
            this.sqlStrWhere = this.sqlStrWhere.slice(0, -4);
            this.sqlStrWhere += ')';
            this.sqlStrWhere = mysql_1.default.format(this.sqlStrWhere, Object.values(obj).slice());
        }
        return this;
    };
    Connection.prototype.orWhere = function (obj) {
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
    Connection.prototype.orderBy = function (obj) {
        if (Object.keys(obj).length) {
            this.sqlStrOrderBy = ' ORDER BY ';
            for (var key in obj) {
                this.sqlStrOrderBy += ' ' + key + ' ' + (obj[key] ? 'ASC' : 'DESC') + ', ';
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
                        _this.connection.beginTransaction(function (transactionErr) {
                            if (transactionErr) {
                                reject({ flag: false, message: 'The transaction is failed.', info: transactionErr });
                            }
                            try {
                                func();
                                _this.connection.commit();
                                resolve({ flag: true, message: 'Transaction committed.' });
                            }
                            catch (err) {
                                _this.connection.rollback(function () {
                                    reject({ flag: false, message: 'The transaction is failed.', info: err });
                                });
                            }
                        });
                    })];
            });
        });
    };
    Connection.prototype.query = function (sql, args) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        _this.connection.query(sql, args, function (err, result, fields) {
                            if (err) {
                                reject({ flag: false, message: 'Query failed.', info: err });
                            }
                            if (result.length > 0) {
                                var data_1 = [];
                                result.forEach(function (row) {
                                    var item = __rest(row, []);
                                    data_1.push(item);
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
                rowValues = [];
                sql = "INSERT INTO ?? (??) VALUES ";
                for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                    row = rows_1[_i];
                    sql += '(?),';
                    rowValues.push(Object.values(row));
                }
                sql = sql.slice(0, -1);
                return [2, this.query(sql, [this.tableName, keys].concat(rowValues))];
            });
        });
    };
    return Connection;
}());
var DB = (function (_super) {
    __extends(DB, _super);
    function DB(database, user, password, host, isPoolConnect) {
        if (host === void 0) { host = 'localhost'; }
        if (isPoolConnect === void 0) { isPoolConnect = false; }
        var _this = _super.call(this) || this;
        _this.connection = mysql_1.default.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
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
                            else {
                                resolve({ flag: true, message: 'Connection closed.' });
                            }
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
    function Pool(database, user, password, host, connectionLimit) {
        if (host === void 0) { host = 'localhost'; }
        if (connectionLimit === void 0) { connectionLimit = 10; }
        var _this = _super.call(this) || this;
        _this.pool = mysql_1.default.createPool({
            connectionLimit: connectionLimit,
            host: host,
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
                resolve(new Connection(connection));
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
                                reject({ flag: false, message: 'Connection close failed.', info: err });
                            }
                            else {
                                resolve({ flag: true, message: 'Connection closed.' });
                            }
                        });
                    })];
            });
        });
    };
    return Pool;
}(Connection));
exports.Pool = Pool;
