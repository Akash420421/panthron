const API_KEY = 'ik_58ca41dfe2b4f77d08c8b4177996a908';
const API_BASE_URL = 'https://v6434crk.ap-southeast.insforge.app';

async function req(method, path, body = null) {
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${API_BASE_URL}${path}`, opts);
  const t = await r.text();
  console.log(`${method} ${path} -> ${r.status}`);
  if (t) console.log(`  ${t.substring(0, 400)}\n`);
  try { return JSON.parse(t); } catch { return t; }
}

async function main() {
  console.log('Creating company_settings table...\n');
  await req('POST', '/api/database/tables', {
    tableName: 'company_settings',
    columns: [
      { columnName: 'setting_id', type: 'string', isPrimaryKey: true, isNullable: false, isUnique: true },
      { columnName: 'company_name', type: 'string', isNullable: false, isUnique: false },
      { columnName: 'member_name', type: 'string', isNullable: true, isUnique: false },
      { columnName: 'phone', type: 'string', isNullable: true, isUnique: false },
      { columnName: 'whatsapp', type: 'string', isNullable: true, isUnique: false },
      { columnName: 'email', type: 'string', isNullable: true, isUnique: false },
      { columnName: 'address', type: 'string', isNullable: true, isUnique: false },
    ],
  });

  console.log('\nCreating categories table...\n');
  await req('POST', '/api/database/tables', {
    tableName: 'categories',
    columns: [
      { columnName: 'category_id', type: 'string', isPrimaryKey: true, isNullable: false, isUnique: true },
      { columnName: 'name', type: 'string', isNullable: false, isUnique: true },
      { columnName: 'sort_order', type: 'integer', isNullable: false, isUnique: false },
    ],
  });

  console.log('\nSeeding company settings...\n');
  await req('POST', '/api/database/records/company_settings', {
    setting_id: 'main',
    company_name: 'PANTHRON Official',
    member_name: 'Akash Singh',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'support@panthron.in',
    address: 'Panthron Store, India',
  });

  console.log('\nSeeding categories...\n');
  const cats = ['All', 'Sleeper', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Accessories'];
  const rows = cats.map((c, i) => ({ category_id: `cat-${i}`, name: c, sort_order: i }));
  await req('POST', '/api/database/records/categories', rows);

  console.log('\n=== Tables list ===');
  await req('GET', '/api/database/tables');
}

main().catch(e => console.error(e));
