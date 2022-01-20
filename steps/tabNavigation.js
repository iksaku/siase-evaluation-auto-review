/**
 * @param {import("puppeteer").Page} page
 */
async function tabNavigation(page) {
    console.log('Entrando al apartado de Prestadores de Servicio Social...')

    const [tabNavigator, tabFrame] = page.mainFrame().childFrames()

    // Servicio Social
    await tabNavigator.hover('#id_Mn_30_F')

    // Prestadores Realizando S.S.
    await tabFrame.click('#id_opcns_30_5_Fnt')

    await tabFrame.waitForNavigation({
        waitUntil: 'networkidle0'
    })

    console.log('✅ Se ha entrado apartado Prestadores de Servicio Social')

    return tabFrame
}

module.exports = tabNavigation
