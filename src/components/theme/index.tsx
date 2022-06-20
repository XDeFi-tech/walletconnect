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

export const defaultMediaWidthTemplates: {
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
    white: darkMode ? black : white,
    black: darkMode ? white : black,
    modal: {
      bg: darkMode ? '#2b2b2b' : '#E5E5E5',
      layoutBg: darkMode ? black : black
    },
    wallet: {
      name: darkMode ? white : '#333333',
      descColor: darkMode ? '#c4c4c4' : '#979797',
      titleColor: darkMode ? '#f2f1f1' : '#333333',
      bg: darkMode ? '#333333' : '#F2F1F1'
    }
  }
}

function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    wallets: { grid: '1fr 1fr 1fr' },

    //shadows
    mediaWidth: defaultMediaWidthTemplates
  }
}

export default function ThemeProvider({
  children,
  isDark = false,
  themeBuilder
}: {
  children: any
  isDark?: boolean
  themeBuilder?: (isDark: boolean) => DefaultTheme
}) {
  const themeObject = useMemo(() => {
    if (!themeBuilder) {
      return theme(isDark)
    }

    return {
      ...theme(isDark),
      ...themeBuilder(isDark)
    }
  }, [themeBuilder, isDark])

  return (
    <StyledComponentsThemeProvider theme={themeObject}>
      {children}
    </StyledComponentsThemeProvider>
  )
}
