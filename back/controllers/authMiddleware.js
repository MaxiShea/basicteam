import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado Authorization
    console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'No se proporcionó token de autenticación.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido.' });
        }

        req.user = { id_usuario: decoded.id_usuario }; // Almacenar el ID del usuario en el objeto req
        next(); // Continuar con la siguiente función de middleware o controlador
    });
};

export default authMiddleware;