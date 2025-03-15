// middleware.js
const checkRole = (role) => {
    return (req, res, next) => {
      const user = users.find(u => u.id === req.body.userId);
      if (!user || user.role !== role) {
        return res.status(403).json({ message: 'Yetkiniz yok!' });
      }
      next();
    };
  };
  
  module.exports = checkRole;
  