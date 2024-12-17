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

const redis = {
  host: "127.0.0.1",
  port: 6379,
}

module.exports = {
  server,
  redis,
}
