"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetsParser = void 0;
class Net {
    getDataXHR(sheetName, sheetId, queryToList, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
            let qRea = encodeURIComponent(queryToList);
            let qUri = `${base}&sheet=${sheetName}&tq=${qRea}`;
            fetch(qUri)
                .then((res) => res.text())
                .then((res) => callback(res.substr(47).slice(0, -2)));
        });
    }
}
class SheetsParser extends Net {
    constructor() {
        super(...arguments);
        this.parseToJSON = (str) => {
            try {
                return JSON.parse(str);
            }
            catch (e) {
                console.log('Failed convert string to json');
                return {};
            }
        };
        this.parseToObject = (val) => {
            let result = {
                table: {}
            };
            try {
                val.table.rows.forEach((value, index) => {
                    // @ts-ignore
                    result.table[`row_${index}`] = [];
                    // @ts-ignore
                    result.table[`row_${index}`] = val.table.rows[index].c.map((vl) => { var _a; return (_a = vl === null || vl === void 0 ? void 0 : vl.v) !== null && _a !== void 0 ? _a : "null"; });
                });
            }
            catch (e) {
                console.error('Value cant be parsed to ResponseObject');
            }
            return result;
        };
        this.fetchData = (fetchParams, callback) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.getDataXHR(fetchParams.sheetName, fetchParams.sheetId, (_a = fetchParams.query) !== null && _a !== void 0 ? _a : "Select *", (stringData) => {
                callback(JSON.parse(stringData));
            });
        });
        this.parseWithFetch = (fetchParams, callback) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.getDataXHR(fetchParams.sheetName, fetchParams.sheetId, (_a = fetchParams.query) !== null && _a !== void 0 ? _a : "Select *", (strVal) => {
                callback(this.parseToObject(JSON.parse(strVal)));
            });
        });
    }
}
exports.SheetsParser = SheetsParser;
