import { EventEmitter } from 'node:events';
import { Collection } from '@discordjs/collection';
import mongoose, {
    QueryOptions,
    Schema,
    SchemaDefinition,
    SchemaOptions,
    Model,
} from 'mongoose';

export class MongoClient extends EventEmitter {
    public constructor(options: MongoClientOptions);
    public options: MongoClientOptions;
    public _mongoose: typeof mongoose;
    public database: Database;
    public get db(): Database;
    public get uri(): string;
    public async connect(uri?: MongoConnectionString|string): Promise<void>;
    public async disconnect(): Promise<void>;
    private async _validateOptions(options: MongoClientOptions): Promise<void>;
    private handleEvents(): void;
    public on<K extends keyof MongoClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof MongoClientEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this;
    public once<K extends keyof MongoClientEvents>(event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof MongoClientEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this;
}

export class MongoConnectionString {
    public constructor(data: MongoConnectionStringData);
    public host: string | null;
    public port: number | null;
    public dbName: string | null;
    public username: string | null;
    public password: string | null;
    public srv: boolean | null;
    public authenticationSource: string | null;
    public setHost(host: string): MongoConnectionString;
    public setPort(port: numbrt): MongoConnectionString;
    public setDbName(dbName: string): MongoConnectionString;
    public setUsername(username: string): MongoConnectionString;
    public setPassword(password: string): MongoConnectionString;
    public useSRV(useSRV: boolean): MongoConnectionString;
    public setAuthenticationSource(source: string): MongoConnectionString;
    public toString(): string;
    public toJSON(): Object;
}

export class Database {
    public constructor(client: MongoClient);
    public client: MongoClient;
    public name: string;
    public _schemaFiles: SchemaFileManager;
    public schemas: SchemaManager;
    public connectionDetails: MongoConnectionDetails;
    public async getCollections(): Promise<mongoose.Collection<Document[]>>;
    public getCollection(name: string): Collection<Document>;
    public disconnect(): Promise<void>;
}

export class SchemaManager {
    public constructor(database: Database);
    public database: Database;
    public collection: Collection<string,ModelObject>
    public addSchema(name: string, schema: MongoSchema): SchemaManager;
    public addSchemas(...schemaObjects: SchemaObject[]): SchemaManager;
}

export class MongoSchema extends Schema {
    public constructor(obj: SchemaDefinition, options: SchemaOptions);
    public model(name: string, makeCache?: boolean): MongoModel;
}

export class MongoModel {
    public constructor(model: Model, makeCache: boolean);
    public _model: Model;
    public makeCache: boolean;
    public cache: Collection<string,any>;
    public async get(id: string): Promise<any>;
    public async find(query: Object): Promise<any>;
    public async findAll(query: Object): Promise<any[]>;
    public async edit(id: string, change: Object, options?: ModelEditOptions): Promise<any>;
    public async findAndEdit(query: Object, change: Object, options?: ModelEditOptions): Promise<any>;
    public async edit(query: string, change: Object, options?: ModelEditOptions): Promise<any>;
}

export class SchemaFileManager {
    public constructor(database: Database);
    public database: Database;
    public client: MongoClient;
    public files: any;
    public fetchFiles(options: MongoClientOptions): Promise<void>;
    private importESM(options: MongoClientOptions): Promise<Array<any>>;
    private importCommonJS(options: MongoClientOptions): Promise<Array<any>>;
}

//=============================================================================
//                      [Interfaces and types below]
//=============================================================================
export type Awaitable<T> = T | PromiseLike<T>;

export interface MongoConnectionDetails {
    host: string;
    port: number;
    username: string;
    password: string;
}

export interface ModelObject {
    name: string;
    schema: MongoModel;
}

export interface SchemaObject {
    name: string;
    schema: MongoSchema;
}

export type MongoEditOptions = QueryOptions;

export interface MongoConnectionStringData {
    host?: string;
    port?: number;
    dbName?: string;
    username?: string;
    password?: string;
    srv?: boolean;
    authenticationSource?: string;
}

export interface MongoClientOptions {
    connetionTimeout?: 5000 | number;
    uri?: string;
    schemaFolderPath?: string;
    esm?: boolean;
    useFiles?: boolean;
    ignoredFiles?: Array<string>;
    makeCache?: boolean;
}

export interface MongoClientEvents {
    error: [error: Error],
    disconnected: [],
    disconnecting: [],
    connected: [database: Database],
    connecting: [],
    reconnected: [],
    close: [],
    ready: [],
}

