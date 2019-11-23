export interface Result {
    flag: boolean;
    message: string;
    info?: any;
}
export declare class DB {
    private connection;
    private tableName;
    private sqlStrWhere;
    private sqlStrOrderBy;
    constructor(database: string, user: string, password: string, host?: string);
    connect(tableName: string): this;
    where(obj: any): this;
    orWhere(obj: any): this;
    orderBy(obj: any): this;
    transaction(func: () => void): Promise<Result>;
    get(): Promise<Result>;
    delete(): Promise<Result>;
    update(obj: any): Promise<Result>;
    add(rows: any[]): Promise<Result>;
    close(): Promise<Result>;
}
