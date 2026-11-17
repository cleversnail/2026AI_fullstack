import { useState, type FormEvent } from 'react'
import {
  hasErrors,
  isFormReady,
  validateAll,
  validateField,
  type FieldName,
  type ValidationErrors,
} from '../lib/validation'
import type {
  AuthMode,
  AuthValues,
  Identity,
  Session,
} from '../types'
import { FormField } from './FormField'
import styles from './AuthPanel.module.css'

interface AuthPanelProps {
  onAuthenticated: (session: Session) => void
}

const rememberedAccount =
  typeof window === 'undefined'
    ? ''
    : (window.localStorage.getItem('zhixing-campus-account') ?? '')

const initialValues: AuthValues = {
  account: rememberedAccount,
  password: '',
  remember: true,
  identity: 'student',
  name: '',
  campusId: '',
  email: '',
  confirmPassword: '',
  terms: false,
}

function getInitialMode(): AuthMode {
  if (typeof window === 'undefined') return 'login'
  const hash = window.location.hash.replace('#', '')
  return hash === 'register' || hash === 'forgot' ? hash : 'login'
}

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean
  onToggle: () => void
}) {
  return (
    <button
      className={styles.iconButton}
      type="button"
      aria-label={visible ? '隐藏密码' : '显示密码'}
      aria-pressed={visible}
      onClick={onToggle}
    >
      <img src="/assets/eye-off.svg" alt="" aria-hidden="true" />
    </button>
  )
}

export function AuthPanel({ onAuthenticated }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>(getInitialMode)
  const [values, setValues] = useState<AuthValues>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmPassword: false,
  })

  const ready = isFormReady(mode, values)

  function updateValue<K extends keyof AuthValues>(
    field: K,
    value: AuthValues[K],
  ) {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)

    if (
      field === 'account' ||
      field === 'password' ||
      field === 'name' ||
      field === 'campusId' ||
      field === 'email' ||
      field === 'confirmPassword' ||
      field === 'terms'
    ) {
      const fieldName = field as FieldName
      if (errors[fieldName]) {
        setErrors((current) => ({
          ...current,
          [fieldName]: validateField(fieldName, nextValues, mode),
        }))
      }
    }

    if (notice) setNotice('')
  }

  function validateOnBlur(field: FieldName) {
    setErrors((current) => ({
      ...current,
      [field]: validateField(field, values, mode),
    }))
  }

  function changeMode(nextMode: AuthMode) {
    if (submitting) return
    setMode(nextMode)
    setErrors({})
    setNotice('')
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${nextMode}`)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateAll(mode, values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 750))

    if (mode === 'forgot') {
      setNotice('重置邮件已发送，请前往校园邮箱查收。')
      setSubmitting(false)
      return
    }

    if (mode === 'login') {
      if (values.remember) {
        window.localStorage.setItem(
          'zhixing-campus-account',
          values.account.trim(),
        )
      } else {
        window.localStorage.removeItem('zhixing-campus-account')
      }

      setSubmitting(false)
      onAuthenticated({
        displayName: values.account.trim(),
        account: values.account.trim(),
        method: 'login',
      })
      return
    }

    setSubmitting(false)
    onAuthenticated({
      displayName: values.name.trim(),
      account: values.email.trim(),
      method: 'register',
    })
  }

  const submitLabel =
    mode === 'login' ? '登 录' : mode === 'register' ? '创建账号' : '发送重置邮件'
  const submittingLabel =
    mode === 'login' ? '正在登录' : mode === 'register' ? '正在创建账号' : '正在发送'

  return (
    <div
      className={`${styles.panel} ${styles[mode]}`}
      aria-live="polite"
    >
      <div className={styles.view} key={mode}>
        {mode === 'login' ? (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.intro}>
              <p className={styles.overline}>WELCOME BACK</p>
              <h2 className={styles.title}>欢迎回到知行</h2>
              <p className={styles.description}>
                登录校园账号，继续你的阅读与探索。
              </p>
            </div>

            <div className={styles.credentials}>
              <FormField
                id="login-account"
                label="校园账号 / 学号"
                value={values.account}
                placeholder="请输入学号、工号或校园账号"
                autoComplete="username"
                iconSrc="/assets/user-round.svg"
                error={errors.account}
                onChange={(value) => updateValue('account', value)}
                onBlur={() => validateOnBlur('account')}
              />
              <FormField
                id="login-password"
                label="密码"
                value={values.password}
                placeholder="请输入登录密码"
                type={visiblePasswords.password ? 'text' : 'password'}
                autoComplete="current-password"
                maxLength={20}
                iconSrc="/assets/lock-keyhole.svg"
                error={errors.password}
                trailing={
                  <PasswordToggle
                    visible={visiblePasswords.password}
                    onToggle={() =>
                      setVisiblePasswords((current) => ({
                        ...current,
                        password: !current.password,
                      }))
                    }
                  />
                }
                onChange={(value) => updateValue('password', value)}
                onBlur={() => validateOnBlur('password')}
              />

              <div className={styles.preferences}>
                <label className={styles.checkLabel}>
                  <input
                    className={styles.nativeCheckbox}
                    type="checkbox"
                    checked={values.remember}
                    onChange={(event) =>
                      updateValue('remember', event.target.checked)
                    }
                  />
                  <span
                    className={`${styles.checkbox} ${
                      values.remember ? styles.checked : ''
                    }`}
                    aria-hidden="true"
                  >
                    {values.remember ? (
                      <img src="/assets/check.svg" alt="" />
                    ) : null}
                  </span>
                  <span>记住登录</span>
                </label>
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={() => changeMode('forgot')}
                >
                  忘记密码？
                </button>
              </div>

              <button
                className={styles.primaryAction}
                type="submit"
                disabled={!ready || submitting}
              >
                {submitting ? (
                  <span className={styles.spinner} aria-hidden="true" />
                ) : null}
                <span>{submitting ? submittingLabel : submitLabel}</span>
                {!submitting ? (
                  <img
                    className={styles.actionIcon}
                    src="/assets/arrow-right.svg"
                    alt=""
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            </div>

            <div className={styles.accountNavigation}>
              <span>还没有图书馆账号？</span>
              <button
                className={styles.textButtonStrong}
                type="button"
                onClick={() => changeMode('register')}
              >
                立即注册
                <img
                  src="/assets/arrow-right-small.svg"
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className={styles.accountGuidance}>
              <span className={styles.divider} aria-hidden="true" />
              <div className={styles.securityNote}>
                <img src="/assets/shield-check.svg" alt="" aria-hidden="true" />
                <div>
                  <p className={styles.noteTitle}>全校师生，统一使用</p>
                  <p className={styles.noteCopy}>
                    学生与教职工均可登录。公共电脑使用后，请及时退出账号，保护个人借阅信息。
                  </p>
                </div>
              </div>
            </div>
          </form>
        ) : null}

        {mode === 'register' ? (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.intro}>
              <p className={styles.overline}>YOUR NEXT CHAPTER</p>
              <h2 className={styles.title}>开启你的阅读之旅</h2>
              <p className={styles.description}>
                创建图书馆账号，让每一次求知都有迹可循。
              </p>
            </div>

            <div className={styles.registrationDetails}>
              <div className={styles.identityGroup}>
                <p className={styles.fieldLabel} id="identity-label">
                  我是
                </p>
                <div
                  className={styles.identityChoices}
                  role="radiogroup"
                  aria-labelledby="identity-label"
                >
                  <IdentityChoice
                    value="student"
                    selected={values.identity}
                    label="学生"
                    iconSrc="/assets/graduation-cap.svg"
                    onChange={(identity) => updateValue('identity', identity)}
                  />
                  <IdentityChoice
                    value="staff"
                    selected={values.identity}
                    label="教职工"
                    iconSrc="/assets/briefcase-business.svg"
                    onChange={(identity) => updateValue('identity', identity)}
                  />
                </div>
              </div>

              <div className={styles.twoColumn}>
                <FormField
                  id="register-name"
                  label="姓名"
                  value={values.name}
                  placeholder="请输入真实姓名"
                  autoComplete="name"
                  error={errors.name}
                  onChange={(value) => updateValue('name', value)}
                  onBlur={() => validateOnBlur('name')}
                />
                <FormField
                  id="register-campus-id"
                  label="学号 / 工号"
                  value={values.campusId}
                  placeholder="请输入学号或工号"
                  autoComplete="username"
                  error={errors.campusId}
                  onChange={(value) => updateValue('campusId', value)}
                  onBlur={() => validateOnBlur('campusId')}
                />
              </div>

              <div className={styles.fieldWithGuidance}>
                <FormField
                  id="register-email"
                  label="校园邮箱"
                  value={values.email}
                  placeholder="请输入校园邮箱地址"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  iconSrc="/assets/mail.svg"
                  error={errors.email}
                  onChange={(value) => updateValue('email', value)}
                  onBlur={() => validateOnBlur('email')}
                />
                <p className={styles.guidance}>
                  用于账号验证与借阅提醒，请填写本人校园邮箱。
                </p>
              </div>

              <div className={styles.twoColumn}>
                <FormField
                  id="register-password"
                  label="密码"
                  value={values.password}
                  placeholder="请设置登录密码"
                  type={visiblePasswords.password ? 'text' : 'password'}
                  autoComplete="new-password"
                  maxLength={20}
                  error={errors.password}
                  trailing={
                    <PasswordToggle
                      visible={visiblePasswords.password}
                      onToggle={() =>
                        setVisiblePasswords((current) => ({
                          ...current,
                          password: !current.password,
                        }))
                      }
                    />
                  }
                  onChange={(value) => updateValue('password', value)}
                  onBlur={() => validateOnBlur('password')}
                />
                <FormField
                  id="register-confirm-password"
                  label="确认密码"
                  value={values.confirmPassword}
                  placeholder="请再次输入密码"
                  type={visiblePasswords.confirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  maxLength={20}
                  error={errors.confirmPassword}
                  trailing={
                    <PasswordToggle
                      visible={visiblePasswords.confirmPassword}
                      onToggle={() =>
                        setVisiblePasswords((current) => ({
                          ...current,
                          confirmPassword: !current.confirmPassword,
                        }))
                      }
                    />
                  }
                  onChange={(value) => updateValue('confirmPassword', value)}
                  onBlur={() => validateOnBlur('confirmPassword')}
                />
              </div>
              <p className={styles.passwordGuidance}>
                密码为 8–20 位，须包含字母与数字。
              </p>
            </div>

            <div className={styles.registrationActions}>
              <div className={styles.termsRow}>
                <label className={styles.checkOnlyLabel}>
                  <input
                    className={styles.nativeCheckbox}
                    type="checkbox"
                    checked={values.terms}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                    onChange={(event) =>
                      updateValue('terms', event.target.checked)
                    }
                  />
                  <span
                    className={`${styles.checkbox} ${
                      values.terms ? styles.checked : ''
                    }`}
                    aria-hidden="true"
                  >
                    {values.terms ? (
                      <img src="/assets/check.svg" alt="" />
                    ) : null}
                  </span>
                  <span className={styles.srOnly}>
                    同意服务条款与隐私政策
                  </span>
                </label>
                <p>
                  我已阅读并同意
                  <a href="#terms">《服务条款》</a>与
                  <a href="#privacy">《隐私政策》</a>
                </p>
              </div>
              {errors.terms ? (
                <p id="terms-error" className={styles.termsError} role="alert">
                  {errors.terms}
                </p>
              ) : null}

              <button
                className={styles.primaryAction}
                type="submit"
                disabled={!ready || submitting}
              >
                {submitting ? (
                  <span className={styles.spinner} aria-hidden="true" />
                ) : null}
                <span>{submitting ? submittingLabel : submitLabel}</span>
                {!submitting ? (
                  <img
                    className={styles.actionIcon}
                    src="/assets/arrow-right.svg"
                    alt=""
                    aria-hidden="true"
                  />
                ) : null}
              </button>
              <p className={styles.verificationNote}>
                注册后，我们将向你的校园邮箱发送验证邮件。
              </p>
            </div>

            <div className={styles.accountNavigation}>
              <span>已有账号？</span>
              <button
                className={styles.textButtonStrong}
                type="button"
                onClick={() => changeMode('login')}
              >
                返回登录
                <img
                  src="/assets/arrow-up-right.svg"
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
          </form>
        ) : null}

        {mode === 'forgot' ? (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.intro}>
              <p className={styles.overline}>ACCOUNT RECOVERY</p>
              <h2 className={styles.title}>找回访问权限</h2>
              <p className={styles.description}>
                输入校园邮箱，我们会发送一封密码重置邮件。
              </p>
            </div>

            <div className={styles.credentials}>
              <FormField
                id="forgot-email"
                label="校园邮箱"
                value={values.email}
                placeholder="请输入校园邮箱地址"
                type="email"
                inputMode="email"
                autoComplete="email"
                iconSrc="/assets/mail.svg"
                error={errors.email}
                onChange={(value) => updateValue('email', value)}
                onBlur={() => validateOnBlur('email')}
              />
              {notice ? (
                <p className={styles.notice} role="status">
                  {notice}
                </p>
              ) : null}
              <button
                className={styles.primaryAction}
                type="submit"
                disabled={!ready || submitting}
              >
                {submitting ? (
                  <span className={styles.spinner} aria-hidden="true" />
                ) : null}
                <span>{submitting ? submittingLabel : submitLabel}</span>
                {!submitting ? (
                  <img
                    className={styles.actionIcon}
                    src="/assets/arrow-right.svg"
                    alt=""
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            </div>

            <div className={styles.accountNavigation}>
              <span>想起密码了？</span>
              <button
                className={styles.textButtonStrong}
                type="button"
                onClick={() => changeMode('login')}
              >
                返回登录
                <img
                  src="/assets/arrow-right-small.svg"
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  )
}

function IdentityChoice({
  value,
  selected,
  label,
  iconSrc,
  onChange,
}: {
  value: Identity
  selected: Identity
  label: string
  iconSrc: string
  onChange: (identity: Identity) => void
}) {
  const active = value === selected

  return (
    <button
      className={`${styles.identityChoice} ${
        active ? styles.identityChoiceActive : ''
      }`}
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onChange(value)}
    >
      <img src={iconSrc} alt="" aria-hidden="true" />
      <span>{label}</span>
      <span
        className={`${styles.selectionIndicator} ${
          active ? styles.selectionIndicatorActive : ''
        }`}
        aria-hidden="true"
      >
        {active ? <img src="/assets/check.svg" alt="" /> : null}
      </span>
    </button>
  )
}
