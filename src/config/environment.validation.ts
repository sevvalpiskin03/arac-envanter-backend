type Environment = Record<string, unknown>;

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

export function validateEnvironment(config: Environment): Environment {
  const port = Number(config.PORT ?? 3001);
  const nodeEnvironment = readString(config.NODE_ENV, 'development');
  const jwtSecret = readString(config.JWT_SECRET);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT, 1 ile 65535 arasında geçerli bir sayı olmalıdır.');
  }

  if (nodeEnvironment === 'production' && jwtSecret.length < 32) {
    throw new Error('JWT_SECRET üretim ortamında en az 32 karakter olmalıdır.');
  }

  return {
    ...config,
    NODE_ENV: nodeEnvironment,
    PORT: port,
    JWT_SECRET: jwtSecret || 'development-only-secret-change-me',
    JWT_EXPIRES_IN: readString(config.JWT_EXPIRES_IN, '8h'),
  };
}
