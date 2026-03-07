import masterJson from './api/master.json'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    
    // Serve the live API dynamically, bypassing Cloudflare's Asset caching
    if (url.pathname === '/api/master.json') {
      return new Response(JSON.stringify(masterJson), {
        headers: {
            'Content-Type': 'application/json', 
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Access-Control-Allow-Origin': '*'
        }
      })
    }
    
    // Fall back to serving static assets (like index.html) for all other routes
    if (env.ASSETS) {
        return env.ASSETS.fetch(request)
    }
    
    return new Response('Not found', {status: 404})
  }
}
