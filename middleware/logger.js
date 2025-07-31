const logger = (req, res, next) => {
  const { method, hostname, originalUrl } = req;
  const date = new Date().toISOString();
  const start = new Date();

  res.on("finish", () => {
    const { statusCode } = res;
    const end = new Date();
    const duration = end - start;
    console.log(
      `[${date}] | ${method} ${hostname}:${process.env.PORT}${originalUrl} | ${statusCode} - ${duration}ms`
    );
  });

  next();
};

export default logger;
