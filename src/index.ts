import mysql from 'mysql'
import { toCamelCase, toMapUnderscore } from './lib/transform';

export interface IResult {
  flag: boolean;
  message: string;
  info?: any;
}

export type Result = IResult;  // interface命名统一改为I开头，为了向下兼容保留Result命名的类型输出

export interface IConfig {
  mapUnderscoreToCamelCase: boolean;  // 数据自动下划线转驼峰
}

const configDefault: IConfig = {
  mapUnderscoreToCamelCase: false,
};

export interface IDBConfig {
  database: string;
  user: string;
  password: string;
  host?: string;
  port?: number;
  config?: IConfig;
}

export interface IPoolConfig {
  database: string;
  user: string;
  password: string;
  host?: string;
  port?: number;
  connectionLimit?: number;
  config?: IConfig;
}

export class Connection {
  public connection: any;
  private tableName: string;
  private sqlStrWhere: string;
  private sqlStrOrderBy: string;
  protected config: IConfig;

  constructor(connection: any, config: IConfig) {
    this.connection = connection;
    this.tableName = '';
    this.sqlStrWhere = '';
    this.sqlStrOrderBy = '';
    this.config = config || configDefault;
  }

  private static toCamelCase(obj: any): any {
    let camelCaseObj: any = {};
    Object.keys(obj).forEach((key: string) => {
      camelCaseObj[toCamelCase(key)] = obj[key];
    });
    return camelCaseObj;
  }

  private static toMapUnderscore(obj: any): any {
    let mapUnderscoreObj: any = {};
    Object.keys(obj).forEach((key: string) => {
      mapUnderscoreObj[toMapUnderscore(key)] = obj[key];
    });
    return mapUnderscoreObj;
  }

  connect(tableName: string): Connection {
    this.sqlStrWhere = '';
    this.sqlStrOrderBy = '';
    this.tableName = tableName;
    return this;
  }

  where(obj: any): Connection {
    this.sqlStrWhere = ' WHERE (';
    if (Object.keys(obj).length) {
      for (let key in obj) {
        key = this.config.mapUnderscoreToCamelCase ? toMapUnderscore(key) : key;
        this.sqlStrWhere += key + '=? and ';
      }
      this.sqlStrWhere = this.sqlStrWhere.slice(0, -4);
      this.sqlStrWhere += ')';
      this.sqlStrWhere = mysql.format(this.sqlStrWhere, [...Object.values(obj)])
    }
    return this;
  }

  orWhere(obj: any): Connection {
    if (Object.keys(obj).length && this.sqlStrWhere) {
      this.sqlStrWhere += ' OR ('
      for (let key in obj) {
        key = this.config.mapUnderscoreToCamelCase ? toMapUnderscore(key) : key;
        this.sqlStrWhere += key + '=? and ';
      }
      this.sqlStrWhere = this.sqlStrWhere.slice(0, -4);
      this.sqlStrWhere += ')';
      this.sqlStrWhere = mysql.format(this.sqlStrWhere, [...Object.values(obj)])
    }
    return this;
  }

  orderBy(obj: any): Connection {
    if (Object.keys(obj).length) {
      this.sqlStrOrderBy = ' ORDER BY ';
      for (const key in obj) {
        const orderKey = this.config.mapUnderscoreToCamelCase ? toMapUnderscore(key) : key;
        this.sqlStrOrderBy += ' ' + orderKey + ' ' + (obj[key] ? 'ASC' : 'DESC') + ', ';
      }
      this.sqlStrOrderBy = this.sqlStrOrderBy.slice(0, -2);
    }
    return this;
  }

  async transaction(func: () => void): Promise<IResult> {
    return new Promise<IResult>((resolve, reject) => {
      this.connection.beginTransaction(async (transactionErr: any) => {
        if (transactionErr) {
          reject({ flag: false, message: 'Transaction failed.', info: transactionErr });
        }
        try {
          await func();
          this.connection.commit();
          resolve({ flag: true, message: 'Transaction successful.' });
        } catch (err) {
          this.connection.rollback(() => {
            reject({ flag: false, message: 'Transaction failed.', info: err });
          });
        }
      });
    });
  }

  async query(sql: string, args?: any[]): Promise<IResult> {
    return new Promise((resolve, reject) => {
      const that = this;
      this.connection.query(sql, args, function (err: any, result: any, fields: any) {
        if (err) {
          reject({ flag: false, message: 'Query failed.', info: err });
        }
        if (result instanceof Array) {
          let data: any[] = [];
          result.forEach((row: any) => {
            let { ...item } = row;
            data.push(that.config.mapUnderscoreToCamelCase ? Connection.toCamelCase(item) : item);
          });
          resolve({ flag: true, message: 'Query successful', info: data });
        }
        resolve({ flag: true, message: 'Query successful', info: result });
      });
    });
  }

  async get(): Promise<IResult> {
    let sql = "SELECT * FROM ?? " + this.sqlStrWhere + this.sqlStrOrderBy;
    return this.query(sql, [this.tableName]);
  }

  async delete(): Promise<IResult> {
    let sql = "DELETE FROM ?? " + this.sqlStrWhere;
    return this.query(sql, [this.tableName]);
  }

  async update(obj: any): Promise<IResult> {
    obj = this.config.mapUnderscoreToCamelCase ? Connection.toMapUnderscore(obj) : obj;
    let sql = "UPDATE ?? SET ?" + this.sqlStrWhere;
    return this.query(sql, [this.tableName, obj]);
  }

  async add(rows: any[]): Promise<IResult> {
    let keys = Object.keys(rows[0]);
    keys = this.config.mapUnderscoreToCamelCase ? keys.map(key => toMapUnderscore(key)) : keys;
    let rowValues: any[] = [];
    let sql = "INSERT INTO ?? (??) VALUES ";
    for (const row of rows) {
      sql += '(?),'
      rowValues.push(Object.values(row));
    }
    sql = sql.slice(0, -1);
    return this.query(sql, [this.tableName, keys, ...rowValues]);
  }

  // 释放连接回数据库连接池，
  release() {
    this.connection.release();
  }
}

export class DB extends Connection {

  constructor({ database, user, password, host = 'localhost', port = 3306, config = configDefault }: IDBConfig) {
    super(
      mysql.createConnection({
        host: host,
        port: port,
        user: user,
        password: password,
        database: database
      }),
      config
    );
    this.connection.connect();
  }

  async close(): Promise<IResult> {
    return new Promise((resolve, reject) => {
      this.connection.end((err: any) => {
        if (err) {
          reject({ flag: false, message: 'Connection close failed.', info: err });
        }
        resolve({ flag: true, message: 'Connection close successful.' });
      });
    });
  }
}

export class Pool extends Connection{
  pool: any;

  constructor({ database, user, password, host = 'localhost', port = 3306, connectionLimit = 10, config = configDefault }: IPoolConfig) {
    super(null, config);
    this.pool = mysql.createPool({
      connectionLimit : connectionLimit,
      host: host,
      port: port,
      user: user,
      password: password,
      database: database
    });
  }

  getConnection(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err: any, connection: any) => {
        if (err) {
          reject(err);
        }
        resolve(new Connection(connection, this.config));
      });
    });
  }

  async close(): Promise<IResult> {
    return new Promise((resolve, reject) => {
      this.pool.end((err: any) => {
        if (err) {
          reject({ flag: false, message: 'Connection pool close failed.', info: err });
        }
        resolve({ flag: true, message: 'Connection pool close successful.' });
      });
    });
  }
}