import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('\x1b[31mError: Please provide a password to hash.\x1b[0m');
  console.log('Usage: node scripts/hash-password.mjs "yourSecurePassword"');
  process.exit(1);
}

const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('\x1b[32m=== Craftora Admin Password Hash Generator ===\x1b[0m');
console.log('Password:', password);
console.log('\x1b[36mGenerated Hash:\x1b[0m', hash);
console.log('\nAdd this to your .env / Vercel Environment Variables:');
console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
