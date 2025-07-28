import bcrypt from 'bcrypt';

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
