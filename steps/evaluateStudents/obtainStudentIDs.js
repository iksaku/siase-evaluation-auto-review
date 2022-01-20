const fs = require('fs/promises')
const path = require('path')
const xlsx = require('xlsx')

/**
 * @returns {Promise<number[]>}
 */
async function obtainStudentIDs() {
    const spreadsheet = xlsx.readFile(await getSpreadsheet())
    const spreadsheetData = spreadsheet.Sheets[spreadsheet.SheetNames[0]]

    const keyForStudentID = '*Alumno'

    const ids = xlsx.utils.sheet_to_json(spreadsheetData)
        .filter((data) => {
            const keyForPersonInCharge = 'Nombre:'

            if (! (keyForPersonInCharge in data)) {
                return false
            }

            if (data[keyForPersonInCharge] !== process.env.PERSON_IN_CHARGE) {
                return false
            }

            if (! (keyForStudentID in data)) {
                return false
            }

            if (! Number.isInteger(data[keyForStudentID])) {
                return false
            }

            return true
        })
        .map((data) => data[keyForStudentID])
        .sort()

    if (ids.length < 1) {
        throw new Error(`No se han encontrado alumnos a ser revisados por ${process.env.PERSON_IN_CHARGE}`)
    }

    return ids
}

async function getSpreadsheet() {
    const rootDir = path.resolve(__dirname, '../../')

    const files = await fs.readdir(rootDir)

    for (const file of files) {
        if (path.extname(file).endsWith('xlsx')) {
            return path.resolve(rootDir, file)
        }
    }
}

module.exports = obtainStudentIDs
