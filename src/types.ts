export interface IRegExp {
  clearText: (text: string) => string,
}
export type FetchParams = {
  sheetName: string,
  sheetId: string,
  query?: string
}
export type ModuleOpts = {
  return_type?: "xml" | "json" | "yaml" | null | undefined
  need_clear?: boolean
}
export type GoogleSheetsApiResponse = {

}