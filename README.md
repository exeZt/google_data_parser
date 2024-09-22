## Typescript library to parse default googleSheetsApiResponse
Makes get any data from google sheets faster & easier

## Usage
Let's say we have a table in Google Sheets that needs to be converted to json format

| title | name | number | mail
|--|--|--|--|
| someTitle1 | SomeName1 | 1 | some@mail.1
| someTitle2 | SomeName2 | 2 | some@mail.2
| someTitle3 | SomeName3 | 3 | some@mail.3
| someTitle4 | SomeName4 | 4 | some@mail.4
| someTitle5 | SomeName5 | 5 | some@mail.5

To convert this table from google list format we can use this function:
(typescript)
```typescript
import * as googleSheetsParser from "@exezt-/google_sheets_parser";

new googleSheetsParser.SheetsParser().parseWithFetch({  
  sheetId: `SHEET_BOOK_ID`,  
  sheetName: `list1`,  
  query: `Select A,B,C,D`  
}, (someData: object) => {  
  console.log(someData)  
})
```
(javascript ES)
```javascript
new googleSheetsParser.SheetsParser().parseWithFetch({  
  sheetId: `SHEET_BOOK_ID`,  
  sheetName: `list1`,  
  query: `Select A,B,C,D`  
}, (someData) => {  
  console.log(someData)  
})
```
Result of running this function will be:

```javascript
let obj = 
{
  table: {
    row_0: [ 'someTitle1', 'SomeName1', 1, 'some@mail.1' ],
    row_1: [ 'someTitle2', 'SomeName2', 2, 'some@mail.2' ],
    row_2: [ 'someTitle3', 'SomeName3', 3, 'some@mail.3' ],
    row_3: [ 'someTitle4', 'SomeName4', 4, 'some@mail.4' ],
    row_4: [ 'someTitle5', 'SomeName5', 5, 'some@mail.5' ] 
  }
}
```
Raw google api response contains characters that can't be parsed to json, this function solves this throuble

### Full api

### Functions
```typescript
// Parsing any string to json catching errors
parseToJSON: (str: string) => object;
// Parsing JSON to beautify object 
parseToObject: (val: any) => object;
// Function that sends request to googleSheets and returns ready object 
parseWithFetch: (fetchParams: FetchParams, callback: (stringData: object) => void) => Promise<void>;
```
### Types
```typescript
// Fetch params, uses for parseWithFetch function
type FetchParams = {  
  sheetName: string; // Name of google sheet
  sheetId: string; // Id of google sheet book
  query?: string; // Query to google list examples: 'Select *' or 'Select A,B,C'
};
```