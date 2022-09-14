import { useCallback, useState } from 'react'

export const useWalletsModal = () => {
  const [isOpen, setOpen] = useState(false)

  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const onOpen = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return {
    isOpen,
    onOpen,
    onClose
  }
}
