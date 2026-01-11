export function generateClientSeed(length = 32) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, x => chars[x % chars.length]).join('')
}