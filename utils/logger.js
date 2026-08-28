function time() {
  return new Date().toLocaleTimeString();
}

module.exports = {
  info(message) {
    console.log(`[${time()}] ℹ️ ${message}`);
  },

  success(message) {
    console.log(`[${time()}] ✅ ${message}`);
  },

  warn(message) {
    console.log(`[${time()}] ⚠️ ${message}`);
  },

  error(message) {
    console.log(`[${time()}] ❌ ${message}`);
  }
};
