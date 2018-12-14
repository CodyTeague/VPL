// const sendEmail = ( )
// export const mailApp = {sendEmail: fn}

// export const htmlService = {createTemplateFromFile: fn}

// mocking spreadsheet
const setValues = (data: number[][]) => {}
const getRange = (col: number, row: number, height: number, width: number) => ({setValues, getValues})
const getValues = () => ([[1, 3, 4], [1, 2, 3]]);
const getDataRange = () => ({getValues})
const getSheetByName = (name: string) => ({getRange, getDataRange})
const openById = (id: string) => ({getSheetByName})


export const sheetApp = () => ({openById})

// mocking html service
const getContent = () => 'content'
const evaluate = () => ({getContent})
const createTemplateFromFile = (template: string) => ({data: {}, evaluate})
export const htmlService = () => ({createTemplateFromFile})

// mocking mail app
const sendEmail = (object: Object) => {}
export const mailApp = () => ({sendEmail})