const promptLib = require('prompt')

async function prompt(message, errorMessage) {
    promptLib.start()

    promptLib.colors = false
    promptLib.message = ''
    promptLib.delimiter = ''

    const {promptAnswer} = await promptLib.get({
        properties: {
            promptAnswer: {
                description: message
            }
        }
    })

    promptLib.pause()

    if (! promptAnswer) {
        throw new Error(errorMessage)
    }

    return promptAnswer
}

module.exports = prompt
