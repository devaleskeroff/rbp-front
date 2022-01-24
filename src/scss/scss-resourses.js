const path = require('path')

const resources = [
   '_vars.scss',
   'helpers/_functions.scss',
   'helpers/_utility-mixins.scss',
   'helpers/_mixins.scss',
   'helpers/_include-media.scss',
   '_scrollable.scss'
]
module.exports = resources.map((file) => path.resolve(__dirname, file))
