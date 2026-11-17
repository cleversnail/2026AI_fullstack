export type AuthMode = 'login' | 'register' | 'forgot'

export type Identity = 'student' | 'staff'

export interface AuthValues {
  account: string
  password: string
  remember: boolean
  identity: Identity
  name: string
  campusId: string
  email: string
  confirmPassword: string
  terms: boolean
}

export interface Session {
  displayName: string
  account: string
  method: 'login' | 'register'
}
