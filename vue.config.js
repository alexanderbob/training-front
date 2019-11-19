module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "configureWebpack": {
    devtool: 'source-map'
  },
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080, // CHANGE YOUR PORT HERE!
    //https: false,
    //hotOnly: false,
  }
}