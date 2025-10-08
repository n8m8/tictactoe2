/**
 * Redis client wrapper that supports both Vercel KV REST API and direct Redis connections
 */

// Check which connection method to use
const hasRestApi = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)
const hasDirectUrl = !!process.env.KV_URL

export const useKV = hasRestApi || hasDirectUrl

// Log which storage backend is being used
if (hasRestApi) {
  console.log('[Storage] Using Vercel KV (REST API)')
} else if (hasDirectUrl) {
  console.log('[Storage] Using Redis (direct connection)')
} else {
  console.log('[Storage] Using in-memory storage (no Redis configured)')
}

// Unified Redis interface
interface RedisClient {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: any, options?: { ex?: number }): Promise<void>
  exists(key: string): Promise<number>
  del(key: string): Promise<void>
}

class IORedisClient implements RedisClient {
  private client: any

  constructor(url: string) {
    // Dynamic import to avoid loading ioredis when not needed
    const Redis = require('ioredis')
    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    })

    this.client.on('error', (err: Error) => {
      console.error('[Redis] Connection error:', err)
    })

    this.client.on('connect', () => {
      console.log('[Redis] Connected successfully')
    })
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key)
    return value ? JSON.parse(value) : null
  }

  async set(
    key: string,
    value: any,
    options?: { ex?: number }
  ): Promise<void> {
    const serialized = JSON.stringify(value)
    if (options?.ex) {
      await this.client.setex(key, options.ex, serialized)
    } else {
      await this.client.set(key, serialized)
    }
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }
}

class VercelKVClient implements RedisClient {
  private kv: any

  constructor() {
    const { kv } = require('@vercel/kv')
    this.kv = kv
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.kv.get<T>(key)
  }

  async set(
    key: string,
    value: any,
    options?: { ex?: number }
  ): Promise<void> {
    await this.kv.set(key, value, options)
  }

  async exists(key: string): Promise<number> {
    return await this.kv.exists(key)
  }

  async del(key: string): Promise<void> {
    await this.kv.del(key)
  }
}

// Create the appropriate client instance
let redisClient: RedisClient | null = null

if (hasRestApi) {
  redisClient = new VercelKVClient()
} else if (hasDirectUrl) {
  redisClient = new IORedisClient(process.env.KV_URL!)
}

export { redisClient }
