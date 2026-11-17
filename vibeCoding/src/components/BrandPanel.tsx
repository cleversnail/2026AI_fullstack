import styles from './BrandPanel.module.css'

export function BrandPanel() {
  return (
    <aside className={styles.panel} aria-label="知行校园图书馆">
      <div className={styles.identity}>
        <div className={styles.emblem}>
          <img src="/assets/book-open.svg" alt="" aria-hidden="true" />
        </div>
        <div className={styles.nameGroup}>
          <p className={styles.chineseName}>知行 · 校园图书馆</p>
          <p className={styles.englishName}>ZHIXING CAMPUS LIBRARY</p>
        </div>
      </div>

      <div className={styles.invitation}>
        <div className={styles.introduction}>
          <div className={styles.eyebrow}>
            <span className={styles.rule} aria-hidden="true" />
            <p>让阅读，成为校园的日常</p>
          </div>
          <h1 className={styles.headline}>
            <span>在书页之间，</span>
            <span>遇见更广阔的世界。</span>
          </h1>
          <p className={styles.description}>
            一处安放好奇心的地方，一段从这里开始的求知之旅。
          </p>
        </div>

        <figure className={styles.photograph}>
          <img
            className={styles.photo}
            src="/assets/reading-room.png"
            alt="阳光照进木质书架与阅览区的图书馆空间"
          />
          <figcaption className={styles.caption}>
            <span>静心阅览，自在求知</span>
            <span>A PLACE TO EXPLORE</span>
          </figcaption>
        </figure>
      </div>

      <div className={styles.promise}>
        <span className={styles.divider} aria-hidden="true" />
        <div className={styles.serviceNote}>
          <p>为每一位同学与教职工而设</p>
          <p className={styles.motto}>博学 · 笃行</p>
        </div>
      </div>
    </aside>
  )
}
