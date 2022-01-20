const wait = require('../../util/wait')

/**
 * @param {import("puppeteer").Page} page
 * @param {import("puppeteer").Frame} frame
 * @param {number} studentId
 * @param {string} targetEvaluation
 */
async function evaluate(page, frame, studentId, targetEvaluation) {
    console.log(`Buscando al estudiante con matricula "${studentId}"...`)

    // Buscar estudiante dentro de la lista
    const studentRow = await frame.$x(`//td[contains(., "${studentId}")]/following-sibling::td`)

    if (studentRow.length < 1) {
        console.error(`No se ha encontrado al estudiante con la matricula "${studentId}"`)
        return
    }

    // Entrar a las encuestas del estudiante
    const evaluationsCell = studentRow.pop()
    const [evaluationsLink] = await evaluationsCell.$$('div[class="rpLk_Fnt_ot"][onclick]')
    await evaluationsLink.click()

    await frame.waitForNavigation({
        waitUntil: 'networkidle0'
    })

    console.log(`\t✅ Estudiante "${studentId}" encontrado. Seleccionando "${targetEvaluation}"...`)

    // Entrar a la encuesta designada
    const [targetEvaluationRow] = await frame.$x(`//td[contains(., "${targetEvaluation}")]/parent::node()`)
    await targetEvaluationRow.click()

    await frame.waitForNavigation({
        waitUntil: 'networkidle0'
    })

    console.log("\t✅ Encuesta seleccionada. Contestando formulario...")

    // Opciones Múltiples (Seleccionar siempre "Mucho")
    const radioInputs = await frame.$$('td input[type="radio"]:first-child')
    for (const radio of radioInputs) {
        await radio.click()
    }

    const clearAndType = async (element, newText) => {
        await element.click({ clickCount: 3 })
        await page.keyboard.press('Backspace')
        await element.type(newText)
    }

    // Desempeño
    const [performanceInput] = await frame.$$('td textarea')
    await clearAndType(
        performanceInput,
        'El prestador de servicio social, cumplió con todas las actividades y peticiones asignadas' +
        ' durante el mes correspondiente; teniendo un excelente desempeño en sus actividades.'
    )

    // Conteo de Horas
    const [hourCountInput] = await frame.$$('td input[type="text"]')
    await clearAndType(hourCountInput, '80')

    // Grabar
    const saveSelector = '#id_bt_Nuevo_Fnt'
    await frame.focus(saveSelector) // Truco para que Puppeteer pueda dar click en el botón pedorro
    await wait(1_000)
    await frame.click(saveSelector)

    await frame.waitForNavigation({
        waitUntil: 'networkidle0'
    })

    console.log(`\t✅ La encuesta "${targetEvaluation}" ha sido contestada.`)
}

module.exports = evaluate
