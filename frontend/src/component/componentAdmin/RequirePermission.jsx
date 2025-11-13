import React from "react";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import { Box, Typography, CircularProgress } from "@mui/material";

const RequirePermission = ({ permission, children, fallback, match = "all" }) => {
  const { admin, loading } = useAuthAdminStore();
  const userPermissions = admin?.permissions;

  const requiredPermissions = Array.isArray(permission)
    ? permission
    : [permission];

  const hasPermission =
    Array.isArray(userPermissions) &&
    (match === "any"
      ? requiredPermissions.some((perm) => userPermissions.includes(perm))
      : requiredPermissions.every((perm) => userPermissions.includes(perm)));

  // ⛔ Don't show loading spinner if fallback === true
  if (!hasPermission && (loading || !Array.isArray(userPermissions))) {
    if (fallback === true) return null;

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  if (fallback === true) return null;
  if (fallback) return <>{fallback}</>;

  return (
    <Box sx={{ p: 2, border: "1px dashed #ccc", borderRadius: 1 }}>
      <Typography color="error">
        You do not have permission to access this section.
      </Typography>
    </Box>
  );
};

export default RequirePermission;
