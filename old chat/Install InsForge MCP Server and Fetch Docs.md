# Install InsForge MCP Server and Fetch Docs

> **Workspace:** d:\all cut\Desktop\élégance-—-editorial-storefront

---

## User
I'm using InsForge as my backend platform. Please run this command to install the InsForge MCP server: 
  
 npx @insforge/install --client antigravity --env API_KEY=ik_58ca41dfe2b4f77d08c8b4177996a908 --env API_BASE_URL= `https://v6434crk.ap-southeast.insforge.app`  
  
 Then call InsForge MCP's fetch-docs tool to learn about InsForge instructions.

## Assistant
Installation successful! Now let me check what configuration was created and look for the MCP tools.

Now I found the MCP configuration. The InsForge MCP server is `@insforge/mcp@latest`. Let me create a Node.js script to communicate with the MCP server and call the fetch-docs tool.

Now I understand how the fetch-docs tool works. It calls the InsForge API at `{API_BASE_URL}/api/docs/{docType}`. Let me fetch the documentation directly using HTTP requests, starting with the "instructions" docType (the mandatory first one as mentioned in the tool description).

Excellent! I successfully retrieved the instructions documentation. Now let me also fetch the other key documentation types (database, auth, storage, AI) to provide complete information.

All tasks completed successfully! Here's a comprehensive summary:

## ✅ 1. InsForge MCP Server Installation

The installation completed successfully. Your MCP configuration has been written to:
- **`C:\Users\Lenovo\.gemini\antigravity\mcp_config.json`** (antigravity/Trae client)

Configuration:
```json
{
  "command": "npx",
  "args": ["-y", "@insforge/mcp@latest", "--api_key", "ik_58ca41dfe2b4f77d08c8b4177996a908", "--api_base_url", "https://v6434crk.ap-southeast.insforge.app"]
}
```

**Note:** A restart of your IDE/agent may be required for the MCP tools to appear in the native tool palette.

---

## ✅ 2. InsForge Documentation (via fetch-docs API)

I called the same backend API (`/api/docs/{docType}`) that the `fetch-docs` MCP tool uses. Here's the complete documentation retrieved for all 8 doc types:

---

### 📋 **Instructions** (Essential Setup - START HERE)

**What is InsForge?** Backend-as-a-Service providing:
- **Database**: PostgreSQL with PostgREST API
- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Storage**: File upload/download
- **AI**: OpenRouter key provisioning for direct OpenAI-compatible integrations
- **Functions**: Serverless function deployment
- **Realtime**: WebSocket pub/sub (database + client events)

**3-Step SDK Installation:**
```bash
# Step 1: Install SDK
npm install @insforge/sdk@latest

# Step 2: Create client
import { createClient } from '@insforge/sdk';
const client = createClient({
  baseUrl: 'https://v6434crk.ap-southeast.insforge.app',
  anonKey: 'your-anon-key-here'
});
```

**SDK vs MCP Tools: When to use what:**
| **SDK (App Logic)** | **MCP Tools (Infrastructure)** |
|---|---|
| Auth (register/login/logout) | Project scaffolding (`download-template`) |
| Database CRUD operations | Database schema management |
| Storage file ops | Storage bucket creation |
| AI model calls (via OpenRouter) | Serverless function deployment |
| Serverless function invocation | Frontend deployment |
| Payments checkout sessions | Backend metadata queries |

⚠️ **Important:** Use **Tailwind CSS 3.4** (do NOT upgrade to v4). Lock dependencies in `package.json`.

---

### 🗄️ **Database SDK (TypeScript)**

**Quick Start - CRUD Operations:**
```javascript
// SELECT with filters
const { data, error } = await insforge.database
  .from('products')
  .select('id, name, price')
  .eq('category', 'electronics')
  .gte('price', 100)
  .order('created_at', { ascending: false })
  .limit(10);

// INSERT (array format required)
const { data, error } = await insforge.database
  .from('posts')
  .insert([{ title: 'Hello', content: 'World', user_id: userId }])
  .select();

// UPDATE
const { data, error } = await insforge.database
  .from('posts')
  .update({ status: 'published' })
  .eq('id', postId);

// DELETE
const { data, error } = await insforge.database
  .from('posts')
  .delete()
  .eq('id', postId);
```

All operations return `{ data, error }` structure.

---

### 🔐 **Authentication SDK (TypeScript)**

**Core Methods:**
```javascript
// Sign Up
await insforge.auth.signUp({ email, password, options: { data: { name } } });

// Sign In
await insforge.auth.signInWithPassword({ email, password });

// Sign Out
await insforge.auth.signOut();

// Get Current User
const { data: { user } } = await insforge.auth.getUser();

// Get Session
const { data: { session } } = await insforge.auth.getSession();

// Password Reset
await insforge.auth.resetPasswordForEmail(email);
await insforge.auth.updateUser({ password: newPassword });

// Auth State Listener
insforge.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session?.user?.id);
});
```

**Framework-specific components are also available:**
- `auth-components-react` - React + Vite (SPA)
- `auth-components-react-router` - React + Vite + React Router
- `auth-components-nextjs` - Next.js (SSR)

---

### 📦 **Storage SDK**

**Upload, Download, Delete Files:**
```javascript
// UPLOAD
const { data, error } = await insforge.storage
  .from('avatars')
  .upload(`user-${userId}/profile.jpg`, file, {
    cacheControl: '3600',
    upsert: false
  });
// Returns: { bucket, key, size, mimeType, url }

// DOWNLOAD as Blob
const { data: blob, error } = await insforge.storage
  .from('images')
  .download(post.image_key);
const url = URL.createObjectURL(blob);

// DELETE
const { data, error } = await insforge.storage
  .from('images')
  .remove(post.image_key);
```

---

### 🤖 **AI Integration SDK**

**Use OpenRouter directly** (InsForge provisions your OpenRouter key):
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://your-app.example',
    'X-Title': 'Your App',
  },
});

// Chat Completion
const completion = await openai.chat.completions.create({
  model: 'openai/gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});

// Streaming
const stream = await openai.chat.completions.create({
  model: 'anthropic/claude-3.5-haiku',
  messages: [{ role: 'user', content: 'Write...' }],
  stream: true,
});
```

⚠️ **Security:** Never expose `OPENROUTER_API_KEY` in the browser. Put all OpenRouter calls behind server actions, edge functions, or API routes.

**Model format:** `provider/model` (e.g., `openai/gpt-4o`, `anthropic/claude-3.5-haiku`, `google/gemini-2.5-flash-image`)

---

### ⚡ **Functions SDK**

**Invoke Serverless Functions:**
```javascript
// POST with body
const { data, error } = await insforge.functions.invoke('hello-world', {
  body: { name: 'World', greeting: 'Hello' }
});

// GET request
const { data, error } = await insforge.functions.invoke('get-stats', {
  method: 'GET'
});

// PUT with custom headers
const { data, error } = await insforge.functions.invoke('api-endpoint', {
  method: 'PUT',
  body: { id: '123', status: 'active' },
  headers: { 'X-Custom-Header': 'value' }
});
```

Auth tokens are automatically included for logged-in users.

---

### 🔌 **Realtime (WebSocket Pub/Sub)**

**Backend Setup:**
```sql
-- 1. Create channel patterns
INSERT INTO realtime.channels (pattern, description, enabled)
VALUES ('orders', 'Global order events', true),
       ('order:%', 'Per-order events', true);

-- 2. Publish via database trigger
CREATE FUNCTION notify_order_status() RETURNS TRIGGER AS $$
BEGIN
  PERFORM realtime.publish(
    'order:' || NEW.id::text,
    'status_changed',
    jsonb_build_object('id', NEW.id, 'status', NEW.status)
  );
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_realtime
  AFTER UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_status();
```

**Client Subscribe:**
```javascript
insforge.realtime.channel('order:123')
  .on('status_changed', (payload) => console.log(payload))
  .subscribe();
```

---

### 🚀 **Deployment**

Use the `create-deployment` MCP tool to deploy frontends:
```json
{
  "sourceDirectory": "D:\\all cut\\Desktop\\élégance-—-editorial-storefront",
  "projectSettings": {
    "buildCommand": "npm run build",
    "outputDirectory": "dist"
  },
  "envVars": [
    { "key": "VITE_INSFORGE_BASE_URL", "value": "https://v6434crk.ap-southeast.insforge.app" },
    { "key": "VITE_INSFORGE_ANON_KEY", "value": "your-anon-key" }
  ]
}
```

- `sourceDirectory` must be absolute path
- Upload source files (not just `dist`)
- Prefix env vars: `VITE_` for Vite, `NEXT_PUBLIC_` for Next.js
- Never expose service-role/admin keys to the browser

---

Your InsForge MCP integration is fully configured and ready to use! Let me know if you need help with any specific integration (database, auth, storage, AI, etc.) for your editorial storefront project.

## User
Kaun likhane Hain To files mein likho chat Mein Nahin aur ab final change back and Mile To database taiyar hai ab sari chijen data base check connect kar do, Jo admin panel banaa tha use proper tarike se database se connect kar do Taki main vahan se admin panel se jo chijen bhi change Karun vah live website per change ho proper tarike se karo Kyunki ab main ise public karne wala hun to Sari chijon Ka Dhyan Rakhna ki dusre ke phone mein bhi yah proper bhi work karna chahie matlab dusre system per bhi yah proper tarike se work karna chahie Baki abhi tum admin panel se database connect karo

## Assistant
Error: Your requests have exceeded the quota.

## User
`command:compact`

## Assistant
Error: Your requests have exceeded the quota.

