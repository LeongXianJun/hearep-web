import React, { FC, useState, useEffect } from 'react'
import { IconButton } from '@material-ui/core'
import { Cached as CachedIcon, Done as DoneIcon } from '@material-ui/icons'

import './ReloadButton.css'

interface ComponentProp {
  isSubmitting: boolean
  onClick: () => void
  color?: 'default' | 'inherit' | 'primary' | 'secondary'
  size?: 'medium' | 'small'
}

const ReloadButton: FC<ComponentProp> = ({ isSubmitting, onClick, color = 'default', size = 'medium' }) => {
  const [ isProcessing, setIsProcessing ] = useState(false)

  useEffect(() => {
    if (isSubmitting) {
      setIsProcessing(isSubmitting)
    } else {
      const timeout = setTimeout(() => {
        setIsProcessing(isSubmitting)
      }, 2000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [ isSubmitting ])

  return (
    <IconButton
      onClick={ () => isProcessing ? null : onClick() }
      color={ color }
      size={ size }
      disableRipple
      style={ { background: 'transparent' } }
    >
      {
        isProcessing && !isSubmitting
          ? <DoneIcon style={ { color: 'green' } } fontSize={ size === 'small' ? 'small' : 'default' } />
          : <CachedIcon className={ isProcessing ? 'reload-button' : '' } fontSize={ size === 'small' ? 'small' : 'default' } />
      }
    </IconButton>
  )
}

export default ReloadButton