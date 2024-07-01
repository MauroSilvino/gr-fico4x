export function decodeJWT(token: string | null | undefined): null | JWT_User {
  if (!token) return null

  // NodeJS (for Server Components)
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}
