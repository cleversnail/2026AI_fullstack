import type {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import styles from './FormField.module.css'

interface FormFieldProps {
  id: string
  label: string
  value: string
  placeholder: string
  type?: HTMLInputTypeAttribute
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete']
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
  iconSrc?: string
  error?: string
  trailing?: ReactNode
  onChange: (value: string) => void
  onBlur: () => void
}

export function FormField({
  id,
  label,
  value,
  placeholder,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
  iconSrc,
  error,
  trailing,
  onChange,
  onBlur,
}: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={`${styles.inputFrame} ${error ? styles.invalid : ''}`}>
        {iconSrc ? (
          <img className={styles.icon} src={iconSrc} alt="" aria-hidden="true" />
        ) : null}
        <input
          id={id}
          className={styles.input}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        {trailing}
      </div>
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
