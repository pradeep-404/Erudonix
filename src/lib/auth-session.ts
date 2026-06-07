const SECRET_KEY = process.env.JWT_SECRET || 'erudogix-super-secret-key-123456789'
const encoder = new TextEncoder()

// Helper to import raw secret key for HMAC
async function getSigningKey() {
  const keyData = encoder.encode(SECRET_KEY)
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

// Convert string to base64 (Edge-safe)
function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

// Convert base64 to string (Edge-safe)
function base64Decode(str: string): string {
  return decodeURIComponent(escape(atob(str)))
}

export async function encryptSession(payload: any): Promise<string> {
  const key = await getSigningKey()
  const dataStr = JSON.stringify({
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 1 day expiry
  })
  const dataBytes = encoder.encode(dataStr)
  
  const signature = await crypto.subtle.sign('HMAC', key, dataBytes)
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    
  return `${base64Encode(dataStr)}.${signatureHex}`
}

export async function decryptSession(token: string): Promise<any | null> {
  try {
    const [dataBase64, signatureHex] = token.split('.')
    if (!dataBase64 || !signatureHex) return null
    
    const dataStr = base64Decode(dataBase64)
    const dataBytes = encoder.encode(dataStr)
    const key = await getSigningKey()
    
    // Verify signature
    const signature = await crypto.subtle.sign('HMAC', key, dataBytes)
    const expectedHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      
    if (signatureHex !== expectedHex) {
      return null
    }
    
    const payload = JSON.parse(dataStr)
    if (payload.exp && Date.now() > payload.exp) {
      return null // Expired
    }
    
    return payload
  } catch (err) {
    return null
  }
}
