export interface IResult {
    flag: boolean;
    message: string;
    info?: any;
}
export declare type Result = IResult;
export interface IConfig {
    mapUnderscoreToCamelCase: boolean;
}
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
export declare class Connection {
    connection: any;
    private tableName;
    private sqlStrWhere;
    private sqlStrOrderBy;
    protected config: IConfig;
    constructor(connection: any, config: IConfig);
    private static toCamelCase;
    private static toMapUnderscore;
    connect(tableName: string): Connection;
    where(obj: any): Connection;
    orWhere(obj: any): Connection;
    orderBy(obj: any): Connection;
    transaction(func: () => void): Promise<IResult>;
    query(sql: string, args?: any[]): Promise<IResult>;
    get(): Promise<IResult>;
    delete(): Promise<IResult>;
    update(obj: any): Promise<IResult>;
    add(rows: any[]): Promise<IResult>;
    release(): void;
}
export declare class DB extends Connection {
    constructor({ database, user, password, host, port, config }: IDBConfig);
    close(): Promise<IResult>;
}
export declare class Pool extends Connection {
    pool: any;
    constructor({ database, user, password, host, port, connectionLimit, config }: IPoolConfig);
    getConnection(): Promise<Connection>;
    close(): Promise<IResult>;
}
