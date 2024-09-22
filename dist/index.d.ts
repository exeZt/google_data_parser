export type FetchParams = {
    sheetName: string;
    sheetId: string;
    query?: string;
};
declare class Net {
    getDataXHR(sheetName: string, sheetId: string, queryToList: string, callback: (stringData: string) => void): Promise<void>;
}
export declare class SheetsParser extends Net {
    parseToJSON: (str: string) => object;
    parseToObject: (val: any) => object;
    parseWithFetch: (fetchParams: FetchParams, callback: (stringData: object) => void) => Promise<void>;
}
export {};
