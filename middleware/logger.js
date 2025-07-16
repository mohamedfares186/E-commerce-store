const logger = (req, res, next) => {
  const { method, originalUrl, ip } = req;
  const timeStamp = new Date().toISOString();

  res.on("finish", () => {
    const { statusCode } = res;
    console.log(
      `[${timeStamp}] | ${method} ${originalUrl} - ${ip} / ${statusCode}`
    );
  });

  next();
};

module.exports = logger;
