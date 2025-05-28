const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    experimentalSessionAndOrigin: true, // <--- ДОБАВЬ ЭТУ СТРОКУ
    setupNodeEvents(on, config) {
      // Здесь твои обработчики событий для node при необходимости
    },
  },
});
