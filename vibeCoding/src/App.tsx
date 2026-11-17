import { useState } from 'react'
import { AuthPanel } from './components/AuthPanel'
import { BrandPanel } from './components/BrandPanel'
import type { Session } from './types'
import styles from './App.module.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <BrandPanel />

        <section className={styles.workspace} aria-label="校园图书馆账号服务">
          <header className={styles.serviceNavigation}>
            <p>校园图书管理系统</p>
            <a href="#help">
              <img src="/assets/circle-help.svg" alt="" aria-hidden="true" />
              <span>使用帮助</span>
            </a>
          </header>

          <div className={styles.stage} aria-live="polite">
            {session ? (
              <WelcomePanel
                session={session}
                onSignOut={() => setSession(null)}
              />
            ) : (
              <AuthPanel onAuthenticated={setSession} />
            )}
          </div>

          <footer className={styles.pageFooter}>
            <nav className={styles.footerLinks} aria-label="服务信息">
              <a href="#privacy">隐私政策</a>
              <a href="#contact">联系图书馆</a>
              <span>服务时间 08:00–22:00</span>
            </nav>
            <p>© 2026 知行校园图书馆 · 让知识触手可及</p>
          </footer>
        </section>
      </div>
    </main>
  )
}

function WelcomePanel({
  session,
  onSignOut,
}: {
  session: Session
  onSignOut: () => void
}) {
  const registered = session.method === 'register'

  return (
    <div className={styles.welcomePanel}>
      <p className={styles.welcomeOverline}>SESSION ACTIVE</p>
      <h2>{registered ? '账号创建成功' : '登录成功'}</h2>
      <p className={styles.welcomeCopy}>
        {registered
          ? `${session.displayName}，你的图书馆账号已经准备好。`
          : `${session.displayName}，欢迎回到知行校园图书馆。`}
      </p>
      <div className={styles.accountCard}>
        <img src="/assets/shield-check.svg" alt="" aria-hidden="true" />
        <div>
          <p>已进入校园阅读服务</p>
          <span>{session.account}</span>
        </div>
      </div>
      <button className={styles.returnAction} type="button" onClick={onSignOut}>
        安全退出
        <img src="/assets/arrow-right.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  )
}

export default App
