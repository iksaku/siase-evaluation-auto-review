const puppeteer = require('puppeteer')

require('dotenv').config()

const steps = require('./steps');
const prompt = require('./util/prompt');

(async () => {
    process.env.PERSON_IN_CHARGE = await prompt('Ingresa tu nombre (como sale en el excel):', 'No has especificado tu nombre')
    process.env.EVALUATION = await prompt('Ingresa el número de evaluación a revisar:', 'No has especificado el número de evaluación')

    console.log('Abriendo navegador...')

    const browser = await puppeteer.launch()

    let page = (await browser.pages())[0]

    if (! page) {
        page = await browser.newPage()
    }

    await steps.login(page)

    const frame = await steps.tabNavigation(page)

    await steps.fillSearch(frame)

    await steps.evaluateStudents(page, frame)

    await browser.close()
})()
