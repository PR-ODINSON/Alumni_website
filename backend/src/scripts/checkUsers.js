/**
 * checkUsers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Quick diagnostic script to inspect all users in the MongoDB Atlas database.
 * Shows user breakdown by role, verification status, auth provider, and
 * lists each user with key fields.
 *
 * Usage (from project root):
 *   node backend/src/scripts/checkUsers.js
 *
 * Or with a custom URI:
 *   MONGODB_URI="mongodb+srv://..." node backend/src/scripts/checkUsers.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/iitram-alumni';

// ── helpers ──────────────────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';
const GREEN  = '\x1b[32m';
const CYAN   = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const BLUE   = '\x1b[34m';
const MAGENTA= '\x1b[35m';

function colorFor(role) {
  return { admin: RED, alumni: BLUE, student: GREEN, faculty: MAGENTA }[role] || DIM;
}

function statusColor(status) {
  return {
    verified:     GREEN,
    under_review: YELLOW,
    pending:      DIM,
    rejected:     RED,
    suspended:    RED,
  }[status] || DIM;
}

function pad(str, len) {
  const s = String(str ?? '');
  return s.length >= len ? s.slice(0, len) : s + ' '.repeat(len - s.length);
}

function separator(char = '─', width = 80) {
  return char.repeat(width);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  console.log(`\n${BOLD}${CYAN}IITRAM Alumni Platform — Database User Inspector${RESET}`);
  console.log(separator());

  try {
    console.log(`${DIM}Connecting to MongoDB…${RESET}`);
    await client.connect();

    const dbName = new URL(MONGODB_URI).pathname.replace('/', '') || 'iitram-alumni';
    const db = client.db(dbName);
    const users = db.collection('users');

    // ── Fetch all users ───────────────────────────────────────────────────────
    const allUsers = await users
      .find({}, {
        projection: {
          firstName: 1, lastName: 1, email: 1, role: 1,
          isEmailVerified: 1, isActive: 1, isBanned: 1,
          authProvider: 1, verificationStatus: 1,
          createdAt: 1, lastLogin: 1, loginCount: 1,
        },
      })
      .sort({ role: 1, createdAt: -1 })
      .toArray();

    const total = allUsers.length;

    if (total === 0) {
      console.log(`\n${YELLOW}⚠  No users found in the database.${RESET}\n`);
      return;
    }

    // ── Summary stats ─────────────────────────────────────────────────────────
    const byRole    = {};
    const byStatus  = {};
    const byProvider= {};
    let   banned    = 0;
    let   inactive  = 0;
    let   unverifiedEmail = 0;

    for (const u of allUsers) {
      byRole[u.role]   = (byRole[u.role]   || 0) + 1;
      byStatus[u.verificationStatus] = (byStatus[u.verificationStatus] || 0) + 1;
      byProvider[u.authProvider]     = (byProvider[u.authProvider]     || 0) + 1;
      if (u.isBanned)           banned++;
      if (!u.isActive)          inactive++;
      if (!u.isEmailVerified)   unverifiedEmail++;
    }

    console.log(`\n${BOLD}📊 Summary${RESET}  (${CYAN}${total} total users${RESET})\n`);

    console.log(`  ${BOLD}By Role:${RESET}`);
    for (const [role, count] of Object.entries(byRole)) {
      console.log(`    ${colorFor(role)}${pad(role, 10)}${RESET}  ${BOLD}${count}${RESET}`);
    }

    console.log(`\n  ${BOLD}By Verification Status:${RESET}`);
    for (const [status, count] of Object.entries(byStatus)) {
      console.log(`    ${statusColor(status)}${pad(status, 14)}${RESET}  ${BOLD}${count}${RESET}`);
    }

    console.log(`\n  ${BOLD}By Auth Provider:${RESET}`);
    for (const [provider, count] of Object.entries(byProvider)) {
      console.log(`    ${pad(provider, 10)}  ${BOLD}${count}${RESET}`);
    }

    console.log(`\n  ${RED}Banned:${RESET}           ${BOLD}${banned}${RESET}`);
    console.log(`  ${YELLOW}Inactive:${RESET}         ${BOLD}${inactive}${RESET}`);
    console.log(`  ${DIM}Email Unverified:${RESET}  ${BOLD}${unverifiedEmail}${RESET}`);

    // ── Per-user table ────────────────────────────────────────────────────────
    console.log(`\n${separator()}`);
    console.log(`${BOLD}👥 All Users${RESET}\n`);

    const COL = { idx: 4, name: 24, email: 30, role: 9, status: 14, provider: 8, login: 5, flags: 14 };
    const header =
      `${BOLD}` +
      `${pad('#',     COL.idx     )} ` +
      `${pad('Name',  COL.name    )} ` +
      `${pad('Email', COL.email   )} ` +
      `${pad('Role',  COL.role    )} ` +
      `${pad('Verif Status', COL.status  )} ` +
      `${pad('Auth',  COL.provider)} ` +
      `${pad('Logins',COL.login   )} ` +
      `Flags` +
      `${RESET}`;

    console.log(header);
    console.log(separator('─', 120));

    allUsers.forEach((u, i) => {
      const name   = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'N/A';
      const flags  = [
        u.isBanned       ? `${RED}BANNED${RESET}`   : null,
        !u.isActive      ? `${YELLOW}INACTIVE${RESET}` : null,
        !u.isEmailVerified ? `${DIM}UNVERF_EMAIL${RESET}` : null,
      ].filter(Boolean).join(' ');

      const roleColor = colorFor(u.role);
      const stColor   = statusColor(u.verificationStatus);

      console.log(
        `${pad(i + 1, COL.idx)} ` +
        `${pad(name,                       COL.name    )} ` +
        `${DIM}${pad(u.email || '—',      COL.email   )}${RESET} ` +
        `${roleColor}${pad(u.role || '—', COL.role    )}${RESET} ` +
        `${stColor}${pad(u.verificationStatus || '—', COL.status)}${RESET} ` +
        `${pad(u.authProvider || '—',     COL.provider)} ` +
        `${pad(u.loginCount   ?? 0,       COL.login   )} ` +
        `${flags || `${GREEN}OK${RESET}`}`
      );
    });

    console.log(separator('─', 120));
    console.log(`\n${GREEN}✅ Done. ${total} users listed.${RESET}\n`);

  } catch (err) {
    console.error(`\n${RED}❌ Error connecting to MongoDB:${RESET}`, err.message);
    console.error(DIM, err.stack, RESET);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
