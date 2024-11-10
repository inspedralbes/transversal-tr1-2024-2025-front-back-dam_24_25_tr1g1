/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import { VNumberInput } from 'vuetify/labs/VNumberInput'

export default createVuetify({
  components: {
    VNumberInput,
  },
})



