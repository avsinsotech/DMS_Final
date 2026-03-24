// require("dotenv").config();
// const crypto       = require("crypto");
// const express      = require("express");
// const cors         = require("cors");
// const bcrypt       = require("bcryptjs");
// const jwt          = require("jsonwebtoken");
// const pool         = require("./db");
// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi    = require("swagger-ui-express");

// const app = express();
// app.use(cors({ origin: "*" }));
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// const JWT_SECRET = process.env.JWT_SECRET || "dms_secret_2024";

// // ─────────────────────────────────────────────
// // SWAGGER
// // ─────────────────────────────────────────────
// const swaggerSpec = swaggerJsdoc({
//   definition: {
//     openapi: "3.0.0",
//     info: { title: "DMS API — AVS InSoTech (PostgreSQL)", version: "2.0.0" },
//     servers: [{ url: "http://localhost:5000" }],
//   },
//   apis: [],
// });
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//   customSiteTitle: "DMS API Docs",
//   customCss: `.swagger-ui .topbar{background:#0b1120}.swagger-ui .topbar-wrapper img{display:none}.swagger-ui .topbar-wrapper::before{content:"DMS API — AVS InSoTech";color:#f5c842;font-size:18px;font-weight:700;}`,
// }));
// app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));


// // ─────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────
// async function nextCode(table, prefix, pad = 3) {
//   const r = await pool.query(`SELECT COUNT(*) FROM ${table}`);
//   return `${prefix}-${String(parseInt(r.rows[0].count) + 1).padStart(pad, "0")}`;
// }

// function generateDRN(seq) {
//   const d  = new Date();
//   const dt = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
//   return `DRN-${dt}-${String(seq).padStart(5,"0")}`;
// }

// async function addAudit(action, byUser, detail, entity = null, entityId = null) {
//   await pool.query(
//     "INSERT INTO audit_log (action,entity,entity_id,by_user,detail) VALUES ($1,$2,$3,$4,$5)",
//     [action, entity, entityId, byUser, detail]
//   ).catch(() => {});
// }

// // ── Map DB rows to camelCase for frontend ──
// const mapClient = r => ({
//   id: r.id, code: r.code, name: r.name, type: r.type,
//   regNo: r.reg_no, address: r.address,
//   contact: { name: r.contact_name, mobile: r.contact_mobile, email: r.contact_email },
//   status: r.status, logo: r.logo, createdAt: r.created_at,
// });

// const mapBranch = r => ({
//   id: r.id, code: r.code, name: r.name, clientId: r.client_id,
//   address: r.address, manager: r.manager, contact: r.contact,
//   status: r.status, createdAt: r.created_at,
// });

// const mapCustomer = r => ({
//   id: r.id, code: r.code, customerType: r.customer_type,
//   name: r.name, mobile: r.mobile, email: r.email,
//   dob: r.dob, accountNo: r.account_no, address: r.address,
//   clientId: r.client_id, branchId: r.branch_id,
//   status: r.status, createdAt: r.created_at,
// });

// const mapDocType = r => ({
//   id: r.id, code: r.code, name: r.name, category: r.category,
//   allowedFormats: r.allowed_formats, maxFileSizeMB: r.max_file_size_mb,
//   isMandatory: r.is_mandatory, retentionYears: r.retention_years,
//   icon: r.icon, color: r.color, status: r.status,
// });

// const mapUpload = r => ({
//   id: r.id, drn: r.drn, clientId: r.client_id, branchId: r.branch_id,
//   customerId: r.customer_id, docTypeId: r.doc_type_id,
//   fileName: r.file_name, fileExt: r.file_ext, fileSizeMB: r.file_size_mb,
//   hash: r.file_hash, fileData: r.file_data, remarks: r.remarks,
//   uploadedBy: r.uploaded_by, uploadedAt: r.uploaded_at,
//   isDuplicate: r.is_duplicate, isDeleted: r.is_deleted,
// });

// const mapUser = r => ({
//   id: r.id, username: r.username, fullName: r.full_name,
//   email: r.email, mobile: r.mobile, role: r.role,
//   assignedClientId: r.assigned_client_id, assignedBranchId: r.assigned_branch_id,
//   status: r.status, isLocked: r.is_locked, failedAttempts: r.failed_attempts,
//   lastLogin: r.last_login, createdAt: r.created_at,
// });


// // ═══════════════════════════════════════════
// // AUTH
// // ═══════════════════════════════════════════

// app.post("/api/auth/login", async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password)
//     return res.status(400).json({ message: "Username and password are required" });
//   try {
//     const r    = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
//     const user = r.rows[0];
//     if (!user)        return res.status(401).json({ message: "Invalid username or password" });
//     if (user.is_locked) return res.status(403).json({ message: "Account is locked. Contact your administrator." });
//     if (!user.status)   return res.status(403).json({ message: "Account is inactive. Contact your administrator." });

//     const valid = await bcrypt.compare(password, user.password_hash);
//     if (!valid) {
//       const attempts = (user.failed_attempts || 0) + 1;
//       const lock     = attempts >= 5;
//       await pool.query("UPDATE users SET failed_attempts=$1, is_locked=$2 WHERE id=$3", [attempts, lock, user.id]);
//       if (lock) {
//         setTimeout(async () => {
//           await pool.query("UPDATE users SET is_locked=FALSE, failed_attempts=0 WHERE id=$1", [user.id]);
//         }, 30 * 60 * 1000);
//         return res.status(403).json({ message: "Account locked after 5 failed attempts. Try again in 30 minutes." });
//       }
//       return res.status(401).json({ message: `Invalid password. ${5 - attempts} attempt(s) remaining.` });
//     }

//     await pool.query("UPDATE users SET failed_attempts=0, is_locked=FALSE, last_login=NOW() WHERE id=$1", [user.id]);
//     await addAudit("LOGIN", username, `User ${username} logged in`, "users", user.id);

//     const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
//     res.json({ message: "Login successful", token, user: mapUser(user) });
//   } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
// });

// app.post("/api/auth/logout", async (req, res) => {
//   const { username } = req.body;
//   await addAudit("LOGOUT", username || "Unknown", `User ${username} logged out`);
//   res.json({ message: "Logged out successfully" });
// });


// // ═══════════════════════════════════════════
// // CLIENTS
// // ═══════════════════════════════════════════

// app.get("/api/clients", async (req, res) => {
//   try {
//     const { status, type } = req.query;
//     let q = "SELECT * FROM clients WHERE 1=1";
//     const p = [];
//     if (status === "active")   { p.push(true);  q += ` AND status=$${p.length}`; }
//     if (status === "inactive") { p.push(false); q += ` AND status=$${p.length}`; }
//     if (type)                  { p.push(type);  q += ` AND type=$${p.length}`; }
//     q += " ORDER BY id";
//     const r = await pool.query(q, p);
//     res.json(r.rows.map(mapClient));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.get("/api/clients/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM clients WHERE id=$1", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Client not found" });
//     res.json(mapClient(r.rows[0]));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.post("/api/clients", async (req, res) => {
//   try {
//     const { name, type, regNo, address, contact, status, logo } = req.body;
//     if (!name || !regNo) return res.status(400).json({ message: "Name and Registration No required" });
//     if (contact?.mobile && contact.mobile.length !== 10)
//       return res.status(400).json({ message: "Mobile must be 10 digits" });
//     const code = await nextCode("clients", "CLT");
//     const r    = await pool.query(
//       `INSERT INTO clients (code,name,type,reg_no,address,contact_name,contact_mobile,contact_email,status,logo)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
//       [code, name, type||"Co-op Bank", regNo, address||"",
//        contact?.name||"", contact?.mobile||"", contact?.email||"",
//        status??true, logo||null]
//     );
//     await addAudit("CREATE_CLIENT", "admin", `Created client ${name}`, "clients", r.rows[0].id);
//     res.status(201).json({ message: "Client created successfully", data: mapClient(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.put("/api/clients/:id", async (req, res) => {
//   try {
//     const { name, type, regNo, address, contact, status, logo } = req.body;
//     if (!name || !regNo) return res.status(400).json({ message: "Name and Registration No required" });
//     const r = await pool.query(
//       `UPDATE clients SET name=$1,type=$2,reg_no=$3,address=$4,
//        contact_name=$5,contact_mobile=$6,contact_email=$7,status=$8,logo=$9,updated_at=NOW()
//        WHERE id=$10 RETURNING *`,
//       [name, type, regNo, address||"",
//        contact?.name||"", contact?.mobile||"", contact?.email||"",
//        status, logo||null, req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "Client not found" });
//     res.json({ message: "Client updated successfully", data: mapClient(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/clients/:id/toggle-status", async (req, res) => {
//   try {
//     const cr = await pool.query("SELECT * FROM clients WHERE id=$1", [req.params.id]);
//     if (!cr.rows[0]) return res.status(404).json({ message: "Client not found" });
//     if (cr.rows[0].status) {
//       const br = await pool.query("SELECT COUNT(*) FROM branches WHERE client_id=$1 AND status=TRUE", [req.params.id]);
//       if (parseInt(br.rows[0].count) > 0)
//         return res.status(400).json({ message: `Cannot deactivate: client has ${br.rows[0].count} active branch(es)` });
//     }
//     const r = await pool.query("UPDATE clients SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapClient(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/clients/:id/deactivate", async (req, res) => {
//   try {
//     const br = await pool.query("SELECT COUNT(*) FROM branches WHERE client_id=$1 AND status=TRUE", [req.params.id]);
//     if (parseInt(br.rows[0].count) > 0)
//       return res.status(400).json({ message: `Cannot deactivate: client has ${br.rows[0].count} active branch(es)` });
//     const r = await pool.query("UPDATE clients SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Client not found" });
//     res.json({ message: "Client deactivated", data: mapClient(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });


// // ═══════════════════════════════════════════
// // BRANCHES
// // ═══════════════════════════════════════════

// app.get("/api/branches", async (req, res) => {
//   try {
//     const { clientId, status } = req.query;
//     let q = "SELECT * FROM branches WHERE 1=1";
//     const p = [];
//     if (clientId)              { p.push(clientId); q += ` AND client_id=$${p.length}`; }
//     if (status === "active")   { p.push(true);     q += ` AND status=$${p.length}`; }
//     if (status === "inactive") { p.push(false);    q += ` AND status=$${p.length}`; }
//     q += " ORDER BY id";
//     const r = await pool.query(q, p);
//     res.json(r.rows.map(mapBranch));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.get("/api/branches/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM branches WHERE id=$1", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
//     res.json(mapBranch(r.rows[0]));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.post("/api/branches", async (req, res) => {
//   try {
//     const { name, clientId, address, manager, contact, status } = req.body;
//     if (!name || !clientId || !contact)
//       return res.status(400).json({ message: "Name, Client and Contact are required" });
//     if (contact.length !== 10) return res.status(400).json({ message: "Contact must be 10 digits" });
//     const ce = await pool.query("SELECT id FROM clients WHERE id=$1", [clientId]);
//     if (!ce.rows[0]) return res.status(400).json({ message: "Invalid Client ID" });
//     const code = await nextCode("branches", "BR");
//     const r    = await pool.query(
//       "INSERT INTO branches (code,name,client_id,address,manager,contact,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
//       [code, name, clientId, address||"", manager||"", contact, status??true]
//     );
//     res.status(201).json({ message: "Branch created successfully", data: mapBranch(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.put("/api/branches/:id", async (req, res) => {
//   try {
//     const { name, clientId, address, manager, contact, status } = req.body;
//     if (!name || !contact) return res.status(400).json({ message: "Name and Contact are required" });
//     if (contact.length !== 10) return res.status(400).json({ message: "Contact must be 10 digits" });
//     const r = await pool.query(
//       "UPDATE branches SET name=$1,client_id=$2,address=$3,manager=$4,contact=$5,status=$6,updated_at=NOW() WHERE id=$7 RETURNING *",
//       [name, clientId, address||"", manager||"", contact, status, req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
//     res.json({ message: "Branch updated successfully", data: mapBranch(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/branches/:id/toggle-status", async (req, res) => {
//   try {
//     const r = await pool.query("UPDATE branches SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
//     res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapBranch(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/branches/:id/deactivate", async (req, res) => {
//   try {
//     const r = await pool.query("UPDATE branches SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
//     res.json({ message: "Branch deactivated", data: mapBranch(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });


// // ═══════════════════════════════════════════
// // CUSTOMERS
// // ═══════════════════════════════════════════

// app.get("/api/customers", async (req, res) => {
//   try {
//     const { clientId, branchId, status } = req.query;
//     let q = "SELECT * FROM customers WHERE 1=1";
//     const p = [];
//     if (clientId)              { p.push(clientId); q += ` AND client_id=$${p.length}`; }
//     if (branchId)              { p.push(branchId); q += ` AND branch_id=$${p.length}`; }
//     if (status === "active")   { p.push(true);     q += ` AND status=$${p.length}`; }
//     if (status === "inactive") { p.push(false);    q += ` AND status=$${p.length}`; }
//     q += " ORDER BY id";
//     const r = await pool.query(q, p);
//     res.json(r.rows.map(mapCustomer));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.get("/api/customers/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM customers WHERE id=$1", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
//     res.json(mapCustomer(r.rows[0]));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.post("/api/customers", async (req, res) => {
//   try {
//     const { name, mobile, email, dob, accountNo, address, clientId, branchId, status, customerType } = req.body;
//     if (!name)   return res.status(400).json({ message: "Name is required" });
//     if (!mobile) return res.status(400).json({ message: "Mobile is required" });
//     if (mobile.length !== 10) return res.status(400).json({ message: "Mobile must be 10 digits" });
//     if (!clientId) return res.status(400).json({ message: "Client is required" });
//     const ce = await pool.query("SELECT id FROM clients WHERE id=$1 AND status=TRUE", [clientId]);
//     if (!ce.rows[0]) return res.status(400).json({ message: "Invalid or inactive Client" });
//     const code = await nextCode("customers", "CUST");
//     const r    = await pool.query(
//       `INSERT INTO customers (code,customer_type,name,mobile,email,dob,account_no,address,client_id,branch_id,status)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
//       [code, customerType||"Individual", name, mobile, email||"",
//        dob||null, accountNo||"", address||"", clientId, branchId||null, status??true]
//     );
//     res.status(201).json({ message: "Customer created successfully", data: mapCustomer(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.put("/api/customers/:id", async (req, res) => {
//   try {
//     const { name, mobile, email, dob, accountNo, address, clientId, branchId, status, customerType } = req.body;
//     if (!name || !mobile) return res.status(400).json({ message: "Name and Mobile are required" });
//     if (mobile.length !== 10) return res.status(400).json({ message: "Mobile must be 10 digits" });
//     const r = await pool.query(
//       `UPDATE customers SET customer_type=$1,name=$2,mobile=$3,email=$4,dob=$5,
//        account_no=$6,address=$7,client_id=$8,branch_id=$9,status=$10,updated_at=NOW()
//        WHERE id=$11 RETURNING *`,
//       [customerType||"Individual", name, mobile, email||"", dob||null,
//        accountNo||"", address||"", clientId, branchId||null, status, req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
//     res.json({ message: "Customer updated successfully", data: mapCustomer(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/customers/:id/toggle-status", async (req, res) => {
//   try {
//     const r = await pool.query("UPDATE customers SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
//     res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapCustomer(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/customers/:id/deactivate", async (req, res) => {
//   try {
//     const r = await pool.query("UPDATE customers SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
//     res.json({ message: "Customer deactivated", data: mapCustomer(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });


// // ═══════════════════════════════════════════
// // DOCUMENT TYPES
// // ═══════════════════════════════════════════

// app.get("/api/document-types", async (req, res) => {
//   try {
//     const { status, required, category } = req.query;
//     let q = "SELECT * FROM document_types WHERE 1=1";
//     const p = [];
//     if (status === "active")   { p.push(true);  q += ` AND status=$${p.length}`; }
//     if (status === "inactive") { p.push(false); q += ` AND status=$${p.length}`; }
//     if (required === "true")   { p.push(true);  q += ` AND is_mandatory=$${p.length}`; }
//     if (required === "false")  { p.push(false); q += ` AND is_mandatory=$${p.length}`; }
//     if (category)              { p.push(category); q += ` AND category=$${p.length}`; }
//     q += " ORDER BY id";
//     const r = await pool.query(q, p);
//     res.json(r.rows.map(mapDocType));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.get("/api/document-types/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM document_types WHERE id=$1", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
//     res.json(mapDocType(r.rows[0]));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.post("/api/document-types", async (req, res) => {
//   try {
//     const { name, category, allowedFormats, maxFileSizeMB, isMandatory, retentionYears, icon, color, status } = req.body;
//     if (!name) return res.status(400).json({ message: "Name is required" });
//     if (!allowedFormats?.length) return res.status(400).json({ message: "At least one format required" });
//     const code = await nextCode("document_types", "DOC");
//     const r    = await pool.query(
//       `INSERT INTO document_types (code,name,category,allowed_formats,max_file_size_mb,is_mandatory,retention_years,icon,color,status)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
//       [code, name, category||"Others", allowedFormats,
//        maxFileSizeMB||5, isMandatory??true, retentionYears||null,
//        icon||"📄", color||"#3d8ef0", status??true]
//     );
//     res.status(201).json({ message: "Document type created", data: mapDocType(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.put("/api/document-types/:id", async (req, res) => {
//   try {
//     const { name, category, allowedFormats, maxFileSizeMB, isMandatory, retentionYears, icon, color, status } = req.body;
//     if (!name) return res.status(400).json({ message: "Name is required" });
//     const r = await pool.query(
//       `UPDATE document_types SET name=$1,category=$2,allowed_formats=$3,max_file_size_mb=$4,
//        is_mandatory=$5,retention_years=$6,icon=$7,color=$8,status=$9,updated_at=NOW()
//        WHERE id=$10 RETURNING *`,
//       [name, category, allowedFormats, maxFileSizeMB, isMandatory, retentionYears||null, icon, color, status, req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
//     res.json({ message: "Document type updated", data: mapDocType(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/document-types/:id/toggle-status", async (req, res) => {
//   try {
//     const r = await pool.query("UPDATE document_types SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
//     res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapDocType(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/document-types/:id/deactivate", async (req, res) => {
//   try {
//     const r = await pool.query("UPDATE document_types SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
//     res.json({ message: "Document type deactivated", data: mapDocType(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });


// // ═══════════════════════════════════════════
// // UPLOADS
// // ═══════════════════════════════════════════

// app.get("/api/uploads", async (req, res) => {
//   try {
//     const { clientId, branchId, customerId, docTypeId } = req.query;
//     let q = "SELECT * FROM uploads WHERE is_deleted=FALSE";
//     const p = [];
//     if (clientId)   { p.push(clientId);   q += ` AND client_id=$${p.length}`; }
//     if (branchId)   { p.push(branchId);   q += ` AND branch_id=$${p.length}`; }
//     if (customerId) { p.push(customerId); q += ` AND customer_id=$${p.length}`; }
//     if (docTypeId)  { p.push(docTypeId);  q += ` AND doc_type_id=$${p.length}`; }
//     q += " ORDER BY uploaded_at DESC";
//     const r = await pool.query(q, p);
//     // Return without file_data for list (keep response light)
//     res.json(r.rows.map(row => ({ ...mapUpload(row), fileData: row.file_data ? "HAS_DATA" : null })));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.get("/api/uploads/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM uploads WHERE id=$1 AND is_deleted=FALSE", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
//     await addAudit("VIEW", "user", `Viewed upload ${r.rows[0].drn}`, "uploads", r.rows[0].id);
//     res.json(mapUpload(r.rows[0]));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.get("/api/uploads/:id/file", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT file_data,file_name,file_ext FROM uploads WHERE id=$1 AND is_deleted=FALSE", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
//     res.json({ fileData: r.rows[0].file_data, fileName: r.rows[0].file_name, fileExt: r.rows[0].file_ext });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.post("/api/uploads", async (req, res) => {
//   try {
//     const { clientId, branchId, customerId, docTypeId, fileName, fileExt, fileSizeMB, hash, remarks, fileData, uploadedBy } = req.body;
//     if (!customerId) return res.status(400).json({ message: "Customer ID is required" });
//     if (!docTypeId)  return res.status(400).json({ message: "Document Type is required" });
//     if (!fileName)   return res.status(400).json({ message: "File name is required" });
//     if (!fileData)   return res.status(400).json({ message: "File data is required" });

//     // Validate customer
//     const cust = await pool.query("SELECT * FROM customers WHERE id=$1", [customerId]);
//     if (!cust.rows[0])        return res.status(400).json({ message: "Customer not found" });
//     if (!cust.rows[0].status) return res.status(400).json({ message: "Customer is Inactive" });

//     // Validate document type
//     const dt = await pool.query("SELECT * FROM document_types WHERE id=$1", [docTypeId]);
//     if (!dt.rows[0])        return res.status(400).json({ message: "Document type not found" });
//     if (!dt.rows[0].status) return res.status(400).json({ message: "Document type is Inactive" });

//     // Format validation
//     const ext = (fileExt||"").toUpperCase();
//     if (dt.rows[0].allowed_formats && !dt.rows[0].allowed_formats.includes(ext))
//       return res.status(400).json({ message: `Format ${ext} not allowed. Allowed: ${dt.rows[0].allowed_formats.join(", ")}` });

//     // Size validation
//     if (dt.rows[0].max_file_size_mb && parseFloat(fileSizeMB) > dt.rows[0].max_file_size_mb)
//       return res.status(400).json({ message: `File too large. Max: ${dt.rows[0].max_file_size_mb} MB` });

//     // Duplicate check
//     const dup = await pool.query(
//       "SELECT id FROM uploads WHERE file_hash=$1 AND customer_id=$2 AND doc_type_id=$3 AND is_deleted=FALSE",
//       [hash, customerId, docTypeId]
//     );
//     const isDuplicate = dup.rows.length > 0;

//     // Generate DRN
//     const seqR = await pool.query("SELECT COUNT(*)+1 AS seq FROM uploads");
//     const drn  = generateDRN(parseInt(seqR.rows[0].seq));

//     const r = await pool.query(
//       `INSERT INTO uploads (drn,client_id,branch_id,customer_id,doc_type_id,file_name,file_ext,file_size_mb,file_hash,file_data,remarks,uploaded_by,is_duplicate)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
//       [drn, clientId, branchId||null, customerId, docTypeId,
//        fileName, ext, parseFloat(fileSizeMB)||0,
//        hash||"", fileData, remarks||"", uploadedBy||"System", isDuplicate]
//     );

//     await addAudit("UPLOAD", uploadedBy||"System", `Uploaded ${fileName} DRN:${drn}`, "uploads", r.rows[0].id);
//     res.status(201).json({
//       message: isDuplicate ? `⚠️ Duplicate detected. Saved as ${drn}` : `File uploaded. DRN: ${drn}`,
//       data: mapUpload(r.rows[0]),
//     });
//   } catch (err) { console.error(err); res.status(500).json({ message: err.message }); }
// });

// app.post("/api/uploads/:id/view", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT drn FROM uploads WHERE id=$1", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
//     await addAudit("VIEW", req.body?.viewedBy||"System", `Viewed ${r.rows[0].drn}`, "uploads", parseInt(req.params.id));
//     res.json({ message: "View logged" });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/uploads/:id/delete", async (req, res) => {
//   try {
//     const { reason, deletedBy } = req.body;
//     const r = await pool.query(
//       "UPDATE uploads SET is_deleted=TRUE,deleted_at=NOW(),deleted_by=$1,delete_reason=$2 WHERE id=$3 RETURNING *",
//       [deletedBy||"Admin", reason||"", req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
//     await addAudit("DELETE", deletedBy||"Admin", `Archived upload ${r.rows[0].drn}: ${reason}`, "uploads", r.rows[0].id);
//     res.json({ message: "Document archived (soft delete)", data: mapUpload(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });


// // ═══════════════════════════════════════════
// // USERS
// // ═══════════════════════════════════════════

// app.get("/api/users", async (req, res) => {
//   try {
//     const { role, status } = req.query;
//     let q = "SELECT * FROM users WHERE 1=1";
//     const p = [];
//     if (role)              { p.push(role);  q += ` AND role=$${p.length}`; }
//     if (status === "active")   { p.push(true);  q += ` AND status=$${p.length}`; }
//     if (status === "inactive") { p.push(false); q += ` AND status=$${p.length}`; }
//     q += " ORDER BY id";
//     const r = await pool.query(q, p);
//     res.json(r.rows.map(mapUser));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.get("/api/users/:id", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
//     res.json(mapUser(r.rows[0]));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.post("/api/users", async (req, res) => {
//   try {
//     const { fullName, username, email, mobile, password, role, assignedClientId, assignedBranchId, status } = req.body;
//     if (!fullName || !username || !email || !password)
//       return res.status(400).json({ message: "Full Name, Username, Email and Password are required" });
//     if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

//     const existing = await pool.query("SELECT id FROM users WHERE username=$1 OR email=$2", [username, email]);
//     if (existing.rows.length > 0) return res.status(400).json({ message: "Username or email already exists" });

//     const hash = await bcrypt.hash(password, 10);
//     const r    = await pool.query(
//       `INSERT INTO users (username,full_name,email,mobile,password_hash,role,assigned_client_id,assigned_branch_id,status)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
//       [username, fullName, email, mobile||"", hash, role||"Viewer",
//        assignedClientId||null, assignedBranchId||null, status??true]
//     );
//     await addAudit("CREATE_USER", "Admin", `Created user ${username} (${role})`, "users", r.rows[0].id);
//     res.status(201).json({ message: "User created successfully", data: mapUser(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.put("/api/users/:id", async (req, res) => {
//   try {
//     const { fullName, email, mobile, role, assignedClientId, assignedBranchId, status } = req.body;
//     if (!fullName || !email) return res.status(400).json({ message: "Full Name and Email are required" });
//     const r = await pool.query(
//       `UPDATE users SET full_name=$1,email=$2,mobile=$3,role=$4,
//        assigned_client_id=$5,assigned_branch_id=$6,status=$7,updated_at=NOW()
//        WHERE id=$8 RETURNING *`,
//       [fullName, email, mobile||"", role, assignedClientId||null, assignedBranchId||null, status, req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
//     res.json({ message: "User updated successfully", data: mapUser(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/users/:id/toggle-status", async (req, res) => {
//   try {
//     const r = await pool.query("UPDATE users SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
//     if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
//     await addAudit(r.rows[0].status?"ACTIVATE_USER":"DEACTIVATE_USER", "Admin", `User ${r.rows[0].username} status changed`, "users", r.rows[0].id);
//     res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapUser(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/users/:id/reset-password", async (req, res) => {
//   try {
//     const { newPassword } = req.body;
//     if (!newPassword || newPassword.length < 8)
//       return res.status(400).json({ message: "Password must be at least 8 characters" });
//     const hash = await bcrypt.hash(newPassword, 10);
//     const r    = await pool.query(
//       "UPDATE users SET password_hash=$1,failed_attempts=0,is_locked=FALSE,updated_at=NOW() WHERE id=$2 RETURNING *",
//       [hash, req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
//     await addAudit("RESET_PASSWORD", "Admin", `Password reset for ${r.rows[0].username}`, "users", r.rows[0].id);
//     res.json({ message: "Password reset successfully", data: mapUser(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// app.patch("/api/users/:id/unlock", async (req, res) => {
//   try {
//     const r = await pool.query(
//       "UPDATE users SET is_locked=FALSE,failed_attempts=0,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]
//     );
//     if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
//     await addAudit("UNLOCK_USER", "Admin", `Unlocked user ${r.rows[0].username}`, "users", r.rows[0].id);
//     res.json({ message: "User unlocked successfully", data: mapUser(r.rows[0]) });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });


// // ═══════════════════════════════════════════
// // AUDIT LOG
// // ═══════════════════════════════════════════

// app.get("/api/audit-log", async (req, res) => {
//   try {
//     const r = await pool.query("SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200");
//     res.json(r.rows);
//   } catch (err) { res.status(500).json({ message: err.message }); }
// });

// // ═══════════════════════════════════════════
// // USER GROUPS (FR-UM-04)
// // ═══════════════════════════════════════════

// let userGroups = [];
// let groupSeq   = 1;

// // Create group
// app.post("/api/user-groups", async (req, res) => {
//   const { name, description, clientId } = req.body;
//   if (!name) return res.status(400).json({ message: "Group name is required" });
//   const group = {
//     id:          groupSeq++,
//     name,
//     description: description || "",
//     clientId:    clientId    || null,
//     userIds:     [],
//     createdAt:   new Date().toISOString(),
//   };
//   userGroups.push(group);
//   await addAudit("CREATE_GROUP", "Admin", `Created group: ${name}`);
//   res.status(201).json({ message: "Group created", data: group });
// });

// // Get all groups
// app.get("/api/user-groups", (req, res) => {
//   res.json(userGroups);
// });

// // Get single group
// app.get("/api/user-groups/:id", (req, res) => {
//   const group = userGroups.find(g => g.id === parseInt(req.params.id));
//   if (!group) return res.status(404).json({ message: "Group not found" });
//   res.json(group);
// });

// // Add user to group
// app.patch("/api/user-groups/:id/add-user", async (req, res) => {
//   const idx = userGroups.findIndex(g => g.id === parseInt(req.params.id));
//   if (idx === -1) return res.status(404).json({ message: "Group not found" });
//   const { userId } = req.body;
//   if (!userGroups[idx].userIds.includes(Number(userId))) {
//     userGroups[idx].userIds.push(Number(userId));
//     await addAudit("GROUP_ADD_USER", "Admin", `Added user ${userId} to group ${userGroups[idx].name}`);
//   }
//   res.json({ message: "User added to group", data: userGroups[idx] });
// });

// // Remove user from group
// app.patch("/api/user-groups/:id/remove-user", async (req, res) => {
//   const idx = userGroups.findIndex(g => g.id === parseInt(req.params.id));
//   if (idx === -1) return res.status(404).json({ message: "Group not found" });
//   const { userId } = req.body;
//   userGroups[idx].userIds = userGroups[idx].userIds.filter(id => id !== Number(userId));
//   await addAudit("GROUP_REMOVE_USER", "Admin", `Removed user ${userId} from group ${userGroups[idx].name}`);
//   res.json({ message: "User removed from group", data: userGroups[idx] });
// });

// // ─────────────────────────────────────────────
// // ROOT
// // ─────────────────────────────────────────────
// app.get("/", (req, res) => {
//   res.json({
//     app: "DMS — AVS InSoTech", version: "2.0.0", db: "PostgreSQL",
//     docs: "http://localhost:5000/api-docs",
//     endpoints: {
//       clients:       "http://localhost:5000/api/clients",
//       branches:      "http://localhost:5000/api/branches",
//       customers:     "http://localhost:5000/api/customers",
//       documentTypes: "http://localhost:5000/api/document-types",
//       uploads:       "http://localhost:5000/api/uploads",
//       users:         "http://localhost:5000/api/users",
//       auth:          "http://localhost:5000/api/auth/login",
//       auditLog:      "http://localhost:5000/api/audit-log",
//     },
//   });
// });

// // ─────────────────────────────────────────────
// // START SERVER
// // ─────────────────────────────────────────────
// const PORT = process.env.PORT || 5000;

// const path = require("path");

// // ── Serve React build ──
// app.use(express.static(path.join(__dirname, "../client/dist")));

// // ── Catch-all: send index.html for React Router ──
// // ✅ Fix for Express + path-to-regexp v8+
// app.get(/^(?!\/api).*$/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server        → http://localhost:${PORT}`);
//   console.log(`📖 Swagger UI    → http://localhost:${PORT}/api-docs`);
//   console.log(`🗄  Database      → PostgreSQL @ ${process.env.DB_HOST}/${process.env.DB_NAME}`);
// });


require("dotenv").config();
const crypto       = require("crypto");
const express      = require("express");
const cors         = require("cors");
const bcrypt       = require("bcryptjs");
const jwt          = require("jsonwebtoken");
const pool         = require("./db");
const swaggerDefinition = require("./swagger-docs");
const swaggerUi    = require("swagger-ui-express");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || "dms_secret_2024";

// ─────────────────────────────────────────────
// SWAGGER
// ─────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition, {
  customSiteTitle: "DMS API Docs",
  customCss: `.swagger-ui .topbar{background:#0b1120}.swagger-ui .topbar-wrapper img{display:none}.swagger-ui .topbar-wrapper::before{content:"DMS API — AVS InSoTech";color:#f5c842;font-size:18px;font-weight:700;}`,
  swaggerOptions: { persistAuthorization: true },
}));
app.get("/api-docs.json", (req, res) => res.json(swaggerDefinition));




// const swaggerSpec = swaggerJsdoc({
//   definition: {
//     openapi: "3.0.0",
//     info: { title: "DMS API — AVS InSoTech (PostgreSQL)", version: "2.0.0" },
//     servers: [{ url: "http://localhost:5000" }],
//   },
//   apis: [],
// });
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//   customSiteTitle: "DMS API Docs",
//   customCss: `.swagger-ui .topbar{background:#0b1120}.swagger-ui .topbar-wrapper img{display:none}.swagger-ui .topbar-wrapper::before{content:"DMS API — AVS InSoTech";color:#f5c842;font-size:18px;font-weight:700;}`,
// }));
// app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
async function nextCode(table, prefix, pad = 3) {
  const r = await pool.query(`SELECT COUNT(*) FROM ${table}`);
  return `${prefix}-${String(parseInt(r.rows[0].count) + 1).padStart(pad, "0")}`;
}

function generateDRN(seq) {
  const d  = new Date();
  const dt = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  return `DRN-${dt}-${String(seq).padStart(5,"0")}`;
}

// ── Extract client IP from request ──
function getIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    null
  );
}

// ── Updated addAudit — captures role, old/new values, IP, status (FR-RP-02) ──
// Backward-compatible: extras param is optional, falls back gracefully if new
// columns don't exist yet (run migrate-audit-log.sql first)
async function addAudit(action, byUser, detail, entity = null, entityId = null, extras = {}) {
  try {
    await pool.query(
      `INSERT INTO audit_log
         (action, entity, entity_id, by_user, detail, role, old_val, new_val, ip_address, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        action,
        entity,
        entityId,
        byUser,
        detail,
        extras.role      || null,
        extras.oldVal    || null,
        extras.newVal    || null,
        extras.ipAddress || null,
        extras.status    || "success",
      ]
    );
  } catch {
    // Fallback: if new columns not yet migrated, insert without them
    await pool.query(
      "INSERT INTO audit_log (action,entity,entity_id,by_user,detail) VALUES ($1,$2,$3,$4,$5)",
      [action, entity, entityId, byUser, detail]
    ).catch(() => {});
  }
}

// ── Map DB rows to camelCase for frontend ──
const mapClient = r => ({
  id: r.id, code: r.code, name: r.name, type: r.type,
  regNo: r.reg_no, address: r.address,
  contact: { name: r.contact_name, mobile: r.contact_mobile, email: r.contact_email },
  status: r.status, logo: r.logo, createdAt: r.created_at,
});

const mapBranch = r => ({
  id: r.id, code: r.code, name: r.name, clientId: r.client_id,
  address: r.address, manager: r.manager, contact: r.contact,
  status: r.status, createdAt: r.created_at,
});

const mapCustomer = r => ({
  id: r.id, code: r.code, customerType: r.customer_type,
  name: r.name, mobile: r.mobile, email: r.email,
  dob: r.dob, accountNo: r.account_no, address: r.address,
  clientId: r.client_id, branchId: r.branch_id,
  status: r.status, createdAt: r.created_at,
});

const mapDocType = r => ({
  id: r.id, code: r.code, name: r.name, category: r.category,
  allowedFormats: r.allowed_formats, maxFileSizeMB: r.max_file_size_mb,
  isMandatory: r.is_mandatory, retentionYears: r.retention_years,
  icon: r.icon, color: r.color, status: r.status,
});

const mapUpload = r => ({
  id: r.id, drn: r.drn, clientId: r.client_id, branchId: r.branch_id,
  customerId: r.customer_id, docTypeId: r.doc_type_id,
  fileName: r.file_name, fileExt: r.file_ext, fileSizeMB: r.file_size_mb,
  hash: r.file_hash, fileData: r.file_data, remarks: r.remarks,
  uploadedBy: r.uploaded_by, uploadedAt: r.uploaded_at,
  isDuplicate: r.is_duplicate, isDeleted: r.is_deleted,
});

const mapUser = r => ({
  id: r.id, username: r.username, fullName: r.full_name,
  email: r.email, mobile: r.mobile, role: r.role,
  assignedClientId: r.assigned_client_id, assignedBranchId: r.assigned_branch_id,
  status: r.status, isLocked: r.is_locked, failedAttempts: r.failed_attempts,
  lastLogin: r.last_login, createdAt: r.created_at,
});


// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required" });
  try {
    const r    = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    const user = r.rows[0];
    if (!user)          return res.status(401).json({ message: "Invalid username or password" });
    if (user.is_locked) return res.status(403).json({ message: "Account is locked. Contact your administrator." });
    if (!user.status)   return res.status(403).json({ message: "Account is inactive. Contact your administrator." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const attempts = (user.failed_attempts || 0) + 1;
      const lock     = attempts >= 5;
      await pool.query("UPDATE users SET failed_attempts=$1, is_locked=$2 WHERE id=$3", [attempts, lock, user.id]);
      // Log failed login attempt with IP
      await addAudit("LOGIN", username, `Failed login for ${username}`, "users", user.id, {
        role: user.role, ipAddress: getIP(req), status: "failed",
      });
      if (lock) {
        setTimeout(async () => {
          await pool.query("UPDATE users SET is_locked=FALSE, failed_attempts=0 WHERE id=$1", [user.id]);
        }, 30 * 60 * 1000);
        return res.status(403).json({ message: "Account locked after 5 failed attempts. Try again in 30 minutes." });
      }
      return res.status(401).json({ message: `Invalid password. ${5 - attempts} attempt(s) remaining.` });
    }

    await pool.query("UPDATE users SET failed_attempts=0, is_locked=FALSE, last_login=NOW() WHERE id=$1", [user.id]);
    // Log successful login with role + IP
    await addAudit("LOGIN", username, `User ${username} logged in`, "users", user.id, {
      role: user.role, ipAddress: getIP(req), status: "success",
    });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ message: "Login successful", token, user: mapUser(user) });
  } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

app.post("/api/auth/logout", async (req, res) => {
  const { username, role } = req.body;
  await addAudit("LOGOUT", username || "Unknown", `User ${username} logged out`, "users", null, {
    role, ipAddress: getIP(req), status: "success",
  });
  res.json({ message: "Logged out successfully" });
});


// ═══════════════════════════════════════════
// CLIENTS
// ═══════════════════════════════════════════

app.get("/api/clients", async (req, res) => {
  try {
    const { status, type } = req.query;
    let q = "SELECT * FROM clients WHERE 1=1";
    const p = [];
    if (status === "active")   { p.push(true);  q += ` AND status=$${p.length}`; }
    if (status === "inactive") { p.push(false); q += ` AND status=$${p.length}`; }
    if (type)                  { p.push(type);  q += ` AND type=$${p.length}`; }
    q += " ORDER BY id";
    const r = await pool.query(q, p);
    res.json(r.rows.map(mapClient));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/clients/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM clients WHERE id=$1", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Client not found" });
    res.json(mapClient(r.rows[0]));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/clients", async (req, res) => {
  try {
    const { name, type, regNo, address, contact, status, logo } = req.body;
    if (!name || !regNo) return res.status(400).json({ message: "Name and Registration No required" });
    if (contact?.mobile && contact.mobile.length !== 10)
      return res.status(400).json({ message: "Mobile must be 10 digits" });
    const code = await nextCode("clients", "CLT");
    const r    = await pool.query(
      `INSERT INTO clients (code,name,type,reg_no,address,contact_name,contact_mobile,contact_email,status,logo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [code, name, type||"Co-op Bank", regNo, address||"",
       contact?.name||"", contact?.mobile||"", contact?.email||"",
       status??true, logo||null]
    );
    await addAudit("CREATE_CLIENT", "admin", `Created client ${name}`, "clients", r.rows[0].id);
    res.status(201).json({ message: "Client created successfully", data: mapClient(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/clients/:id", async (req, res) => {
  try {
    const { name, type, regNo, address, contact, status, logo } = req.body;
    if (!name || !regNo) return res.status(400).json({ message: "Name and Registration No required" });
    const r = await pool.query(
      `UPDATE clients SET name=$1,type=$2,reg_no=$3,address=$4,
       contact_name=$5,contact_mobile=$6,contact_email=$7,status=$8,logo=$9,updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, type, regNo, address||"",
       contact?.name||"", contact?.mobile||"", contact?.email||"",
       status, logo||null, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client updated successfully", data: mapClient(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/clients/:id/toggle-status", async (req, res) => {
  try {
    const cr = await pool.query("SELECT * FROM clients WHERE id=$1", [req.params.id]);
    if (!cr.rows[0]) return res.status(404).json({ message: "Client not found" });
    if (cr.rows[0].status) {
      const br = await pool.query("SELECT COUNT(*) FROM branches WHERE client_id=$1 AND status=TRUE", [req.params.id]);
      if (parseInt(br.rows[0].count) > 0)
        return res.status(400).json({ message: `Cannot deactivate: client has ${br.rows[0].count} active branch(es)` });
    }
    const r = await pool.query("UPDATE clients SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapClient(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/clients/:id/deactivate", async (req, res) => {
  try {
    const br = await pool.query("SELECT COUNT(*) FROM branches WHERE client_id=$1 AND status=TRUE", [req.params.id]);
    if (parseInt(br.rows[0].count) > 0)
      return res.status(400).json({ message: `Cannot deactivate: client has ${br.rows[0].count} active branch(es)` });
    const r = await pool.query("UPDATE clients SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deactivated", data: mapClient(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// ═══════════════════════════════════════════
// BRANCHES
// ═══════════════════════════════════════════

app.get("/api/branches", async (req, res) => {
  try {
    const { clientId, status } = req.query;
    let q = "SELECT * FROM branches WHERE 1=1";
    const p = [];
    if (clientId)              { p.push(clientId); q += ` AND client_id=$${p.length}`; }
    if (status === "active")   { p.push(true);     q += ` AND status=$${p.length}`; }
    if (status === "inactive") { p.push(false);    q += ` AND status=$${p.length}`; }
    q += " ORDER BY id";
    const r = await pool.query(q, p);
    res.json(r.rows.map(mapBranch));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/branches/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM branches WHERE id=$1", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
    res.json(mapBranch(r.rows[0]));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/branches", async (req, res) => {
  try {
    const { name, clientId, address, manager, contact, status } = req.body;
    if (!name || !clientId || !contact)
      return res.status(400).json({ message: "Name, Client and Contact are required" });
    if (contact.length !== 10) return res.status(400).json({ message: "Contact must be 10 digits" });
    const ce = await pool.query("SELECT id FROM clients WHERE id=$1", [clientId]);
    if (!ce.rows[0]) return res.status(400).json({ message: "Invalid Client ID" });
    const code = await nextCode("branches", "BR");
    const r    = await pool.query(
      "INSERT INTO branches (code,name,client_id,address,manager,contact,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [code, name, clientId, address||"", manager||"", contact, status??true]
    );
    res.status(201).json({ message: "Branch created successfully", data: mapBranch(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/branches/:id", async (req, res) => {
  try {
    const { name, clientId, address, manager, contact, status } = req.body;
    if (!name || !contact) return res.status(400).json({ message: "Name and Contact are required" });
    if (contact.length !== 10) return res.status(400).json({ message: "Contact must be 10 digits" });
    const r = await pool.query(
      "UPDATE branches SET name=$1,client_id=$2,address=$3,manager=$4,contact=$5,status=$6,updated_at=NOW() WHERE id=$7 RETURNING *",
      [name, clientId, address||"", manager||"", contact, status, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: "Branch updated successfully", data: mapBranch(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/branches/:id/toggle-status", async (req, res) => {
  try {
    const r = await pool.query("UPDATE branches SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapBranch(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/branches/:id/deactivate", async (req, res) => {
  try {
    const r = await pool.query("UPDATE branches SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: "Branch deactivated", data: mapBranch(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// ═══════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════

app.get("/api/customers", async (req, res) => {
  try {
    const { clientId, branchId, status } = req.query;
    let q = "SELECT * FROM customers WHERE 1=1";
    const p = [];
    if (clientId)              { p.push(clientId); q += ` AND client_id=$${p.length}`; }
    if (branchId)              { p.push(branchId); q += ` AND branch_id=$${p.length}`; }
    if (status === "active")   { p.push(true);     q += ` AND status=$${p.length}`; }
    if (status === "inactive") { p.push(false);    q += ` AND status=$${p.length}`; }
    q += " ORDER BY id";
    const r = await pool.query(q, p);
    res.json(r.rows.map(mapCustomer));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM customers WHERE id=$1", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
    res.json(mapCustomer(r.rows[0]));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/customers", async (req, res) => {
  try {
    const { name, mobile, email, dob, accountNo, address, clientId, branchId, status, customerType } = req.body;
    if (!name)   return res.status(400).json({ message: "Name is required" });
    if (!mobile) return res.status(400).json({ message: "Mobile is required" });
    if (mobile.length !== 10) return res.status(400).json({ message: "Mobile must be 10 digits" });
    if (!clientId) return res.status(400).json({ message: "Client is required" });
    const ce = await pool.query("SELECT id FROM clients WHERE id=$1 AND status=TRUE", [clientId]);
    if (!ce.rows[0]) return res.status(400).json({ message: "Invalid or inactive Client" });
    const code = await nextCode("customers", "CUST");
    const r    = await pool.query(
      `INSERT INTO customers (code,customer_type,name,mobile,email,dob,account_no,address,client_id,branch_id,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [code, customerType||"Individual", name, mobile, email||"",
       dob||null, accountNo||"", address||"", clientId, branchId||null, status??true]
    );
    res.status(201).json({ message: "Customer created successfully", data: mapCustomer(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/customers/:id", async (req, res) => {
  try {
    const { name, mobile, email, dob, accountNo, address, clientId, branchId, status, customerType } = req.body;
    if (!name || !mobile) return res.status(400).json({ message: "Name and Mobile are required" });
    if (mobile.length !== 10) return res.status(400).json({ message: "Mobile must be 10 digits" });
    const r = await pool.query(
      `UPDATE customers SET customer_type=$1,name=$2,mobile=$3,email=$4,dob=$5,
       account_no=$6,address=$7,client_id=$8,branch_id=$9,status=$10,updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [customerType||"Individual", name, mobile, email||"", dob||null,
       accountNo||"", address||"", clientId, branchId||null, status, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer updated successfully", data: mapCustomer(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/customers/:id/toggle-status", async (req, res) => {
  try {
    const r = await pool.query("UPDATE customers SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapCustomer(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/customers/:id/deactivate", async (req, res) => {
  try {
    const r = await pool.query("UPDATE customers SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deactivated", data: mapCustomer(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// ═══════════════════════════════════════════
// DOCUMENT TYPES
// ═══════════════════════════════════════════

app.get("/api/document-types", async (req, res) => {
  try {
    const { status, required, category } = req.query;
    let q = "SELECT * FROM document_types WHERE 1=1";
    const p = [];
    if (status === "active")   { p.push(true);  q += ` AND status=$${p.length}`; }
    if (status === "inactive") { p.push(false); q += ` AND status=$${p.length}`; }
    if (required === "true")   { p.push(true);  q += ` AND is_mandatory=$${p.length}`; }
    if (required === "false")  { p.push(false); q += ` AND is_mandatory=$${p.length}`; }
    if (category)              { p.push(category); q += ` AND category=$${p.length}`; }
    q += " ORDER BY id";
    const r = await pool.query(q, p);
    res.json(r.rows.map(mapDocType));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/document-types/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM document_types WHERE id=$1", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
    res.json(mapDocType(r.rows[0]));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/document-types", async (req, res) => {
  try {
    const { name, category, allowedFormats, maxFileSizeMB, isMandatory, retentionYears, icon, color, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!allowedFormats?.length) return res.status(400).json({ message: "At least one format required" });
    const code = await nextCode("document_types", "DOC");
    const r    = await pool.query(
      `INSERT INTO document_types (code,name,category,allowed_formats,max_file_size_mb,is_mandatory,retention_years,icon,color,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [code, name, category||"Others", allowedFormats,
       maxFileSizeMB||5, isMandatory??true, retentionYears||null,
       icon||"📄", color||"#3d8ef0", status??true]
    );
    res.status(201).json({ message: "Document type created", data: mapDocType(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/document-types/:id", async (req, res) => {
  try {
    const { name, category, allowedFormats, maxFileSizeMB, isMandatory, retentionYears, icon, color, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const r = await pool.query(
      `UPDATE document_types SET name=$1,category=$2,allowed_formats=$3,max_file_size_mb=$4,
       is_mandatory=$5,retention_years=$6,icon=$7,color=$8,status=$9,updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, category, allowedFormats, maxFileSizeMB, isMandatory, retentionYears||null, icon, color, status, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
    res.json({ message: "Document type updated", data: mapDocType(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/document-types/:id/toggle-status", async (req, res) => {
  try {
    const r = await pool.query("UPDATE document_types SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
    res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapDocType(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/document-types/:id/deactivate", async (req, res) => {
  try {
    const r = await pool.query("UPDATE document_types SET status=FALSE,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Document type not found" });
    res.json({ message: "Document type deactivated", data: mapDocType(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// ═══════════════════════════════════════════
// UPLOADS
// ═══════════════════════════════════════════

app.get("/api/uploads", async (req, res) => {
  try {
    const { clientId, branchId, customerId, docTypeId } = req.query;
    let q = "SELECT * FROM uploads WHERE is_deleted=FALSE";
    const p = [];
    if (clientId)   { p.push(clientId);   q += ` AND client_id=$${p.length}`; }
    if (branchId)   { p.push(branchId);   q += ` AND branch_id=$${p.length}`; }
    if (customerId) { p.push(customerId); q += ` AND customer_id=$${p.length}`; }
    if (docTypeId)  { p.push(docTypeId);  q += ` AND doc_type_id=$${p.length}`; }
    q += " ORDER BY uploaded_at DESC";
    const r = await pool.query(q, p);
    // Return without file_data for list (keep response light)
    res.json(r.rows.map(row => ({ ...mapUpload(row), fileData: row.file_data ? "HAS_DATA" : null })));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/uploads/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM uploads WHERE id=$1 AND is_deleted=FALSE", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
    await addAudit("VIEW", "user", `Viewed upload ${r.rows[0].drn}`, "uploads", r.rows[0].id);
    res.json(mapUpload(r.rows[0]));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/uploads/:id/file", async (req, res) => {
  try {
    const r = await pool.query("SELECT file_data,file_name,file_ext FROM uploads WHERE id=$1 AND is_deleted=FALSE", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
    res.json({ fileData: r.rows[0].file_data, fileName: r.rows[0].file_name, fileExt: r.rows[0].file_ext });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/uploads", async (req, res) => {
  try {
    const { clientId, branchId, customerId, docTypeId, fileName, fileExt, fileSizeMB, hash, remarks, fileData, uploadedBy } = req.body;
    if (!customerId) return res.status(400).json({ message: "Customer ID is required" });
    if (!docTypeId)  return res.status(400).json({ message: "Document Type is required" });
    if (!fileName)   return res.status(400).json({ message: "File name is required" });
    if (!fileData)   return res.status(400).json({ message: "File data is required" });

    // Validate customer
    const cust = await pool.query("SELECT * FROM customers WHERE id=$1", [customerId]);
    if (!cust.rows[0])        return res.status(400).json({ message: "Customer not found" });
    if (!cust.rows[0].status) return res.status(400).json({ message: "Customer is Inactive" });

    // Validate document type
    const dt = await pool.query("SELECT * FROM document_types WHERE id=$1", [docTypeId]);
    if (!dt.rows[0])        return res.status(400).json({ message: "Document type not found" });
    if (!dt.rows[0].status) return res.status(400).json({ message: "Document type is Inactive" });

    // Format validation
    const ext = (fileExt||"").toUpperCase();
    if (dt.rows[0].allowed_formats && !dt.rows[0].allowed_formats.includes(ext))
      return res.status(400).json({ message: `Format ${ext} not allowed. Allowed: ${dt.rows[0].allowed_formats.join(", ")}` });

    // Size validation
    if (dt.rows[0].max_file_size_mb && parseFloat(fileSizeMB) > dt.rows[0].max_file_size_mb)
      return res.status(400).json({ message: `File too large. Max: ${dt.rows[0].max_file_size_mb} MB` });

    // Duplicate check
    const dup = await pool.query(
      "SELECT id FROM uploads WHERE file_hash=$1 AND customer_id=$2 AND doc_type_id=$3 AND is_deleted=FALSE",
      [hash, customerId, docTypeId]
    );
    const isDuplicate = dup.rows.length > 0;

    // Generate DRN
    const seqR = await pool.query("SELECT COUNT(*)+1 AS seq FROM uploads");
    const drn  = generateDRN(parseInt(seqR.rows[0].seq));

    const r = await pool.query(
      `INSERT INTO uploads (drn,client_id,branch_id,customer_id,doc_type_id,file_name,file_ext,file_size_mb,file_hash,file_data,remarks,uploaded_by,is_duplicate)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [drn, clientId, branchId||null, customerId, docTypeId,
       fileName, ext, parseFloat(fileSizeMB)||0,
       hash||"", fileData, remarks||"", uploadedBy||"System", isDuplicate]
    );

    await addAudit("UPLOAD", uploadedBy||"System", `Uploaded ${fileName} DRN:${drn}`, "uploads", r.rows[0].id);
    res.status(201).json({
      message: isDuplicate ? `⚠️ Duplicate detected. Saved as ${drn}` : `File uploaded. DRN: ${drn}`,
      data: mapUpload(r.rows[0]),
    });
  } catch (err) { console.error(err); res.status(500).json({ message: err.message }); }
});

app.post("/api/uploads/:id/view", async (req, res) => {
  try {
    const r = await pool.query("SELECT drn FROM uploads WHERE id=$1", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
    await addAudit("VIEW", req.body?.viewedBy||"System", `Viewed ${r.rows[0].drn}`, "uploads", parseInt(req.params.id), {
      ipAddress: getIP(req), status: "success",
    });
    res.json({ message: "View logged" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/uploads/:id/delete", async (req, res) => {
  try {
    const { reason, deletedBy } = req.body;
    const r = await pool.query(
      "UPDATE uploads SET is_deleted=TRUE,deleted_at=NOW(),deleted_by=$1,delete_reason=$2 WHERE id=$3 RETURNING *",
      [deletedBy||"Admin", reason||"", req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "Upload not found" });
    await addAudit("DELETE", deletedBy||"Admin", `Archived upload ${r.rows[0].drn}: ${reason}`, "uploads", r.rows[0].id);
    res.json({ message: "Document archived (soft delete)", data: mapUpload(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// ═══════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════

app.get("/api/users", async (req, res) => {
  try {
    const { role, status } = req.query;
    let q = "SELECT * FROM users WHERE 1=1";
    const p = [];
    if (role)                  { p.push(role);  q += ` AND role=$${p.length}`; }
    if (status === "active")   { p.push(true);  q += ` AND status=$${p.length}`; }
    if (status === "inactive") { p.push(false); q += ` AND status=$${p.length}`; }
    q += " ORDER BY id";
    const r = await pool.query(q, p);
    res.json(r.rows.map(mapUser));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
    res.json(mapUser(r.rows[0]));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post("/api/users", async (req, res) => {
  try {
    const { fullName, username, email, mobile, password, role, assignedClientId, assignedBranchId, status } = req.body;
    if (!fullName || !username || !email || !password)
      return res.status(400).json({ message: "Full Name, Username, Email and Password are required" });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });

    const existing = await pool.query("SELECT id FROM users WHERE username=$1 OR email=$2", [username, email]);
    if (existing.rows.length > 0) return res.status(400).json({ message: "Username or email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const r    = await pool.query(
      `INSERT INTO users (username,full_name,email,mobile,password_hash,role,assigned_client_id,assigned_branch_id,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [username, fullName, email, mobile||"", hash, role||"Viewer",
       assignedClientId||null, assignedBranchId||null, status??true]
    );
    await addAudit("CREATE_USER", "Admin", `Created user ${username} (${role})`, "users", r.rows[0].id, {
      role: "Admin", newVal: `username=${username}, role=${role}`,
    });
    res.status(201).json({ message: "User created successfully", data: mapUser(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { fullName, email, mobile, role, assignedClientId, assignedBranchId, status } = req.body;
    if (!fullName || !email) return res.status(400).json({ message: "Full Name and Email are required" });
    // Capture old value before update
    const old = await pool.query("SELECT full_name,role,status FROM users WHERE id=$1", [req.params.id]);
    const oldRow = old.rows[0];
    const r = await pool.query(
      `UPDATE users SET full_name=$1,email=$2,mobile=$3,role=$4,
       assigned_client_id=$5,assigned_branch_id=$6,status=$7,updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [fullName, email, mobile||"", role, assignedClientId||null, assignedBranchId||null, status, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
    await addAudit("UPDATE_USER", "Admin", `Updated user ${r.rows[0].username}`, "users", r.rows[0].id, {
      role: "Admin",
      oldVal: oldRow ? `name=${oldRow.full_name}, role=${oldRow.role}` : null,
      newVal: `name=${fullName}, role=${role}`,
    });
    res.json({ message: "User updated successfully", data: mapUser(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/users/:id/toggle-status", async (req, res) => {
  try {
    const r = await pool.query("UPDATE users SET status=NOT status,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]);
    if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
    await addAudit(
      r.rows[0].status ? "ACTIVATE_USER" : "DEACTIVATE_USER",
      "Admin",
      `User ${r.rows[0].username} status changed to ${r.rows[0].status ? "Active" : "Inactive"}`,
      "users",
      r.rows[0].id,
      { role: "Admin", newVal: r.rows[0].status ? "Active" : "Inactive" }
    );
    res.json({ message: `Status → ${r.rows[0].status?"Active":"Inactive"}`, data: mapUser(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/users/:id/reset-password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    const hash = await bcrypt.hash(newPassword, 10);
    const r    = await pool.query(
      "UPDATE users SET password_hash=$1,failed_attempts=0,is_locked=FALSE,updated_at=NOW() WHERE id=$2 RETURNING *",
      [hash, req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
    await addAudit("RESET_PASSWORD", "Admin", `Password reset for ${r.rows[0].username}`, "users", r.rows[0].id, {
      role: "Admin", status: "success",
    });
    res.json({ message: "Password reset successfully", data: mapUser(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.patch("/api/users/:id/unlock", async (req, res) => {
  try {
    const r = await pool.query(
      "UPDATE users SET is_locked=FALSE,failed_attempts=0,updated_at=NOW() WHERE id=$1 RETURNING *", [req.params.id]
    );
    if (!r.rows[0]) return res.status(404).json({ message: "User not found" });
    await addAudit("UNLOCK_USER", "Admin", `Unlocked user ${r.rows[0].username}`, "users", r.rows[0].id, {
      role: "Admin", status: "success",
    });
    res.json({ message: "User unlocked successfully", data: mapUser(r.rows[0]) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// ═══════════════════════════════════════════
// AUDIT LOG  (existing simple endpoint — unchanged)
// ═══════════════════════════════════════════

app.get("/api/audit-log", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200");
    res.json(r.rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});


// ═══════════════════════════════════════════
// USER GROUPS (FR-UM-04) — unchanged
// ═══════════════════════════════════════════

let userGroups = [];
let groupSeq   = 1;

app.post("/api/user-groups", async (req, res) => {
  const { name, description, clientId } = req.body;
  if (!name) return res.status(400).json({ message: "Group name is required" });
  const group = {
    id:          groupSeq++,
    name,
    description: description || "",
    clientId:    clientId    || null,
    userIds:     [],
    createdAt:   new Date().toISOString(),
  };
  userGroups.push(group);
  await addAudit("CREATE_GROUP", "Admin", `Created group: ${name}`);
  res.status(201).json({ message: "Group created", data: group });
});

app.get("/api/user-groups", (req, res) => {
  res.json(userGroups);
});

app.get("/api/user-groups/:id", (req, res) => {
  const group = userGroups.find(g => g.id === parseInt(req.params.id));
  if (!group) return res.status(404).json({ message: "Group not found" });
  res.json(group);
});

app.patch("/api/user-groups/:id/add-user", async (req, res) => {
  const idx = userGroups.findIndex(g => g.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Group not found" });
  const { userId } = req.body;
  if (!userGroups[idx].userIds.includes(Number(userId))) {
    userGroups[idx].userIds.push(Number(userId));
    await addAudit("GROUP_ADD_USER", "Admin", `Added user ${userId} to group ${userGroups[idx].name}`);
  }
  res.json({ message: "User added to group", data: userGroups[idx] });
});

app.patch("/api/user-groups/:id/remove-user", async (req, res) => {
  const idx = userGroups.findIndex(g => g.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Group not found" });
  const { userId } = req.body;
  userGroups[idx].userIds = userGroups[idx].userIds.filter(id => id !== Number(userId));
  await addAudit("GROUP_REMOVE_USER", "Admin", `Removed user ${userId} from group ${userGroups[idx].name}`);
  res.json({ message: "User removed from group", data: userGroups[idx] });
});


// ═══════════════════════════════════════════
// REPORTS  (FR-RP-01 & FR-RP-02)
// ═══════════════════════════════════════════

// ── FR-RP-01: Image Upload Log Report ──
// Available to: Admin, Manager, Officer
// GET /api/reports/upload-log?dateFrom=&dateTo=&clientId=&branchId=&docTypeId=&uploadedBy=&status=
app.get("/api/reports/upload-log", async (req, res) => {
  try {
    const { dateFrom, dateTo, clientId, branchId, docTypeId, uploadedBy, status } = req.query;

    let q = `
      SELECT
        u.id, u.drn, u.file_name, u.file_ext, u.file_size_mb,
        u.uploaded_by, u.uploaded_at, u.is_duplicate,
        u.client_id, u.branch_id, u.customer_id, u.doc_type_id,
        c.name        AS customer_name,
        c.account_no,
        cl.name       AS client_name,
        br.name       AS branch_name,
        dt.name       AS doc_type_name,
        dt.icon       AS doc_type_icon,
        dt.category   AS doc_type_category
      FROM uploads u
      LEFT JOIN customers      c  ON c.id  = u.customer_id
      LEFT JOIN clients        cl ON cl.id = u.client_id
      LEFT JOIN branches       br ON br.id = u.branch_id
      LEFT JOIN document_types dt ON dt.id = u.doc_type_id
      WHERE u.is_deleted = FALSE
    `;
    const p = [];

    if (dateFrom)   { p.push(dateFrom);          q += ` AND u.uploaded_at >= $${p.length}::date`; }
    if (dateTo)     { p.push(dateTo);            q += ` AND u.uploaded_at <  ($${p.length}::date + interval '1 day')`; }
    if (clientId)   { p.push(clientId);           q += ` AND u.client_id  = $${p.length}`; }
    if (branchId)   { p.push(branchId);           q += ` AND u.branch_id  = $${p.length}`; }
    if (docTypeId)  { p.push(docTypeId);          q += ` AND u.doc_type_id = $${p.length}`; }
    if (uploadedBy) { p.push(`%${uploadedBy}%`);  q += ` AND u.uploaded_by ILIKE $${p.length}`; }
    if (status === "ok")  q += ` AND u.is_duplicate = FALSE`;
    if (status === "dup") q += ` AND u.is_duplicate = TRUE`;

    q += " ORDER BY u.uploaded_at DESC LIMIT 5000";
    const r = await pool.query(q, p);

    // Summary row (FR-RP-01 requirement)
    const totalSize = r.rows.reduce((a, row) => a + parseFloat(row.file_size_mb || 0), 0);
    const byDocType = r.rows.reduce((acc, row) => {
      const name = row.doc_type_name || "Unknown";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    res.json({
      data: r.rows.map(row => ({
        id:           row.id,
        drn:          row.drn,
        customerName: row.customer_name,
        accountNo:    row.account_no,
        docTypeName:  row.doc_type_name,
        docTypeIcon:  row.doc_type_icon,
        fileName:     row.file_name,
        fileExt:      row.file_ext,
        fileSizeMB:   parseFloat(row.file_size_mb) || 0,
        uploadedBy:   row.uploaded_by,
        uploadedAt:   row.uploaded_at,
        branchName:   row.branch_name,
        clientName:   row.client_name,
        isDuplicate:  row.is_duplicate,
        status:       row.is_duplicate ? "Duplicate" : "OK",
      })),
      summary: {
        total:       r.rows.length,
        totalSizeMB: parseFloat(totalSize.toFixed(2)),
        duplicates:  r.rows.filter(row => row.is_duplicate).length,
        byDocType,
      },
    });
  } catch (err) { console.error(err); res.status(500).json({ message: err.message }); }
});

// ── FR-RP-01: CSV Export (server-side, no extra packages) ──
// GET /api/reports/upload-log/export/csv
app.get("/api/reports/upload-log/export/csv", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT u.drn, c.name AS customer_name, c.account_no,
             dt.name AS doc_type_name, u.file_name, u.file_ext,
             u.file_size_mb, u.uploaded_at, u.uploaded_by,
             br.name AS branch_name, cl.name AS client_name,
             CASE WHEN u.is_duplicate THEN 'Duplicate' ELSE 'OK' END AS status
      FROM uploads u
      LEFT JOIN customers      c  ON c.id  = u.customer_id
      LEFT JOIN clients        cl ON cl.id = u.client_id
      LEFT JOIN branches       br ON br.id = u.branch_id
      LEFT JOIN document_types dt ON dt.id = u.doc_type_id
      WHERE u.is_deleted = FALSE ORDER BY u.uploaded_at DESC
    `);

    const headers = ["DRN","Customer Name","Acc. No.","Document Type","File Name","Ext","File Size (MB)","Upload Date-Time","Uploaded By","Branch","Client","Status"];
    const rows = r.rows.map(row => [
      row.drn, row.customer_name, row.account_no, row.doc_type_name,
      row.file_name, row.file_ext, parseFloat(row.file_size_mb).toFixed(2),
      new Date(row.uploaded_at).toLocaleString("en-IN"),
      row.uploaded_by, row.branch_name, row.client_name, row.status,
    ].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`));

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="upload-log-${new Date().toISOString().slice(0,10)}.csv"`);
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── FR-RP-02: System Audit / Activity Log Report ──
// Available to: Admin only
// GET /api/reports/audit-log?dateFrom=&dateTo=&user=&action=&entity=&ipAddress=&status=&limit=
app.get("/api/reports/audit-log", async (req, res) => {
  try {
    const { dateFrom, dateTo, user, action, entity, ipAddress, status, limit } = req.query;

    let q = `
      SELECT
        al.id, al.created_at, al.action,
        al.by_user, al.entity, al.entity_id,
        al.detail,
        COALESCE(al.role, u.role)    AS role,
        al.old_val, al.new_val,
        al.ip_address,
        COALESCE(al.status, 'success') AS status
      FROM audit_log al
      LEFT JOIN users u ON u.username = al.by_user
      WHERE 1=1
    `;
    const p = [];

    if (dateFrom)   { p.push(dateFrom);          q += ` AND al.created_at >= $${p.length}::date`; }
    if (dateTo)     { p.push(dateTo);            q += ` AND al.created_at <  ($${p.length}::date + interval '1 day')`; }
    if (user)       { p.push(`%${user}%`);        q += ` AND al.by_user ILIKE $${p.length}`; }
    if (action)     { p.push(action);             q += ` AND al.action = $${p.length}`; }
    if (entity)     { p.push(entity);             q += ` AND al.entity = $${p.length}`; }
    if (ipAddress)  { p.push(`%${ipAddress}%`);   q += ` AND al.ip_address ILIKE $${p.length}`; }
    if (status)     { p.push(status);             q += ` AND COALESCE(al.status,'success') = $${p.length}`; }

    q += ` ORDER BY al.created_at DESC LIMIT ${parseInt(limit) || 1000}`;
    const r = await pool.query(q, p);

    const actionBreakdown = r.rows.reduce((acc, row) => {
      acc[row.action] = (acc[row.action] || 0) + 1;
      return acc;
    }, {});

    res.json({
      data: r.rows.map(row => ({
        id:        row.id,
        timestamp: row.created_at,
        user:      row.by_user    || "—",
        role:      row.role       || "—",
        module:    row.entity     || "—",
        action:    row.action,
        recordId:  row.entity_id  || "—",
        oldVal:    row.old_val    || "—",
        newVal:    row.new_val    || "—",
        ipAddress: row.ip_address || "—",
        detail:    row.detail     || "",
        status:    row.status     || "success",
      })),
      summary: {
        total:           r.rows.length,
        uniqueUsers:     [...new Set(r.rows.map(r => r.by_user))].length,
        actionBreakdown,
        retentionYears:  7,
      },
    });
  } catch (err) { console.error(err); res.status(500).json({ message: err.message }); }
});

// ── FR-RP-02: CSV Export — full audit log, no filters (compliance download) ──
// GET /api/reports/audit-log/export/csv
app.get("/api/reports/audit-log/export/csv", async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT
        al.id, al.created_at, al.by_user,
        COALESCE(al.role, u.role, '—') AS role,
        al.entity AS module, al.action,
        al.entity_id AS record_id,
        al.old_val, al.new_val,
        al.ip_address, al.detail,
        COALESCE(al.status, 'success') AS status
      FROM audit_log al
      LEFT JOIN users u ON u.username = al.by_user
      ORDER BY al.created_at DESC
    `);

    const headers = ["Log ID","Timestamp","User","Role","Module","Action","Record ID","Old Value","New Value","IP Address","Detail","Status"];
    const rows = r.rows.map(row => [
      row.id,
      new Date(row.created_at).toLocaleString("en-IN"),
      row.by_user   || "", row.role     || "—",
      row.module    || "", row.action,
      row.record_id || "", row.old_val  || "",
      row.new_val   || "", row.ip_address || "",
      row.detail    || "", row.status,
    ].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`));

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="audit-log-FULL-${new Date().toISOString().slice(0,10)}.csv"`);
    res.send(csv);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── Log export events (Excel / PDF) ──
app.post("/api/reports/log-export", async (req, res) => {
  try {
    const { exportedBy, reportType, format, recordCount, filters } = req.body;
    await addAudit(
      "EXPORT",
      exportedBy || "System",
      `Exported ${reportType} as ${format} — ${recordCount} records. Filters: ${JSON.stringify(filters || {})}`,
      "reports",
      null,
      { role: req.body.role || null, status: "success" }
    );
    res.json({ message: "Export logged" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    app: "DMS — AVS InSoTech", version: "2.0.0", db: "PostgreSQL",
    docs: "http://localhost:5000/api-docs",
    endpoints: {
      clients:         "http://localhost:5000/api/clients",
      branches:        "http://localhost:5000/api/branches",
      customers:       "http://localhost:5000/api/customers",
      documentTypes:   "http://localhost:5000/api/document-types",
      uploads:         "http://localhost:5000/api/uploads",
      users:           "http://localhost:5000/api/users",
      auth:            "http://localhost:5000/api/auth/login",
      auditLog:        "http://localhost:5000/api/audit-log",
      reportUploadLog: "http://localhost:5000/api/reports/upload-log",
      reportAuditLog:  "http://localhost:5000/api/reports/audit-log",
    },
  });
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const path = require("path");

// ── Serve React build ──
app.use(express.static(path.join(__dirname, "../client/dist")));

// ── Catch-all: send index.html for React Router ──
// ✅ Fix for Express + path-to-regexp v8+
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server        → http://localhost:${PORT}`);
  console.log(`📖 Swagger UI    → http://localhost:${PORT}/api-docs`);
  console.log(`🗄  Database      → PostgreSQL @ ${process.env.DB_HOST}/${process.env.DB_NAME}`);
});

