import type { AuthMode, AuthValues } from '../types'

export type FieldName =
  | 'account'
  | 'password'
  | 'name'
  | 'campusId'
  | 'email'
  | 'confirmPassword'
  | 'terms'

export type ValidationErrors = Partial<Record<FieldName, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,20}$/

function validateEmail(email: string) {
  if (!email.trim()) return '请输入校园邮箱'
  if (!emailPattern.test(email)) return '请输入有效的校园邮箱地址'
  return undefined
}

function validatePassword(password: string) {
  if (!password) return '请输入密码'
  if (!passwordPattern.test(password)) {
    return '密码需为 8–20 位，且同时包含字母和数字'
  }
  return undefined
}

export function validateField(
  field: FieldName,
  values: AuthValues,
  mode: AuthMode,
): string | undefined {
  switch (field) {
    case 'account':
      return values.account.trim() ? undefined : '请输入校园账号或学号'
    case 'password':
      return validatePassword(values.password)
    case 'name':
      return values.name.trim() ? undefined : '请输入真实姓名'
    case 'campusId':
      return values.campusId.trim() ? undefined : '请输入学号或工号'
    case 'email':
      return validateEmail(values.email)
    case 'confirmPassword':
      if (!values.confirmPassword) return '请再次输入密码'
      if (values.confirmPassword !== values.password) {
        return '两次输入的密码不一致'
      }
      return undefined
    case 'terms':
      if (mode !== 'register') return undefined
      return values.terms
        ? undefined
        : '请先阅读并同意服务条款与隐私政策'
  }
}

export function validateAll(
  mode: AuthMode,
  values: AuthValues,
): ValidationErrors {
  if (mode === 'forgot') {
    return { email: validateEmail(values.email) }
  }

  if (mode === 'login') {
    return {
      account: validateField('account', values, mode),
      password: validateField('password', values, mode),
    }
  }

  return {
    name: validateField('name', values, mode),
    campusId: validateField('campusId', values, mode),
    email: validateField('email', values, mode),
    password: validateField('password', values, mode),
    confirmPassword: validateField('confirmPassword', values, mode),
    terms: validateField('terms', values, mode),
  }
}

export function hasErrors(errors: ValidationErrors) {
  return Object.values(errors).some(Boolean)
}

export function isFormReady(mode: AuthMode, values: AuthValues) {
  if (mode === 'forgot') return Boolean(values.email.trim())
  if (mode === 'login') {
    return Boolean(values.account.trim() && values.password)
  }

  return Boolean(
    values.name.trim() &&
      values.campusId.trim() &&
      values.email.trim() &&
      values.password &&
      values.confirmPassword,
  )
}
