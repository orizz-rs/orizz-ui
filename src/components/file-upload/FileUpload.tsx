import { FileUp, X } from 'lucide-react'
import {
  useId,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type JSX,
  type ReactNode,
} from 'react'
import { FormField } from '../form-field'
import styles from './FileUpload.module.css'

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  readonly label: string
  readonly files?: readonly File[]
  readonly defaultFiles?: readonly File[]
  readonly onFilesChange?: (files: readonly File[]) => void
  readonly accept?: string
  readonly multiple?: boolean
  readonly maxFiles?: number
  readonly maxFileSize?: number
  readonly hint?: ReactNode
  readonly error?: ReactNode
  readonly disabled?: boolean
  readonly fullWidth?: boolean
}

function formatFileSize(size: number): string {
  return size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  label,
  files,
  defaultFiles = [],
  onFilesChange,
  accept,
  multiple = false,
  maxFiles = multiple ? 10 : 1,
  maxFileSize,
  hint,
  error,
  disabled = false,
  fullWidth = false,
  id,
  className,
  ...divProps
}: FileUploadProps): JSX.Element {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const [internalFiles, setInternalFiles] = useState<readonly File[]>(defaultFiles)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const selectedFiles = files ?? internalFiles
  const classes = [styles.root, fullWidth ? styles.fullWidth : undefined, className].filter(Boolean).join(' ')

  const updateFiles = (nextFiles: readonly File[]): void => {
    if (files === undefined) setInternalFiles(nextFiles)
    onFilesChange?.(nextFiles)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const incomingFiles = Array.from(event.currentTarget.files ?? [])
    const combinedFiles = multiple ? [...selectedFiles, ...incomingFiles] : incomingFiles.slice(0, 1)
    const validFiles = maxFileSize === undefined ? combinedFiles : combinedFiles.filter((file) => file.size <= maxFileSize)
    if (validFiles.length > maxFiles) {
      setValidationMessage(`Select up to ${maxFiles} file${maxFiles === 1 ? '' : 's'}.`)
      return
    }
    if (validFiles.length !== combinedFiles.length) {
      setValidationMessage('One or more files exceed the allowed size.')
      return
    }
    setValidationMessage(null)
    updateFiles(validFiles)
    event.currentTarget.value = ''
  }

  const removeFile = (file: File): void => {
    updateFiles(selectedFiles.filter((selectedFile) => selectedFile !== file))
  }

  const fieldError = error ?? validationMessage

  return (
    <div {...divProps} className={classes}>
      <FormField error={fieldError} hint={hint} htmlFor={inputId} label={label} messageId={messageId}>
        <div className={styles.control}>
          <input id={inputId} className={styles.input} type="file" accept={accept} multiple={multiple} disabled={disabled} aria-describedby={hint || fieldError ? messageId : undefined} onChange={handleChange} />
          <label className={styles.dropzone} htmlFor={inputId}>
            <FileUp aria-hidden="true" />
            <span><strong>Choose file{multiple ? 's' : ''}</strong><small>{accept ? `Accepted: ${accept}` : 'Select from your device'}</small></span>
          </label>
          {selectedFiles.length > 0 ? <ul className={styles.files}>{selectedFiles.map((file) => <li key={`${file.name}-${file.lastModified}`}><span><strong>{file.name}</strong><small>{formatFileSize(file.size)}</small></span><button type="button" disabled={disabled} aria-label={`Remove ${file.name}`} onClick={() => removeFile(file)}><X aria-hidden="true" /></button></li>)}</ul> : null}
        </div>
      </FormField>
    </div>
  )
}
