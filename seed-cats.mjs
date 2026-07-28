import { createAdminClient } from '@insforge/sdk';

const API_KEY = 'ik_58ca41dfe2b4f77d08c8b4177996a908';
const API_BASE_URL = 'https://v6434crk.ap-southeast.insforge.app';
const adminClient = createAdminClient({ baseUrl: API_BASE_URL, apiKey: API_KEY });

async function main() {
  console.log('Seeding categories via SDK...');
  const cats = ['All', 'Sleeper', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Accessories'];
  const rows = cats.map((c, i) => ({ category_id: `cat-${Date.now()}-${i}`, name: c, sort_order: i }));
  const r = await adminClient.database.from('categories').insert(rows);
  console.log('Result:', JSON.stringify(r).substring(0, 400));

  console.log('\nVerifying settings:');
  const s = await adminClient.database.from('company_settings').select('*');
  console.log('Settings:', JSON.stringify(s).substring(0, 400));

  console.log('\nVerifying categories:');
  const c = await adminClient.database.from('categories').select('*').order('sort_order');
  console.log('Categories:', JSON.stringify(c).substring(0, 500));
}
main().catch(e => console.error(e));
