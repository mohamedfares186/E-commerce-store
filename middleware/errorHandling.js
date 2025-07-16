const errorHandling = (err, req, res, next) => {
  const { status } = err;
  console.error(`${status} / ${err}`);
};

module.exports = errorHandling;
