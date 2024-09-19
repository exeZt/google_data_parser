import {FetchParams, IRegExp, ModuleOpts} from "./types";
import YAML, {Document, parse} from 'yaml';
import {writeFile } from "fs";

class Net {
  async getDataXHR(sheetName: string, sheetId: string, queryToList: string, callback: (stringData: string) => void): Promise<void> {
    let base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    let qRea = encodeURIComponent(queryToList);
    let qUri = `${base}&sheet=${sheetName}&tq=${qRea}`;
    fetch(qUri)
      .then((res: Response) => res.text())
      .then((res: string) => callback(res))
  }
}

export class Regexp implements IRegExp {
  clearText(text: string): string {
    return;
  }
}

export class Parser extends Net {
  parseToJSON = (str: string): object => {
    try {
      return JSON.parse(str);
    }catch (e) {
      console.log('Failed convert string to json')
      return;
    }
  }

  parseToYAML = (str: string): string => {
    try {
      return YAML.parse(str)?.table;
    }catch (e){
      console.log('Failed convert string to yaml')
      return;
    }
  }

  parseToObject = (val: any): object => {
    let result = {
      table: []
    }
    val.table.rows.map((val0, index0) => {
      console.log(val0)
      val0.c.map((val1, index1) => {
        console.log(val1)
        result.table.push(val.v.map((value, index2) => value))
      })
    })
    // TODO: FIX THIS SHIT
    // { v: 'title' }
    // C:\Users\exezt-\IdeaProjects\google_sheets_parser\src\utils.ts:45
    // val.table.rows.map((val0, index0) => {
    // ^
    //   TypeError: val1.map is not a function


      return result;
  }

  // parseToXML = (str: string): Document => {
  //   const parser = new DOMParser();
  //   try {
  //     return parser.parseFromString(str, 'text/xml')
  //   }catch (e) {
  //     console.log('Failed convert string to xml')
  //     return;
  //   }
  // }

  parseWithFetch = async (fetchParams: FetchParams, callback: (stringData: string) => void): Promise<void> => {
    await this.getDataXHR(fetchParams.sheetName, fetchParams.sheetId, fetchParams.query??"Select *", (strVal: string) => {
      callback(strVal);
    })
  }
}

export class SheetsParser {
  private readonly parse_result_type: string;
  private readonly need_clear: boolean;

  constructor(opts?: ModuleOpts) {
    this.parse_result_type = opts?.return_type ?? undefined
    this.need_clear = opts?.need_clear ?? undefined
  }

  parseString = (str: string): object => {
    if (this.parse_result_type === "json" || this.parse_result_type === undefined)
      return new Parser().parseToJSON(str)
    // else
    //   return new Parser().parseToYAML(str)
  }

  parseRawString = (str: string): object => {
    if (this.parse_result_type === "json" || this.parse_result_type === undefined)
      return new Parser().parseToJSON(str.substr(47).slice(0, -2))
    // else
    //   return new Parser().parseToYAML(str.substr(47).slice(0, -2))
  }

  parseToObject = (str: object): object => {
    return new Parser().parseToObject(str);
  }

  parseAndFetch = async (options: FetchParams, callback?: (data: object) => void): Promise<void> => {
    await new Parser().parseWithFetch(options, (data) => {
      try {
        JSON.parse(data)
      }catch (e) {
        console.log('Caught error when tries to parse string data to JSON')
        return;
      }
      if (JSON.parse(data).status === "error"){
        throw new Error(`Status !== OK; Query might be written with errors!! \n 
          Error description: \n 
          ${JSON.parse(data).errors[0].message} \n
          ${JSON.parse(data).errors[0].detailed_message}`)
      }
      callback?.(this.parseRawString(data));
    })
  }

  parseToObjectAndFetch = async (options: FetchParams, callback?: (data: object) => void): Promise<void> => {
    // todo: this
    await new Parser().parseWithFetch(options, (data) => {
      callback?.(this.parseRawString(data));
    })
  }
}

new Net().getDataXHR('MainMenuList', '1hVpfy4j9G35SGKNaSq8iO9PVz63DSAJlPUfOY7y8UxM', 'Select A,B,C,D,E', (data) => {
  // console.log(new SheetsParser().parseRawString(data))
  //writeFile('newfile.json', JSON.stringify(new SheetsParser().parseRawString(data)), () => {})
  writeFile('newfile.json', JSON.stringify(new SheetsParser().parseToObject(new SheetsParser().parseRawString(data))), () => {})
}).catch((err) => {  console.log(err) })