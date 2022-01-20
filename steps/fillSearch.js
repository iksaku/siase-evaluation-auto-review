/**
 * @param {import("puppeteer").Frame} frame
 */
async function fillSearch(frame) {
    console.log('Rellenando formulario de búsqueda de Prestadores de Servicio Social...')

    // Periodo: Enero-Junio 2022
    await frame.select('select[name="flt_rid_periodo"]', '0x0000000000026899')

    // Departamento: Coordinación de Servicio Social
    await frame.select('select[name="flt_rid_depto"]', '0x00000000001f62f3')

    // Programa: E.D. Enero-Junio 2022
    await frame.select('select[name="flt_rid_programa"]', '0x00000000023bcc85')

    // Buscar
    await frame.click('#id_bt_Filtrar_Fnt')

    console.log('Cargando resultados...')

    await frame.waitForNavigation({
        timeout: 0,
        waitUntil: 'networkidle0'
    })

    console.log('✅ Se ha obtenido la lista de Prestadores (Estudiantes) de Servicio Social')
}

module.exports = fillSearch
