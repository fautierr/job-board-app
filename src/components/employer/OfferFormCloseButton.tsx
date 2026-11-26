import { CloseIcon } from '../icons'

export function OfferFormCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label='Cerrar formulario'
      className='inline-flex rounded-md p-1 text-muted transition-colors hover:bg-line/30 hover:text-ink'
    >
      <CloseIcon className='h-6 w-6' />
    </button>
  )
}
