import { forwardRef, type JSX } from 'react'
import { NumberInput, type NumberInputProps } from '../number-input'

export type PercentageInputProps = Omit<
  NumberInputProps,
  'inputMode' | 'suffix'
>

export const PercentageInput = forwardRef<
  HTMLInputElement,
  PercentageInputProps
>(function PercentageInput(props, ref): JSX.Element {
  return <NumberInput {...props} ref={ref} suffix="%" inputMode="decimal" />
})

PercentageInput.displayName = 'PercentageInput'
