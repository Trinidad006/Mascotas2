import jwt from 'jsonwebtoken';

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

export function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo admin' });
  next();
}

export function authorizeSelfOrAdmin(req, res, next) {
  if (req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ error: 'No autorizado' });
} 