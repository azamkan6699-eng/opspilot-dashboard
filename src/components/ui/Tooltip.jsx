import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

/**
 * Lightweight CSS-positioned tooltip. Accessible via aria-describedby.
 */
export function Tooltip({ children, content, side = 'top', className }) {
  const [visible, setVisible] = useState(false)
  const id = useRef(`tip-${Math.random().toString(36).slice(2)}`)

  if (!content) return children

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {/* Clone child to inject aria-describedby */}
      <span aria-describedby={id.current}>{children}</span>
      {visible && (
        <span
          id={id.current}
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white shadow-md dark:bg-neutral-100 dark:text-neutral-900',
            side === 'top' && 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
            side === 'bottom' && 'top-full left-1/2 mt-1.5 -translate-x-1/2',
            side === 'left' && 'right-full top-1/2 mr-1.5 -translate-y-1/2',
            side === 'right' && 'left-full top-1/2 ml-1.5 -translate-y-1/2',
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.string,
  side: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string,
}
