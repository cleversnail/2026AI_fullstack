import { describe, expect, it } from 'vitest'
import { isFormReady, validateAll } from './validation'
import type { AuthValues } from '../types'

const baseValues: AuthValues = {
  account: '',
  password: '',
  remember: false,
  identity: 'student',
  name: '',
  campusId: '',
  email: '',
  confirmPassword: '',
  terms: false,
}

describe('account validation', () => {
  it('requires a valid registration email', () => {
    const errors = validateAll('register', {
      ...baseValues,
      name: '林知夏',
      campusId: '20260001',
      email: 'not-an-email',
      password: 'reading2026',
      confirmPassword: 'reading2026',
      terms: true,
    })

    expect(errors.email).toBe('请输入有效的校园邮箱地址')
  })

  it('requires an eight-character mixed password', () => {
    const errors = validateAll('register', {
      ...baseValues,
      name: '林知夏',
      campusId: '20260001',
      email: 'lin@campus.edu.cn',
      password: '12345678',
      confirmPassword: '12345678',
      terms: true,
    })

    expect(errors.password).toContain('同时包含字母和数字')
  })

  it('requires matching confirmation and terms', () => {
    const errors = validateAll('register', {
      ...baseValues,
      name: '林知夏',
      campusId: '20260001',
      email: 'lin@campus.edu.cn',
      password: 'reading2026',
      confirmPassword: 'reading2027',
      terms: false,
    })

    expect(errors.confirmPassword).toBe('两次输入的密码不一致')
    expect(errors.terms).toContain('服务条款')
  })

  it('keeps primary actions disabled until required values exist', () => {
    expect(isFormReady('login', baseValues)).toBe(false)
    expect(
      isFormReady('login', {
        ...baseValues,
        account: '20260001',
        password: 'reading2026',
      }),
    ).toBe(true)
  })

  it('allows registration submission so missing terms can be reported', () => {
    expect(
      isFormReady('register', {
        ...baseValues,
        name: '林知夏',
        campusId: '20260001',
        email: 'lin@campus.edu.cn',
        password: 'reading2026',
        confirmPassword: 'reading2026',
      }),
    ).toBe(true)
  })
})
