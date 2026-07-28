const { spawn } = require('child_process');

const API_KEY = 'ik_58ca41dfe2b4f77d08c8b4177996a908';
const API_BASE_URL = 'https://v6434crk.ap-southeast.insforge.app';

const isWindows = process.platform === 'win32';
const npxPath = isWindows ? 'C:\\Program Files\\nodejs\\npx.cmd' : 'npx';
const child = spawn(npxPath, ['-y', '@insforge/mcp@latest', '--api_key', API_KEY, '--api_base_url', API_BASE_URL], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
  env: process.env
});

let requestId = 0;
let buffer = '';
const pendingRequests = new Map();
let initialized = false;
let toolsListed = false;

function sendRequest(method, params) {
  const id = ++requestId;
  const message = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
  console.error(`→ ${method} (id=${id})`);
  child.stdin.write(message);
  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject, timeout: setTimeout(() => reject(new Error('Timeout')), 60000) });
  });
}

function sendNotification(method, params) {
  const message = JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n';
  console.error(`→ ${method}`);
  child.stdin.write(message);
}

child.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id !== undefined) {
        const pending = pendingRequests.get(msg.id);
        if (pending) {
          clearTimeout(pending.timeout);
          pendingRequests.delete(msg.id);
          if (msg.error) {
            console.error(`← Error (id=${msg.id}):`, msg.error);
            pending.reject(msg.error);
          } else {
            console.error(`← Response (id=${msg.id})`);
            pending.resolve(msg.result);
          }
        }
      } else if (msg.method) {
        console.error(`← Notification: ${msg.method}`);
      }
    } catch (e) {
      console.error('Parse error:', line.substring(0, 200));
    }
  }
});

child.stderr.on('data', (data) => {
  console.error('MCP stderr:', data.toString().substring(0, 500));
});

child.on('close', (code) => {
  console.error(`MCP process exited with code ${code}`);
  process.exit(code);
});

async function main() {
  try {
    console.error('\n=== Step 1: Initialize ===');
    const initResult = await sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'trae-client', version: '1.0.0' }
    });
    console.error('Initialized. Server info:', initResult?.serverInfo);

    sendNotification('notifications/initialized', {});
    initialized = true;

    console.error('\n=== Step 2: List Tools ===');
    const toolsResult = await sendRequest('tools/list', {});
    console.error('Available tools:');
    for (const tool of toolsResult.tools) {
      console.error(`  - ${tool.name}: ${tool.description}`);
    }

    console.error('\n=== Step 3: Call fetch-docs ===');
    const fetchDocsTool = toolsResult.tools.find(t => t.name === 'fetch-docs' || t.name.includes('fetch') || t.name.includes('docs'));
    if (!fetchDocsTool) {
      console.error('No fetch-docs tool found. All tools:', JSON.stringify(toolsResult.tools, null, 2));
      console.log(JSON.stringify({ error: 'fetch-docs tool not found', availableTools: toolsResult.tools }));
      process.exit(0);
    }

    const toolResult = await sendRequest('tools/call', {
      name: fetchDocsTool.name,
      arguments: {}
    });

    console.error('\n=== Tool Result ===');
    console.error('Content:', JSON.stringify(toolResult?.content));
    console.log(JSON.stringify({ tool: fetchDocsTool.name, result: toolResult }, null, 2));
    process.exit(0);

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setTimeout(() => {
  if (!initialized) {
    console.error('Timed out waiting for initialization');
    process.exit(1);
  }
}, 30000);

main();
