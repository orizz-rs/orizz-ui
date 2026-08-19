import type { HTMLAttributes, JSX, ReactNode } from "react";
import styles from "./Stepper.module.css";

export type StepperStatus = "complete" | "current" | "upcoming" | "error";
export interface StepperItem {
  readonly id: string;
  readonly label: ReactNode;
  readonly description?: ReactNode;
  readonly status?: StepperStatus;
  readonly disabled?: boolean;
}
export interface StepperProps extends Omit<
  HTMLAttributes<HTMLOListElement>,
  "onChange"
> {
  readonly items: readonly StepperItem[];
  readonly current?: string;
  readonly onStepChange?: (id: string) => void;
  readonly ariaLabel?: string;
}

export function Stepper({
  items,
  current,
  onStepChange,
  ariaLabel = "Progress",
  className,
  ...listProps
}: StepperProps): JSX.Element {
  return (
    <ol
      {...listProps}
      className={[styles.stepper, className].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const status =
          item.status ?? (item.id === current ? "current" : "upcoming");
        const interactive = Boolean(onStepChange) && !item.disabled;
        return (
          <li className={[styles.step, styles[status]].join(" ")} key={item.id}>
            <button
              className={styles.marker}
              type="button"
              disabled={!interactive}
              aria-current={status === "current" ? "step" : undefined}
              onClick={() => onStepChange?.(item.id)}
            >
              <span aria-hidden="true">
                {status === "complete" ? "✓" : status === "error" ? "!" : ""}
              </span>
              <span className={styles.srOnly}>{item.label}</span>
            </button>
            <div className={styles.copy}>
              <span className={styles.label}>{item.label}</span>
              {item.description ? (
                <span className={styles.description}>{item.description}</span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
