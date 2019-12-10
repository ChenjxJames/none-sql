export interface Result {
    flag: boolean;
    message: string;
    info?: any;
}
declare class Connection {
    connection: any;
    private tableName;
    private sqlStrWhere;
    private sqlStrOrderBy;
    constructor(connection?: any);
    connect(tableName: string): Connection;
    where(obj: any): Connection;
    orWhere(obj: any): Connection;
    orderBy(obj: any): Connection;
    transaction(func: () => void): Promise<Result>;
    get(): Promise<Result>;
    delete(): Promise<Result>;
    update(obj: any): Promise<Result>;
    add(rows: any[]): Promise<Result>;
}
export declare class DB extends Connection {
    constructor(database: string, user: string, password: string, host?: string, isPoolConnect?: boolean);
    close(): Promise<Result>;
}
export declare class Pool extends Connection {
    pool: any;
    constructor(database: string, user: string, password: string, host?: string, connectionLimit?: number);
    getConnection(): Promise<Connection>;
    close(): Promise<Result>;
}
export {};
