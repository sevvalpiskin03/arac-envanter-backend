import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';
import { PrismaClient } from '../generated/prisma/client';

async function createInitialAdmin(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  const name = process.env.INITIAL_ADMIN_NAME?.trim();
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!connectionString || !name || !email || !password) {
    throw new Error(
      'DATABASE_URL ve INITIAL_ADMIN_NAME/EMAIL/PASSWORD değerleri gereklidir.',
    );
  }

  if (password.length < 12) {
    throw new Error('İlk admin şifresi en az 12 karakter olmalıdır.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

  try {
    if ((await prisma.admin.count()) > 0) {
      throw new Error('Sistemde zaten bir admin bulunuyor.');
    }

    await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash: await hash(password),
      },
    });

    console.log(`İlk admin oluşturuldu: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

void createInitialAdmin().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
