import React from 'react'
import { useMemo } from 'react'
import {
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider
} from 'styled-components'
import { Colors } from './colors'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 768,
  upToTablet: 1024,
  upToSmall: 1366,
  upToProSmall: 1440,
  upToMedium: 1536,
  upToXMedium: 1680,
  upToProMedium: 1800,
  upToLarge: 1920,
  upToExtraLarge: 2560
}

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `
  return accumulator
}, {}) as any

const white = '#FFFFFF'
const black = '#000000'

function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,
    modal: {
      bg: '#2b2b2b'
    },
    wallet: {
      descColor: '#c4c4c4',
      titleColor: '#f2f1f1',
      bg: '#333333'
    }
  }
}

function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    wallets: { grid: '1fr 1fr 1fr' },

    //shadows
    mediaWidth: mediaWidthTemplates
  }
}

export default function ThemeProvider({ children }: { children: any }) {
  const themeObject = useMemo(() => theme(false), [])

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  )
}
