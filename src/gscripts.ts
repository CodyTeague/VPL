// const sendEmail = ( )
// export const mailApp = {sendEmail: fn}

// export const htmlService = {createTemplateFromFile: fn}

const setValues = (data: number[][]) => {}
const getRange = (col: number, row: number, height: number, width: number) => ({setValues})
const getSheetByName = (name: string) => ({getRange})
const openById = (id: string) => ({getSheetByName})


export const sheetApp = () => ({openById})