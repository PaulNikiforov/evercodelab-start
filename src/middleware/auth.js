function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = process.env.AUTH_TOKEN;

    if (!authHeader) {
        return res.status(401).send('Unauthorized');
    }

    if (authHeader !== `Bearer ${token}`) {
        return res.status(403).send('Forbidden');
    }

    next();
}

module.exports = authMiddleware;
