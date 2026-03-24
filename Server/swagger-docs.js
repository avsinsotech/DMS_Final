// ═══════════════════════════════════════════════════════════════════
// DMS Swagger API Specification — AVS InSoTech
// Paste this file as swagger-docs.js in your Server folder
// Then require it in index.js (see instructions at bottom)
// ═══════════════════════════════════════════════════════════════════

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DMS API — AVS InSoTech",
    version: "2.0.0",
    description: "Document Management System REST API. All endpoints require JWT Bearer token except /api/auth/login.",
    contact: { name: "AVS InSoTech Pvt. Ltd." },
  },
  servers: [{ url: "http://localhost:5000", description: "Local Dev Server" }],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token from /api/auth/login response",
      },
    },
    schemas: {
      // ── Auth ──
      LoginRequest: {
        type: "object", required: ["username", "password"],
        properties: {
          username: { type: "string", example: "admin" },
          password: { type: "string", example: "admin123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          token:   { type: "string" },
          user:    { $ref: "#/components/schemas/User" },
        },
      },

      // ── Client ──
      Client: {
        type: "object",
        properties: {
          id:      { type: "integer" },
          code:    { type: "string", example: "CLT-001" },
          name:    { type: "string", example: "Nashik District Co-op Bank" },
          type:    { type: "string", enum: ["Co-op Bank","Society","NBFC","Corporate"] },
          regNo:   { type: "string", example: "MCS/2003/141" },
          address: { type: "string" },
          contact: {
            type: "object",
            properties: {
              name:   { type: "string" },
              mobile: { type: "string" },
              email:  { type: "string" },
            },
          },
          status:    { type: "boolean" },
          logo:      { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ClientInput: {
        type: "object", required: ["name","regNo"],
        properties: {
          name:    { type: "string" },
          type:    { type: "string", enum: ["Co-op Bank","Society","NBFC","Corporate"], default: "Co-op Bank" },
          regNo:   { type: "string" },
          address: { type: "string" },
          contact: {
            type: "object",
            properties: { name: { type: "string" }, mobile: { type: "string" }, email: { type: "string" } },
          },
          status: { type: "boolean", default: true },
          logo:   { type: "string", nullable: true },
        },
      },

      // ── Branch ──
      Branch: {
        type: "object",
        properties: {
          id:        { type: "integer" },
          code:      { type: "string", example: "BR-001" },
          name:      { type: "string" },
          clientId:  { type: "integer" },
          address:   { type: "string" },
          manager:   { type: "string" },
          contact:   { type: "string" },
          status:    { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      BranchInput: {
        type: "object", required: ["name","clientId","contact"],
        properties: {
          name:     { type: "string" },
          clientId: { type: "integer" },
          address:  { type: "string" },
          manager:  { type: "string" },
          contact:  { type: "string", example: "9876543210" },
          status:   { type: "boolean", default: true },
        },
      },

      // ── Customer ──
      Customer: {
        type: "object",
        properties: {
          id:           { type: "integer" },
          code:         { type: "string", example: "CUST-001" },
          customerType: { type: "string", enum: ["Individual","Legal"] },
          name:         { type: "string" },
          mobile:       { type: "string" },
          email:        { type: "string" },
          dob:          { type: "string", format: "date", nullable: true },
          accountNo:    { type: "string" },
          address:      { type: "string" },
          clientId:     { type: "integer" },
          branchId:     { type: "integer", nullable: true },
          status:       { type: "boolean" },
          createdAt:    { type: "string", format: "date-time" },
        },
      },
      CustomerInput: {
        type: "object", required: ["name","mobile","clientId"],
        properties: {
          customerType: { type: "string", enum: ["Individual","Legal"], default: "Individual" },
          name:         { type: "string" },
          mobile:       { type: "string", example: "9876543210" },
          email:        { type: "string" },
          dob:          { type: "string", format: "date" },
          accountNo:    { type: "string" },
          address:      { type: "string" },
          clientId:     { type: "integer" },
          branchId:     { type: "integer" },
          status:       { type: "boolean", default: true },
        },
      },

      // ── Document Type ──
      DocumentType: {
        type: "object",
        properties: {
          id:             { type: "integer" },
          code:           { type: "string", example: "DOC-001" },
          name:           { type: "string", example: "Aadhaar Card" },
          category:       { type: "string", enum: ["KYC","Loan","Collateral","Others"] },
          allowedFormats: { type: "array", items: { type: "string" }, example: ["JPG","PNG","PDF"] },
          maxFileSizeMB:  { type: "number", example: 5 },
          isMandatory:    { type: "boolean" },
          retentionYears: { type: "integer", nullable: true },
          icon:           { type: "string" },
          color:          { type: "string" },
          status:         { type: "boolean" },
        },
      },
      DocumentTypeInput: {
        type: "object", required: ["name","allowedFormats"],
        properties: {
          name:           { type: "string" },
          category:       { type: "string", enum: ["KYC","Loan","Collateral","Others"] },
          allowedFormats: { type: "array", items: { type: "string" } },
          maxFileSizeMB:  { type: "number", default: 5 },
          isMandatory:    { type: "boolean", default: true },
          retentionYears: { type: "integer" },
          icon:           { type: "string" },
          color:          { type: "string" },
          status:         { type: "boolean", default: true },
        },
      },

      // ── Upload ──
      Upload: {
        type: "object",
        properties: {
          id:          { type: "integer" },
          drn:         { type: "string", example: "DRN-20250101-00001" },
          clientId:    { type: "integer" },
          branchId:    { type: "integer", nullable: true },
          customerId:  { type: "integer" },
          docTypeId:   { type: "integer" },
          fileName:    { type: "string" },
          fileExt:     { type: "string" },
          fileSizeMB:  { type: "number" },
          hash:        { type: "string" },
          remarks:     { type: "string" },
          uploadedBy:  { type: "string" },
          uploadedAt:  { type: "string", format: "date-time" },
          isDuplicate: { type: "boolean" },
          isDeleted:   { type: "boolean" },
        },
      },

      // ── User ──
      User: {
        type: "object",
        properties: {
          id:               { type: "integer" },
          username:         { type: "string" },
          fullName:         { type: "string" },
          email:            { type: "string" },
          mobile:           { type: "string" },
          role:             { type: "string", enum: ["Admin","Manager","Officer","DataEntry","Viewer"] },
          assignedClientId: { type: "integer", nullable: true },
          assignedBranchId: { type: "integer", nullable: true },
          status:           { type: "boolean" },
          isLocked:         { type: "boolean" },
          failedAttempts:   { type: "integer" },
          lastLogin:        { type: "string", format: "date-time", nullable: true },
          createdAt:        { type: "string", format: "date-time" },
        },
      },
      UserInput: {
        type: "object", required: ["fullName","username","email","password"],
        properties: {
          fullName:         { type: "string" },
          username:         { type: "string" },
          email:            { type: "string" },
          mobile:           { type: "string" },
          password:         { type: "string", minLength: 8 },
          role:             { type: "string", enum: ["Admin","Manager","Officer","DataEntry","Viewer"] },
          assignedClientId: { type: "integer" },
          assignedBranchId: { type: "integer" },
          status:           { type: "boolean", default: true },
        },
      },

      // ── Error ──
      Error: {
        type: "object",
        properties: { message: { type: "string" } },
      },

      // ── Report Summary ──
      UploadLogSummary: {
        type: "object",
        properties: {
          total:       { type: "integer" },
          totalSizeMB: { type: "number" },
          duplicates:  { type: "integer" },
          byDocType:   { type: "object", additionalProperties: { type: "integer" } },
        },
      },
      AuditLogSummary: {
        type: "object",
        properties: {
          total:            { type: "integer" },
          uniqueUsers:      { type: "integer" },
          actionBreakdown:  { type: "object", additionalProperties: { type: "integer" } },
          retentionYears:   { type: "integer" },
        },
      },
    },
  },

  // ── Global security (all routes need Bearer except login) ──
  security: [{ BearerAuth: [] }],

  paths: {

    // ═══════════════════ AUTH ═══════════════════
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User login",
        security: [],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } } },
        responses: {
          200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          401: { description: "Invalid credentials" },
          403: { description: "Account locked or inactive" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "User logout",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { username: { type: "string" } } } } } },
        responses: { 200: { description: "Logged out successfully" } },
      },
    },

    // ═══════════════════ CLIENTS ═══════════════════
    "/api/clients": {
      get: {
        tags: ["Clients"],
        summary: "List all clients",
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["active","inactive"] } },
          { name: "type",   in: "query", schema: { type: "string", enum: ["Co-op Bank","Society","NBFC","Corporate"] } },
        ],
        responses: { 200: { description: "List of clients", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Client" } } } } } },
      },
      post: {
        tags: ["Clients"],
        summary: "Create a new client",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ClientInput" } } } },
        responses: {
          201: { description: "Client created" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/clients/{id}": {
      get: {
        tags: ["Clients"], summary: "Get client by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Client object" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Clients"], summary: "Update client",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ClientInput" } } } },
        responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
      },
    },
    "/api/clients/{id}/toggle-status": {
      patch: {
        tags: ["Clients"], summary: "Toggle client active/inactive status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Status toggled" }, 400: { description: "Cannot deactivate — active branches exist" } },
      },
    },
    "/api/clients/{id}/deactivate": {
      patch: {
        tags: ["Clients"], summary: "Soft-delete (deactivate) client",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deactivated" }, 400: { description: "Cannot deactivate" } },
      },
    },

    // ═══════════════════ BRANCHES ═══════════════════
    "/api/branches": {
      get: {
        tags: ["Branches"], summary: "List all branches",
        parameters: [
          { name: "clientId", in: "query", schema: { type: "integer" } },
          { name: "status",   in: "query", schema: { type: "string", enum: ["active","inactive"] } },
        ],
        responses: { 200: { description: "List of branches", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Branch" } } } } } },
      },
      post: {
        tags: ["Branches"], summary: "Create branch",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/BranchInput" } } } },
        responses: { 201: { description: "Branch created" }, 400: { description: "Validation error" } },
      },
    },
    "/api/branches/{id}": {
      get: {
        tags: ["Branches"], summary: "Get branch by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Branch object" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Branches"], summary: "Update branch",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/BranchInput" } } } },
        responses: { 200: { description: "Updated" } },
      },
    },
    "/api/branches/{id}/toggle-status": {
      patch: {
        tags: ["Branches"], summary: "Toggle branch status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Status toggled" } },
      },
    },
    "/api/branches/{id}/deactivate": {
      patch: {
        tags: ["Branches"], summary: "Deactivate branch",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deactivated" } },
      },
    },

    // ═══════════════════ CUSTOMERS ═══════════════════
    "/api/customers": {
      get: {
        tags: ["Customers"], summary: "List all customers",
        parameters: [
          { name: "clientId",  in: "query", schema: { type: "integer" } },
          { name: "branchId",  in: "query", schema: { type: "integer" } },
          { name: "status",    in: "query", schema: { type: "string", enum: ["active","inactive"] } },
        ],
        responses: { 200: { description: "List of customers", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Customer" } } } } } },
      },
      post: {
        tags: ["Customers"], summary: "Create customer",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CustomerInput" } } } },
        responses: { 201: { description: "Customer created" }, 400: { description: "Validation error" } },
      },
    },
    "/api/customers/{id}": {
      get: {
        tags: ["Customers"], summary: "Get customer by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Customer object" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Customers"], summary: "Update customer",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CustomerInput" } } } },
        responses: { 200: { description: "Updated" } },
      },
    },
    "/api/customers/{id}/toggle-status": {
      patch: {
        tags: ["Customers"], summary: "Toggle customer status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Status toggled" } },
      },
    },
    "/api/customers/{id}/deactivate": {
      patch: {
        tags: ["Customers"], summary: "Deactivate customer",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deactivated" } },
      },
    },

    // ═══════════════════ DOCUMENT TYPES ═══════════════════
    "/api/document-types": {
      get: {
        tags: ["Document Types"], summary: "List all document types",
        parameters: [
          { name: "status",   in: "query", schema: { type: "string", enum: ["active","inactive"] } },
          { name: "required", in: "query", schema: { type: "string", enum: ["true","false"] } },
          { name: "category", in: "query", schema: { type: "string", enum: ["KYC","Loan","Collateral","Others"] } },
        ],
        responses: { 200: { description: "List of document types", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/DocumentType" } } } } } },
      },
      post: {
        tags: ["Document Types"], summary: "Create document type",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/DocumentTypeInput" } } } },
        responses: { 201: { description: "Created" }, 400: { description: "Validation error" } },
      },
    },
    "/api/document-types/{id}": {
      get: {
        tags: ["Document Types"], summary: "Get document type by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Document type object" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Document Types"], summary: "Update document type",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/DocumentTypeInput" } } } },
        responses: { 200: { description: "Updated" } },
      },
    },
    "/api/document-types/{id}/toggle-status": {
      patch: {
        tags: ["Document Types"], summary: "Toggle document type status",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Status toggled" } },
      },
    },
    "/api/document-types/{id}/deactivate": {
      patch: {
        tags: ["Document Types"], summary: "Deactivate document type",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Deactivated" } },
      },
    },

    // ═══════════════════ UPLOADS ═══════════════════
    "/api/uploads": {
      get: {
        tags: ["Uploads"], summary: "List all uploads (without file data)",
        parameters: [
          { name: "clientId",   in: "query", schema: { type: "integer" } },
          { name: "branchId",   in: "query", schema: { type: "integer" } },
          { name: "customerId", in: "query", schema: { type: "integer" } },
          { name: "docTypeId",  in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "List of uploads", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Upload" } } } } } },
      },
      post: {
        tags: ["Uploads"], summary: "Upload a document image (base64)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object", required: ["customerId","docTypeId","fileName","fileData"],
                properties: {
                  clientId:   { type: "integer" },
                  branchId:   { type: "integer" },
                  customerId: { type: "integer" },
                  docTypeId:  { type: "integer" },
                  fileName:   { type: "string" },
                  fileExt:    { type: "string", example: "JPG" },
                  fileSizeMB: { type: "number" },
                  hash:       { type: "string" },
                  remarks:    { type: "string" },
                  fileData:   { type: "string", description: "Base64 encoded file" },
                  uploadedBy: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Upload successful, DRN returned" },
          400: { description: "Validation error (format, size, inactive customer/doctype)" },
        },
      },
    },
    "/api/uploads/{id}": {
      get: {
        tags: ["Uploads"], summary: "Get upload by ID (includes file data)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Upload with file data" }, 404: { description: "Not found" } },
      },
    },
    "/api/uploads/{id}/file": {
      get: {
        tags: ["Uploads"], summary: "Get raw file data for an upload",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "File data, name, ext" } },
      },
    },
    "/api/uploads/{id}/view": {
      post: {
        tags: ["Uploads"], summary: "Log a document view event in audit trail",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { viewedBy: { type: "string" } } } } } },
        responses: { 200: { description: "View logged" } },
      },
    },
    "/api/uploads/{id}/delete": {
      patch: {
        tags: ["Uploads"], summary: "Soft-delete (archive) an upload",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { reason: { type: "string" }, deletedBy: { type: "string" } },
              },
            },
          },
        },
        responses: { 200: { description: "Archived" }, 404: { description: "Not found" } },
      },
    },

    // ═══════════════════ USERS ═══════════════════
    "/api/users": {
      get: {
        tags: ["Users"], summary: "List all users",
        parameters: [
          { name: "role",   in: "query", schema: { type: "string", enum: ["Admin","Manager","Officer","DataEntry","Viewer"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active","inactive"] } },
        ],
        responses: { 200: { description: "List of users", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } } } } },
      },
      post: {
        tags: ["Users"], summary: "Create new user",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UserInput" } } } },
        responses: { 201: { description: "User created" }, 400: { description: "Username/email exists or validation error" } },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"], summary: "Get user by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "User object" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Users"], summary: "Update user details / role",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object", required: ["fullName","email"],
                properties: {
                  fullName:         { type: "string" },
                  email:            { type: "string" },
                  mobile:           { type: "string" },
                  role:             { type: "string" },
                  assignedClientId: { type: "integer" },
                  assignedBranchId: { type: "integer" },
                  status:           { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
      },
    },
    "/api/users/{id}/toggle-status": {
      patch: {
        tags: ["Users"], summary: "Toggle user active/inactive",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Status toggled" } },
      },
    },
    "/api/users/{id}/reset-password": {
      patch: {
        tags: ["Users"], summary: "Reset user password (Admin)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["newPassword"], properties: { newPassword: { type: "string", minLength: 8 } } } } },
        },
        responses: { 200: { description: "Password reset" }, 400: { description: "Password too short" } },
      },
    },
    "/api/users/{id}/unlock": {
      patch: {
        tags: ["Users"], summary: "Unlock a locked user account",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "User unlocked" }, 404: { description: "Not found" } },
      },
    },

    // ═══════════════════ AUDIT LOG ═══════════════════
    "/api/audit-log": {
      get: {
        tags: ["Audit Log"], summary: "Get last 200 audit log entries",
        responses: {
          200: {
            description: "Audit log entries",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id:         { type: "integer" },
                      action:     { type: "string" },
                      entity:     { type: "string" },
                      entity_id:  { type: "integer" },
                      by_user:    { type: "string" },
                      detail:     { type: "string" },
                      role:       { type: "string" },
                      old_val:    { type: "string" },
                      new_val:    { type: "string" },
                      ip_address: { type: "string" },
                      status:     { type: "string" },
                      created_at: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ═══════════════════ USER GROUPS ═══════════════════
    "/api/user-groups": {
      get: {
        tags: ["User Groups"], summary: "List all user groups",
        responses: { 200: { description: "List of groups" } },
      },
      post: {
        tags: ["User Groups"], summary: "Create a user group",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object", required: ["name"],
                properties: {
                  name:        { type: "string" },
                  description: { type: "string" },
                  clientId:    { type: "integer" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Group created" } },
      },
    },
    "/api/user-groups/{id}": {
      get: {
        tags: ["User Groups"], summary: "Get group by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { 200: { description: "Group object" }, 404: { description: "Not found" } },
      },
    },
    "/api/user-groups/{id}/add-user": {
      patch: {
        tags: ["User Groups"], summary: "Add user to group",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { userId: { type: "integer" } } } } } },
        responses: { 200: { description: "User added" } },
      },
    },
    "/api/user-groups/{id}/remove-user": {
      patch: {
        tags: ["User Groups"], summary: "Remove user from group",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { userId: { type: "integer" } } } } } },
        responses: { 200: { description: "User removed" } },
      },
    },

    // ═══════════════════ REPORTS ═══════════════════
    "/api/reports/upload-log": {
      get: {
        tags: ["Reports"], summary: "FR-RP-01 — Image Upload Log Report",
        description: "Available to: Admin, Manager, Officer. Returns upload records with summary row.",
        parameters: [
          { name: "dateFrom",   in: "query", schema: { type: "string", format: "date" }, description: "Filter from date" },
          { name: "dateTo",     in: "query", schema: { type: "string", format: "date" }, description: "Filter to date" },
          { name: "clientId",   in: "query", schema: { type: "integer" } },
          { name: "branchId",   in: "query", schema: { type: "integer" } },
          { name: "docTypeId",  in: "query", schema: { type: "integer" } },
          { name: "uploadedBy", in: "query", schema: { type: "string" } },
          { name: "status",     in: "query", schema: { type: "string", enum: ["ok","dup"] } },
        ],
        responses: {
          200: {
            description: "Upload log data with summary",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data:    { type: "array", items: { $ref: "#/components/schemas/Upload" } },
                    summary: { $ref: "#/components/schemas/UploadLogSummary" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/reports/upload-log/export/csv": {
      get: {
        tags: ["Reports"], summary: "FR-RP-01 — Export Upload Log as CSV",
        description: "Downloads full upload log as CSV file (no filters — all records).",
        responses: {
          200: { description: "CSV file download", content: { "text/csv": { schema: { type: "string" } } } },
        },
      },
    },
    "/api/reports/audit-log": {
      get: {
        tags: ["Reports"], summary: "FR-RP-02 — System Audit / Activity Log Report",
        description: "Available to: Admin only. Includes Role, Old Value, New Value, IP Address, Status columns.",
        parameters: [
          { name: "dateFrom",  in: "query", schema: { type: "string", format: "date" } },
          { name: "dateTo",    in: "query", schema: { type: "string", format: "date" } },
          { name: "user",      in: "query", schema: { type: "string" } },
          { name: "action",    in: "query", schema: { type: "string" }, description: "e.g. LOGIN, UPLOAD, DELETE" },
          { name: "entity",    in: "query", schema: { type: "string" }, description: "Module e.g. users, uploads" },
          { name: "ipAddress", in: "query", schema: { type: "string" } },
          { name: "status",    in: "query", schema: { type: "string", enum: ["success","failed"] } },
          { name: "limit",     in: "query", schema: { type: "integer", default: 1000 } },
        ],
        responses: {
          200: {
            description: "Audit log data with summary",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data:    { type: "array", items: { type: "object" } },
                    summary: { $ref: "#/components/schemas/AuditLogSummary" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/reports/audit-log/export/csv": {
      get: {
        tags: ["Reports"], summary: "FR-RP-02 — Export full Audit Log as CSV (compliance)",
        description: "Downloads complete audit log (no filters) as CSV for 7-year compliance retention.",
        responses: {
          200: { description: "CSV file download", content: { "text/csv": { schema: { type: "string" } } } },
        },
      },
    },
  },

  // ── Tag groups (controls sidebar order in Swagger UI) ──
  tags: [
    { name: "Auth",           description: "Authentication — login and logout" },
    { name: "Clients",        description: "Client master management (Admin only)" },
    { name: "Branches",       description: "Branch management under clients" },
    { name: "Customers",      description: "Customer/member records" },
    { name: "Document Types", description: "Document type master (KYC, Loan, etc.)" },
    { name: "Uploads",        description: "Document image upload and retrieval" },
    { name: "Users",          description: "User management and RBAC" },
    { name: "User Groups",    description: "User group management (FR-UM-04)" },
    { name: "Audit Log",      description: "Raw audit log access" },
    { name: "Reports",        description: "FR-RP-01 Upload Log & FR-RP-02 Audit Log reports" },
  ],
};

module.exports = swaggerDefinition;

// ═══════════════════════════════════════════════════════════════════
// HOW TO USE IN index.js:
//
// 1. Save this file as: D:\DMS Project\Server\swagger-docs.js
//
// 2. In index.js, REPLACE the swagger block with:
//
//    const swaggerDefinition = require("./swagger-docs");
//    const swaggerUi = require("swagger-ui-express");
//
//    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition, {
//      customSiteTitle: "DMS API Docs",
//      customCss: `.swagger-ui .topbar{background:#0b1120}
//        .swagger-ui .topbar-wrapper img{display:none}
//        .swagger-ui .topbar-wrapper::before{content:"DMS API — AVS InSoTech";
//        color:#f5c842;font-size:18px;font-weight:700;}`,
//      swaggerOptions: { persistAuthorization: true },
//    }));
//    app.get("/api-docs.json", (req, res) => res.json(swaggerDefinition));
//
// 3. Remove the swaggerJsdoc require and swaggerSpec variable entirely.
//
// 4. Restart: node index.js
// 5. Open: http://localhost:5000/api-docs
// ═══════════════════════════════════════════════════════════════════
