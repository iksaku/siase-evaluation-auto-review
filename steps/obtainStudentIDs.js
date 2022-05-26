const fs = require('fs/promises')
const path = require('path')
const xlsx = require('xlsx')

/**
 * @returns {Promise<number[]>}
 */
async function obtainStudentIDs() {
    const spreadsheet = xlsx.readFile(await getSpreadsheet())
    const spreadsheetData = spreadsheet.Sheets[spreadsheet.SheetNames[0]]

    const keyForPersonInCharge = 'Nombre:'
    const keyForStudentID = '*Alumno'

    const reviewer = process.env.REVIEWER

    const ids = xlsx.utils.sheet_to_json(spreadsheetData)
        .filter((data) => {
            if (! (keyForPersonInCharge in data)) {
                return false
            }

            if (! data[keyForPersonInCharge].includes(reviewer)) {
                return false
            }

            if (! (keyForStudentID in data)) {
                return false
            }

            return Number.isInteger(data[keyForStudentID]);
        })
        .map((data) => data[keyForStudentID])
        .sort()

    if (ids.length < 1) {
        throw new Error(`No se han encontrado alumnos a ser revisados por ${reviewer}`)
    }

    console.log('Se revisará a los siguientes alumnos:', ids)

    return ids
}

async function getSpreadsheet() {
    const rootDir = path.resolve(__dirname, '../')

    const files = await fs.readdir(rootDir)

    for (const file of files) {
        if (path.extname(file).endsWith('xlsx')) {
            return path.resolve(rootDir, file)
        }
    }
}

module.exports = obtainStudentIDs
