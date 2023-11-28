import { ClientConfig } from 'pg';
import Connection from './connect';
export declare class PostgresConnection implements Connection {
    private client;
    constructor(connectionConfig: ClientConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    exec(script: string, values?: unknown[]): Promise<any>;
    transaction(callback: () => Promise<unknown>): Promise<void>;
}
