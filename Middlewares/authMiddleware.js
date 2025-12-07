import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // נצפה שהלקוח שולח "Bearer <token>"
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // שומרים את פרטי המשתמש בבקשה
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
