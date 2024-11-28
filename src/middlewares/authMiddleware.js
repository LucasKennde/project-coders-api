const jwt = require("jsonwebtoken");


exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ msg: "Access denied. Notoken provided." });
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        console.log(req.user);

        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }


    console.log(token);

    if (!token) {
        console.log('Deu bom não');

        return res.status(403).json({ message: 'Token ausente!' });
    }

    next();
};