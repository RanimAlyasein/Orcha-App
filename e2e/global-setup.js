import { mkdirSync } from 'fs';

export default async function globalSetup() {
  mkdirSync('playwright/.auth', { recursive: true });
}
