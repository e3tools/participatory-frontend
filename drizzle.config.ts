import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'sqlite',
    driver: 'expo',
    schema: './db/schema.ts', //db schema location
    out: './drizzle', //location of migrations. To generate migrations, run npx drizzle-kit generate
});
