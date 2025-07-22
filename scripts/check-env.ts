console.log('Checking environment variables...\n');

const envVars = [
  'DATABASE_URL',
  'NEON_DATABASE_URL', 
  'POSTGRES_URL',
  'POSTGRES_HOST',
  'POSTGRES_DATABASE',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_PORT',
  'PGHOST',
  'PGDATABASE', 
  'PGUSER',
  'PGPASSWORD',
  'PGPORT'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const isSensitive = varName.toLowerCase().includes('password') || varName.toLowerCase().includes('url');
    const displayValue = isSensitive ? '***' + value.slice(-4) : value;
    console.log(`${varName}: ${displayValue}`);
  } else {
    console.log(`${varName}: (not set)`);
  }
});
