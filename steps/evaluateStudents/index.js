const wait = require('../../util/wait')
const evaluate = require('./evaluate')
const obtainStudentIDs = require('./obtainStudentIDs')

/**
 * @param {import("puppeteer").Page} page
 * @param {import("puppeteer").Frame} frame
 */
async function evaluateStudents(page, frame) {
    const targetEvaluation = `EVALUACION ${process.env.EVALUATION} MENSUAL`

    await frame.waitForSelector('#id_RpDet')

    console.log('Cargando lista de estudiantes a revisar...')

    const students = await obtainStudentIDs()

    console.log('✅ Obtenido lista de estudiantes')

    for (const studentId of students) {
        await evaluate(page, frame, studentId, targetEvaluation)

        // Volver a la lista de estudiantes.
        // Esto nos permite evitar "volver" a cargar la lista completa de estudiantes.
        // Es más rápido cargarla desde la memoria del navegador.
        await page.evaluate(() => {
            history.go(-3)
        })
        await wait(1_000)
    }

    console.log('✅ Finalizada la evaluación de estudiantes')
}

module.exports = evaluateStudents
