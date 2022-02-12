export declare type GUID = string | null;
export declare type ParserConfig = {
    timeout?: number;
    customFields?: {
        item: string[];
    };
};
export declare type PollConfig = {
    url: string;
    interval?: number;
    parserConfig?: ParserConfig;
};
export declare type Feed = {
    guid: string;
    [key: string]: any;
};
//# sourceMappingURL=types.d.ts.map