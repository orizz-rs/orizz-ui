import { forwardRef, type JSX } from 'react'
import { NumberInput, type NumberInputProps } from '../number-input'

export interface CurrencyInputProps
  extends Omit<NumberInputProps, 'prefix' | 'inputMode'> {
  readonly currency: string
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ currency, ...props }, ref): JSX.Element {
    return (
      <NumberInput
        {...props}
        ref={ref}
        prefix={currency}
        inputMode="decimal"
      />
    )
  },
)

CurrencyInput.displayName = 'CurrencyInput'
