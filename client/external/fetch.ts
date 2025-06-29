import createClient from 'openapi-fetch'
import type { paths } from './schema'

// const serverURL = 'http://localhost:8787'
const serverURL = 'http://192.168.20.11:8787'
// const serverURL = 'http://10.0.2.2:8787'

export const api = createClient<paths>({ baseUrl: serverURL })
