import * as React from 'react';

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
) {
  const overrideProps: Record<string, unknown> = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    if (
      typeof slotPropValue === 'function' &&
      typeof childPropValue === 'function'
    ) {
      overrideProps[propName] = (...args: Array<unknown>) => {
        childPropValue(...args);
        slotPropValue(...args);
      };
    } else if (propName === 'style') {
      overrideProps[propName] = {
        ...(slotPropValue as object),
        ...(childPropValue as object),
      };
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
}

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      ...mergeProps(slotProps, child.props as Record<string, unknown>),
      ref: forwardedRef,
    } as Record<string, unknown>);
  },
);
Slot.displayName = 'Slot';

export { Slot };
