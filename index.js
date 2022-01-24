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

    const evaluation = await prompt('Ingresa el número de evaluación a revisar:', 'No has especificado el número de evaluación')
    const targetEvaluation = `EVALUACION ${evaluation} MENSUAL`

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

    const studentsLength = students.length
    let reviewCount = 0

    let studentEvaluationMessage = (studentId, previouslyEvaluated) => {
        const emoji = previouslyEvaluated ? '⏭' : '✅'
        let message = `${emoji} ${studentId} (${++reviewCount}/${studentsLength})`

        if (previouslyEvaluated) {
            message += ' (Previamente revisado)'
        }

        return message
    }

    for (const studentId of students) {
        let previouslyEvaluated = false

        try {
            await evaluateStudent(page, frame, studentId, targetEvaluation)
        } catch (e) {
            if (e.code !== 'PREVIOUSLY_EVALUATED') throw e

            previouslyEvaluated = true
        }

        console.log(studentEvaluationMessage(studentId, previouslyEvaluated))

        await frame.setContent(cachedStudentListResults)
    }

    console.log("✅ Se ha terminado de revisar a todos los estudiantes bajo su nombre")

    await browser.close()
})()
