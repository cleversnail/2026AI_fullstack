import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthPanel } from './AuthPanel'

describe('AuthPanel', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#login')
  })

  afterEach(() => {
    cleanup()
  })

  it('switches between login and registration without losing context', async () => {
    const user = userEvent.setup()
    render(<AuthPanel onAuthenticated={vi.fn()} />)

    expect(
      screen.getByRole('heading', { name: '欢迎回到知行' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登 录/ })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: /立即注册/ }))

    expect(
      screen.getByRole('heading', { name: '开启你的阅读之旅' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /学生/ })).toBeChecked()
  })

  it('shows a blur validation message for an invalid email', async () => {
    const user = userEvent.setup()
    render(<AuthPanel onAuthenticated={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /立即注册/ }))
    await user.type(screen.getByLabelText('校园邮箱'), 'invalid')
    await user.tab()

    expect(
      await screen.findByText('请输入有效的校园邮箱地址'),
    ).toBeInTheDocument()
  })

  it('enters loading and completes the login flow', async () => {
    const user = userEvent.setup()
    const onAuthenticated = vi.fn()
    render(<AuthPanel onAuthenticated={onAuthenticated} />)

    await user.type(
      screen.getByLabelText(/校园账号 \/ 学号/),
      '20260001',
    )
    await user.type(screen.getByLabelText('密码'), 'reading2026')
    await user.click(screen.getByRole('button', { name: /登 录/ }))

    expect(
      screen.getByRole('button', { name: /正在登录/ }),
    ).toBeDisabled()
    await waitFor(
      () =>
        expect(onAuthenticated).toHaveBeenCalledWith(
          expect.objectContaining({
            account: '20260001',
            method: 'login',
          }),
        ),
      { timeout: 1600 },
    )
  })
})
