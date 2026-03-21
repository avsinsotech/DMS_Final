// src/config/permissions.js
// ─────────────────────────────────────────────────────────────
// Permission Matrix — matches the image exactly
// ─────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Feature                Admin   Manager  Officer  DataEntry  Viewer
  createEditUsers:   { Admin:true, Manager:false, Officer:false, DataEntry:false, Viewer:false },
  assignRoles:       { Admin:true, Manager:false, Officer:false, DataEntry:false, Viewer:false },
  clientBranchCRUD:  { Admin:true, Manager:false, Officer:false, DataEntry:false, Viewer:false },
  customerMaster:    { Admin:true, Manager:true,  Officer:true,  DataEntry:false, Viewer:false },
  documentMaster:    { Admin:true, Manager:true,  Officer:false, DataEntry:false, Viewer:false },
  imageUpload:       { Admin:true, Manager:true,  Officer:true,  DataEntry:true,  Viewer:false },
  imageView:         { Admin:true, Manager:true,  Officer:true,  DataEntry:false, Viewer:true  },
  deleteImage:       { Admin:true, Manager:true,  Officer:false, DataEntry:false, Viewer:false },
  viewReports:       { Admin:true, Manager:true,  Officer:true,  DataEntry:false, Viewer:true  },
  exportReports:     { Admin:true, Manager:true,  Officer:false, DataEntry:false, Viewer:false },
};

// ── Route → permission mapping ──
export const ROUTE_PERMISSIONS = {
  "/":                null,              // Dashboard — everyone
  "/clients":         "clientBranchCRUD",
  "/add-client":      "clientBranchCRUD",
  "/client-master":   "clientBranchCRUD",
  "/branches":        "clientBranchCRUD",
  "/customer-master": "customerMaster",
  "/document-master": "documentMaster",
  "/image-upload":    "imageUpload",
  "/image-view":      "imageView",
  "/users/list":      "createEditUsers",
  "/users/add":       "createEditUsers",
  "/upload-log":      "viewReports",
  "/audit-log":       "viewReports",
};

// ── Check if a role has a permission ──
export function can(role, permission) {
  if (!permission) return true;            // null = open to all
  if (!role)       return false;
  const p = PERMISSIONS[permission];
  if (!p)          return true;            // unknown permission = open
  return p[role] === true;
}

// ── Get all allowed permissions for a role ──
export function getAllowed(role) {
  return Object.entries(PERMISSIONS)
    .filter(([, v]) => v[role])
    .map(([k]) => k);
}