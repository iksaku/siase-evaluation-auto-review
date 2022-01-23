const puppeteer = require('puppeteer')

require('dotenv').config()

const obtainStudentIDs = require('./steps/obtainStudentIDs')
const login = require('./steps/login')
const tabNavigation = require('./steps/tabNavigation')
const fillSearch = require('./steps/fillSearch')
const evaluateStudent = require('./steps/evaluateStudent')

const prompt = require('./util/prompt');

(async () => {
    const students = await obtainStudentIDs()

    //const evaluation = await prompt('Ingresa el número de evaluación a revisar:', 'No has especificado el número de evaluación')
    //const targetEvaluation = `EVALUACION ${evaluation} MENSUAL`
    const targetEvaluation = `EVALUACION 1 MENSUAL`

    console.log('Abriendo navegador...')

    const browser = await puppeteer.launch({
        headless: process.env.HEADLESS !== 'false',
        args: ['--disable-features=site-per-process']
    })

    let page = (await browser.pages())[0]

    if (! page) {
        page = await browser.newPage()
    }

    await login(page)

    const frame = await tabNavigation(page)

    await fillSearch(frame);

    const cachedStudentListResults = await frame.content()

    console.log('Revisando estudiantes...')

    for (const studentId of students) {
        await evaluateStudent(page, frame, studentId, targetEvaluation)

        await frame.setContent(cachedStudentListResults)
    }

    await browser.close()
})()
