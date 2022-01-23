/**
 * @param {import('puppeteer').Page} page
 */
async function login(page) {
    console.log('Entrando al Portal de Servicio Social...')

    // Entrar al portal de servicio social
    await page.goto('https://deimos.dgi.uanl.mx/cgi-bin/bt.sh/ssc_inicio_00.w', {
        waitUntil: 'networkidle2'
    })

    const username = process.env.USERNAME
    if (! username) {
        throw Error('Especifica la variable USERNAME en tu archivo .env')
    }

    const password = process.env.PASSWORD
    if (! password) {
        throw Error('Especifica la variable PASSWORD en tu archivo .env')
    }

    // Ingresar usuario
    await page.type('input[name="HTMLUsuCve"]', username)

    // Ingresar contraseña
    await page.type('input[name="HTMLPassword"]', password)

    // Click en entrar
    await page.click('input[type="button"][value="Entrar"]')

    await page.waitForNavigation({
        waitUntil: 'networkidle2'
    })

    console.log('✅ Sesión Iniciada en el Portal de Servicio Social')
}

module.exports = login
