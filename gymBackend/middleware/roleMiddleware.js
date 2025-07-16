const User = require('../models/user');

const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id); // use req.user.id (from JWT payload)

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Attach role and businessId for downstream use
      req.user.role = user.role;
      req.user.businessId = user.businessId;

      // Check role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          error: `Access forbidden. Requires roles: ${allowedRoles.join(', ')}`
        });
      }

      // Optional: Enforce role creation hierarchy
      if (req.method === "POST" && req.body?.role) {
        const targetRole = req.body.role;

        if (user.role === "superadmin" && targetRole !== "gymadmin") {
          return res.status(403).json({ error: "Superadmin can only create gymadmin" });
        }

        if (user.role === "gymadmin" && !["trainer", "member"].includes(targetRole)) {
          return res.status(403).json({ error: "Gymadmin can only create trainer or member" });
        }

        if (["trainer", "member"].includes(user.role)) {
          return res.status(403).json({ error: "This role is not allowed to create users" });
        }
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
};

module.exports = requireRole;
