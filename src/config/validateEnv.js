const REQUIRED = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

export function validateEnv() {
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length) {
    console.error('\n❌ Variables d\'environnement manquantes :');
    missing.forEach(k => console.error(`   • ${k}`));
    console.error('\nCopiez server/.env.example → server/.env et remplissez les valeurs.\n');
    process.exit(1);
  }
}
