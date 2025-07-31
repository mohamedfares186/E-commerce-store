const errorHandling = (err, req, res, next) => {
  const { statusCode, message, stack } = err;

  res.sendStatus(500);
  console.error(`${statusCode} / ${message} \n ${stack}`);
};

export default errorHandling;
