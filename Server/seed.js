// D:\DMS Project\Server\seed.js
// Run ONCE after schema: node seed.js
require("dotenv").config();
const pool   = require("./db");
const bcrypt = require("bcryptjs");

async function seed() {
  console.log("🌱 Seeding database...\n");

  const users = [
    { username:"admin",     fullName:"Walmik Darade",   email:"admin@avsinsotech.com",  mobile:"9876543210", password:"admin123",   role:"Admin",     clientId:null, branchId:null },
    { username:"manager",   fullName:"Jayant Kulkarni", email:"jayant@ndcb.in",          mobile:"9823456789", password:"manager123", role:"Manager",   clientId:1,    branchId:1    },
    { username:"officer",   fullName:"Pravin Patil",    email:"pravin@ndcb.in",           mobile:"9012345678", password:"officer123", role:"Officer",   clientId:1,    branchId:2    },
    { username:"dataentry", fullName:"Suresh Kadam",    email:"suresh@bps.co.in",         mobile:"9823100234", password:"data123",    role:"DataEntry", clientId:2,    branchId:4    },
    { username:"viewer",    fullName:"Anita Joshi",     email:"anita@avsinsotech.com",    mobile:"9900112233", password:"viewer123",  role:"Viewer",    clientId:null, branchId:null },
  ];

  await pool.query("DELETE FROM users");
  console.log("🗑  Cleared existing users");

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      `INSERT INTO users (username,full_name,email,mobile,password_hash,role,assigned_client_id,assigned_branch_id,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE)
       ON CONFLICT (username) DO UPDATE SET password_hash=EXCLUDED.password_hash`,
      [u.username, u.fullName, u.email, u.mobile, hash, u.role, u.clientId, u.branchId]
    );
    console.log(`  ✅ ${u.role.padEnd(12)} → ${u.username} / ${u.password}`);
  }

  console.log("\n✅ Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  users.forEach(u => console.log(`  ${u.role.padEnd(12)} ${u.username} / ${u.password}`));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  process.exit(0);
}

seed().catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
