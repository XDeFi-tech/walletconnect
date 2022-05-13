import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { ReactComponent as CloseSvg } from './close.svg'

interface ModalProps {
  isOpen?: boolean
  children: ReactNode
  onOpen?: () => void
  onClose?: () => void
  className?: string
}

export const modalVariants = {
  hidden: {
    opacity: 0,
    y: '10%',
    x: '-50%'
  },
  visible: {
    opacity: 1,
    x: '-50%',
    y: '-50%',
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

export const modalBackdropVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 0.8
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
}

const modalElement = document.getElementById('app-modal')

export const Modal = ({
  isOpen = false,
  children,
  onClose,
  className
}: ModalProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const handleEscape = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        onClose?.()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape, false)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape, false)
    }
  }, [handleEscape, isOpen])

  return (
    modalElement &&
    createPortal(
      <AnimatePresence>
        {isOpen ? (
          <ModalStyled ref={ref}>
            <BackdropStyled
              variants={modalBackdropVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              onClick={onClose}
            />
            <BodyStyled
              className={className}
              variants={modalVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <CloseSvgStyled onClick={onClose} />

              {children}
            </BodyStyled>
          </ModalStyled>
        ) : null}
        )
      </AnimatePresence>,

      modalElement
    )
  )
}

const CloseSvgStyled = styled(CloseSvg)`
  margin-left: auto;
  cursor: pointer;
`

const ModalStyled = styled.div`
  position: fixed;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100%;
  z-index: 1000;
`

const BackdropStyled = styled(motion.div)`
  position: absolute;
  bottom: 0;
  right: 0;
  top: 0;
  left: 0;
  background: #000000;
  opacity: 0.8;
`

const BodyStyled = styled(motion.div)`
  width: 100%;
  padding: 24px 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 740px;
  max-height: 720px;
  opacity: 1;
  background: #2b2b2b;
  border-radius: 8px;
`
