import { forwardRef, type JSX, type ReactNode } from 'react'
import { NumberInput, type NumberInputProps } from '../number-input'

export interface QuantityInputProps
  extends Omit<NumberInputProps, 'inputMode' | 'suffix'> {
  readonly unit: ReactNode
}

export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
  function QuantityInput({ unit, ...props }, ref): JSX.Element {
    return <NumberInput {...props} ref={ref} suffix={unit} inputMode="decimal" />
  },
)

QuantityInput.displayName = 'QuantityInput'
