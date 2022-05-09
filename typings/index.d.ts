export class MongoClient {
    public constructor(options: MongoClientOptions);
    public options: MongoClientOptions;
    public connect(uri?: string): Promise<void>
}

export interface MongoClientOptions {
    connetionTimeout?: number;
    connetionTimeout?: 5000;
    uri?: string;
}