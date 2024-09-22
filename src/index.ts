export type FetchParams = {
  sheetName: string,
  sheetId: string,
  query?: string
}

class Net {
  async getDataXHR(sheetName: string, sheetId: string, queryToList: string, callback: (stringData: string) => void): Promise<void> {
    let base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
    let qRea = encodeURIComponent(queryToList);
    let qUri = `${base}&sheet=${sheetName}&tq=${qRea}`;
    fetch(qUri)
      .then((res: Response) => res.text())
      .then((res: string) => callback(res.substr(47).slice(0, -2)))
  }
}

export class SheetsParser extends Net {
  parseToJSON = (str: string): object => {
    try {
      return JSON.parse(str);
    }catch (e) {
      console.log('Failed convert string to json')
      return {};
    }
  }

  parseToObject = (val: any): object => {
    let result = {
      table: {}
    }
    // TODO: change any type to normal
    try {
      val.table.rows.forEach((value: any, index: string | number) => {
        // @ts-ignore
        result.table[`row_${index}`] = []
        // @ts-ignore
        result.table[`row_${index}`] = val.table.rows[index].c.map((vl) => vl?.v ?? "null")
      });
    }catch (e) {
      console.error('Value cant be parsed to ResponseObject')
    }
    return result;
  }

  parseWithFetch = async (fetchParams: FetchParams, callback: (stringData: object) => void): Promise<void> => {
    await this.getDataXHR(fetchParams.sheetName, fetchParams.sheetId, fetchParams.query??"Select *", (strVal: string) => {
      callback(this.parseToObject(JSON.parse(strVal)));
    })
  }
}