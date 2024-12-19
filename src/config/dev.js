const server = {
  httpServer: {
    port: 3000,
    cors: {
      origin: "*",
      credentials: true,
      methods: "GET,PUT,PATCH,POST,DELETE,OPTION",
      exposedHeaders: ["accesstoken", "otptoken"],
    },
  },
}

module.exports = {
  server,
}
