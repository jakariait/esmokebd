const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const admin = req.admin;


    if (!admin || !admin.permissions) {
      return res
        .status(403)
        .json({ message: "Access denied. No permissions found." });
    }

    if (!admin.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: `Access denied. Missing permission: ${requiredPermission}`,
      });
    }

    next();
  };
};

module.exports = checkPermission;
