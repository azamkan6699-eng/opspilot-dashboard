import PropTypes from 'prop-types'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal.jsx'
import { Button } from './Button.jsx'

/**
 * Reusable confirmation dialog for destructive actions.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-100 dark:bg-danger-900/30">
            <AlertTriangle className="h-4 w-4 text-danger-600 dark:text-danger-400" aria-hidden="true" />
          </span>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{description}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
  confirmVariant: PropTypes.oneOf(['danger', 'primary']),
  loading: PropTypes.bool,
}
