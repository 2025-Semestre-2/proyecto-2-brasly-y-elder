module.exports = function (requiredRole) {
    return (req, res, next) => {
        if (req.user.rol !== requiredRole) {
            return res.status(403).json({ error: "Acceso denegado." });
        }
        next();
    };
};
