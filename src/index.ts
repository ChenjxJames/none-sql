import mysql from 'mysql'

export interface Result {
  flag: boolean;
  message: string;
  info?: any;
}

export class Connection {
  public connection: any;
  private tableName: string;
  private sqlStrWhere: string;
  private sqlStrOrderBy: string;

  constructor(connection?: any) {
    this.connection = connection;
    this.tableName = '';
    this.sqlStrWhere = '';
    this.sqlStrOrderBy = '';
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
      for (const key in obj) {
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
      for (const key in obj) {
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
        this.sqlStrOrderBy += ' ' + key + ' ' + (obj[key] ? 'ASC' : 'DESC') + ', ';
      }
      this.sqlStrOrderBy = this.sqlStrOrderBy.slice(0, -2);
    }
    return this;
  }

  async transaction(func: () => void): Promise<Result> {
    return new Promise<Result>((resolve, reject) => {
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

  async query(sql: string, args?: any[]): Promise<Result> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, function (err: any, result: any, fields: any) {
        if (err) {
          reject({ flag: false, message: 'Query failed.', info: err });
        }
        if (result instanceof Array) {
          let data: any[] = [];
          result.forEach((row: any) => {
            let { ...item } = row;
            data.push(item);
          })
          resolve({ flag: true, message: 'Query successful', info: data });
        }
        resolve({ flag: true, message: 'Query successful', info: result });
      });
    });
  }

  async get(): Promise<Result> {
    let sql = "SELECT * FROM ?? " + this.sqlStrWhere + this.sqlStrOrderBy;
    return this.query(sql, [this.tableName]);
  }

  async delete(): Promise<Result> {
    let sql = "DELETE FROM ?? " + this.sqlStrWhere;
    return this.query(sql, [this.tableName]);
  }

  async update(obj: any): Promise<Result> {
    let sql = "UPDATE ?? SET ?" + this.sqlStrWhere;
    return this.query(sql, [this.tableName, obj]);
  }

  async add(rows: any[]): Promise<Result> {
    let keys = Object.keys(rows[0]);
    let rowValues: any[] = [];
    let sql = "INSERT INTO ?? (??) VALUES ";
    for (const row of rows) {
      sql += '(?),'
      rowValues.push(Object.values(row));
    }
    sql = sql.slice(0, -1);
    return this.query(sql, [this.tableName, keys, ...rowValues]);
  }
}

export class DB extends Connection {

  constructor(database: string, user: string, password: string, host = 'localhost', isPoolConnect = false) {
    super();
    this.connection = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
    });
    this.connection.connect();
  }

  async close(): Promise<Result> {
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
  
  constructor(database: string, user: string, password: string, host = 'localhost', connectionLimit = 10) {
    super();
    this.pool = mysql.createPool({
      connectionLimit : connectionLimit,
      host: host,
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
        resolve(new Connection(connection));
      });
    });
  }

  async close(): Promise<Result> {
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