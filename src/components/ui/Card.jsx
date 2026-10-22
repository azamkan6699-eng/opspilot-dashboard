import PropTypes from 'prop-types'
import { cn } from '../../utils/classNames.js'

export function Card({ children, className, padding = true, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200 bg-white shadow-sm',
        'dark:border-neutral-700/80 dark:bg-neutral-800/90',
        padding && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.propTypes = {
  children:  PropTypes.node,
  className: PropTypes.string,
  padding:   PropTypes.bool,
}
