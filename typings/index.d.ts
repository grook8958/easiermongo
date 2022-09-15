import { EventEmitter } from 'node:events';
import { Collection } from '@discordjs/collection';
import mongoose, {
    QueryOptions,
    Schema,
    SchemaDefinition,
    SchemaOptions,
    Model,
    SchemaTypes,
} from 'mongoose';

export class MongoClient extends EventEmitter {
    public constructor(options: MongoClientOptions);
    public options: MongoClientOptions;
    public _mongoose: typeof mongoose;
    public database: Database;
    public get db(): Database;
    public get uri(): string;
    public connect(uri?: ConnectionStringBuilder|string): Promise<Database>;
    public connect(): Promise<Database>;
    public disconnect(): Promise<void>;
    private _validateOptions(options: MongoClientOptions): Promise<void>;
    private handleEvents(): void;
    public on<K extends keyof MongoClientEvents>(event: K, listener: (...args: MongoClientEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof MongoClientEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this;
    public once<K extends keyof MongoClientEvents>(event: K, listener: (...args: MongoClientEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof MongoClientEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this;
}

export class ConnectionStringBuilder {
    public constructor(data: ConnectionStringBuilderData);
    public host: string | null;
    public port: number | null;
    public dbName: string | null;
    public username: string | null;
    public password: string | null;
    public srv: boolean | null;
    public authSource: string | null;
    public setHost(host: string): ConnectionStringBuilder;
    public setPort(port: number): ConnectionStringBuilder;
    public setDbName(dbName: string): ConnectionStringBuilder;
    public setUsername(username: string): ConnectionStringBuilder;
    public setPassword(password: string): ConnectionStringBuilder;
    public useSRV(useSRV: boolean): ConnectionStringBuilder;
    public setAuthSource(source: string): ConnectionStringBuilder;
    public toString(): string;
    public toJSON(): Object;
}

export class Database {
    public constructor(client: MongoClient);
    public client: MongoClient;
    public name: string;
    public _schemaFileManager: SchemaFileManager;
    public schemas: SchemaManager;
    public connectionDetails: MongoConnectionDetails;
    public getCollections(): Promise<mongoose.Collection<Document>[]>;
    public getCollection(name: string): mongoose.Collection<Document>;
    public disconnect(): Promise<void>;
}

export class SchemaManager {
    public constructor(database: Database);
    public database: Database;
    public collection: Collection<string,ModelObject>
    public addSchema(name: string, schema: MongoSchema|SchemaBuilder): SchemaManager;
    public addSchemas(...schemaObjects: SchemaObject[]): SchemaManager;
}

export class MongoSchema extends Schema {
    public constructor(obj: SchemaDefinition, options: SchemaOptions);
    public model(name: string, makeCache?: boolean): MongoModel;
}

export class MongoModel {
    public constructor(model: Model<any>, makeCache: boolean);
    public _model: Model<any>;
    public makeCache: boolean;
    public cache: Collection<string,MongoDocument>;
    public ttl: number|null;
    public _expiryManager: DocumentExpiryManager;
    private resolveTTL(): number;
    public onExpire(callback: (id: string, document: MongoDocument) => {}): void;
    public create(document: DocumentBuilder|BaseDocumentData): Promise<MongoDocument>;
    public getAll(): Promise<any>;
    public get(id: string): Promise<MongoDocument>;
    public find(query: MongoQuery): Promise<MongoDocument>;
    public findMany(query: MongoQuery): Promise<MongoDocument[]>;
    public edit(id: string, change: MongoChange, options?: ModelEditOptions): Promise<MongoDocument>;
    public findAndEdit(query: MongoQuery, change: MongoChange, options?: ModelEditOptions): Promise<MongoDocument>;
    public editMany(query: MongoQuery, change: MongoChange, options?: ModelEditOptions): Promise<MongoDocument>;
    public delete(id: string): Promise<void>;
    public findAndDelete(query: MongoQuery): Promise<void>;
    public deleteMany(query: MongoQuery): Promise<void>;
    public update(id: string, change: MongoChange, options?: ModelEditOptions): Promise<MongoDocument>;
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

export class SchemaBuilder {
    public constructor(data?: SchemaBuilderData, skipValidation?: boolean);
    public fields?: SchemaFieldBuilder[];
    public options?: SchemaOptions;
    public addField(input: (builder: SchemaFieldBuilder) => SchemaFieldBuilder): SchemaBuilder;
    public setOptions(options: SchemaOptions): SchemaBuilder;
    public toJSON(): any;
    public toSchema(): MongoSchema;
    private _validateOptions(skipValidation?: boolean): void;
}

export class SchemaFieldBuilder {
    public constructor(data?: SchemaFieldBuilderData, skipValidation?: boolean);
    public name?: string;
    public type?: SchemaFieldType;
    public required?: boolean;
    public default?: any;
    public setName(name: string): SchemaFieldBuilder;
    public setType(type: SchemaFieldType|SchemaFieldTypeResolvable): SchemaFieldBuilder;
    public setRequired(required: boolean): SchemaFieldBuilder;
    public setDefault(value: any): SchemaFieldBuilder;
    public setTTL(ttl: number): SchemaFieldBuilder;
    public toJSON(): any;
    private resolveFieldType(type: SchemaFieldType|SchemaFieldTypeResolvable): SchemaFieldType;
    private _validateOptions(skipValidation?: boolean): void;
}

export class Util extends null {
    public static mergeDefault(def: any, given: any): any;
    public static handleError(error: Error): MongoError;
    public static checkArray(array: Array<any>, type: string): boolean;
    public static updateObject(object: RawDocumentData, change: Object): Object;
}

export class MongoError extends Error {
    public constructor(error: string)
}

export class Options extends null {
    public static createDefault(): MongoClientOptions;
}

export class MongoDocument {
    public constructor(rawDocument: any, model: MongoModel);
    public _document: RawDocumentData;
    public $model: MongoModel;
    public readonly _id: string;
    public readonly __v: number;
    public get id(): string;
    public get vKey(): number;
    public get _cFields(): Object;
    [propName: string]: any;
    public delete(): Promise<void>;
    public insertCopy(id: string): Promise<MongoDocument>;
    private _parseFields(): void;
    public toJSON(): JSONRawDocumentData;
}

export class DocumentBuilder {
    public constructor(data?: DocumentBuilderData);
    public id?: string;
    public cFields?: Object;
    public static from(document: MongoDocument): DocumentBuilder;
    public setId(id: string): DocumentBuilder;
    public addField(name: string, value: any): DocumentBuilder;
    public addFields(data: Array<DocumentBuilderFieldData>|DocumentBuilderFieldData): DocumentBuilder;
    toJSON(): BaseDocumentData;
}

export class DocumentExpiryManager extends EventEmitter {
    public constructor(model: MongoModel);
    public model: MongoModel;
    public clock: NodeJS.Timer;
    public willExpire: Array<String|undefined>;
    public checkExpire(): void;
    public end(): void;
    public register(): boolean;
    public remove(): boolean;
    public on<K extends keyof DocumentExpiryManagerEvents>(event: K, listener: (...args: DocumentExpiryManagerEvents[K]) => Awaitable<void>): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof DocumentExpiryManagerEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this;
    public once<K extends keyof DocumentExpiryManagerEvents>(event: K, listener: (...args: DocumentExpiryManagerEvents[K]) => Awaitable<void>): this;
    public once<S extends string | symbol>(
      event: Exclude<S, keyof DocumentExpiryManagerEvents>,
      listener: (...args: any[]) => Awaitable<void>,
    ): this;
}

//=============================================================================
//                      [Interfaces and types below]
//=============================================================================
export interface DocumentExpiryManagerEvents {
    expire: [id: string, document: MongoDocument];
}

export interface DocumentBuilderFieldData {
    name: string,
    value: any
}

/**
 * @example
 * {field1: 'searchValue'}
 */
export type MongoQuery = Object;

/**
 * @example
 * {field1: 'newValue'}
 */
export type MongoChange = Object;

export type AnyObject = {};


export interface BaseDocumentData {
    _id: string,
    [propName: string]: any;
}

/**
 * @example
 * {
 *   _id: 'someId',
 *   __v: 0,
 *   someField: true
 * }
 */
export interface RawDocumentData extends BaseDocumentData {
    __v: number,
}

export type JSONRawDocumentData = RawDocumentData;

export type Awaitable<T> = T | PromiseLike<T>;

export interface SchemaBuilderData {
    fields: SchemaFieldBuilder[];
    options: SchemaOptions;
}

export enum SchemaFieldTypes {
    //@ts-ignore
    STRING = SchemaTypes.String,
    //@ts-ignore
    NUMBER = SchemaTypes.Number,
    //@ts-ignore
    DATE = SchemaTypes.Date,
    //@ts-ignore
    BUFFER = SchemaTypes.Buffer,
    //@ts-ignore
    BOOLEAN = SchemaTypes.Boolean,
    //@ts-ignore
    MIXED = SchemaTypes.Mixed,
    //@ts-ignore
    OBJECTID = SchemaTypes.ObjectId,
    //@ts-ignore
    ARRAY = SchemaTypes.Array,
    //@ts-ignore
    DECIMAL = SchemaTypes.Decimal128, 
    //@ts-ignore  
    MAP = SchemaTypes.Map,
}

export interface SchemaFieldBuilderData {
    name: string;
    type: SchemaFieldType;
    required: boolean;
    default: any;
    ttl: number;
}

export type SchemaFieldType = typeof SchemaTypes;

export type SchemaFieldTypeResolvable = 
    | "STRING"
    | "NUMBER"
    | "DATE"
    | "BUFFER"
    | "BOOLEAN"
    | "MIXED"
    | "OBJECTID"
    | "ARRAY"
    | "DECIMAL128"
    | "MAP"

export interface MongoConnectionDetails {
    host: string;
    port: number;
    username: string | undefined;
    password: string | undefined;
}

export interface ModelObject {
    name: string;
    model: MongoModel;
}

export interface SchemaObject {
    name: string;
    schema: MongoSchema|SchemaBuilder;
}

export type ModelEditOptions = QueryOptions;

export interface ConnectionStringBuilderData {
    host?: string;
    port?: number;
    dbName?: string;
    username?: string;
    password?: string;
    srv?: boolean;
    authSource?: string;
}

export interface DocumentBuilderData {
    _id: string
    cFields: Object;
}

export interface MongoClientOptions {
    connetionTimeout?: 5000 | number;
    uri?: string;
    schemaFolderPath?: string;
    useFiles?: true | boolean;
    ignoredFiles?: Array<string>;
    makeCache?: true | boolean;
    esm: boolean;
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
    file: [file: string]
}

export interface OperatorData<T> {
    [propName: string]: T;
}
export type BaseOperatorObject<Op extends string, OpData extends object> = {
    [propName in Op]: OpData;
};
export type PushOperatorObject = BaseOperatorObject<'$push',OperatorData<any>>;
export type PullOperatorObject = BaseOperatorObject<'$pull',OperatorData<any>>;
export type IncrementOperatorObject = BaseOperatorObject<'$inc',OperatorData<number>>;

//=============================================================================
//                      [Functions below]
//=============================================================================
export function increment(fieldName: string, amount: number): IncrementOperatorObject;
export function pull(fieldName: string, value: any): PullOperatorObject;
export function push(fieldName: string, value: any): PushOperatorObject;

