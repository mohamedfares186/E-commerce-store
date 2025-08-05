const filter = (queryFileds = []) => {
    return (req, res, next) => {
        const filter = {};
        queryFileds.forEach(field => {
        if (req.query[field] !== undefined) {
            filter[field] = req.query[field];
        }
        });
        req.filter = filter;
        next();
    };
};

export default filter;