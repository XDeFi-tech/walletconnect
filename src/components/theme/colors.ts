import { ThemedCssFunction } from 'styled-components/macro'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color
}

declare module 'styled-components/macro' {
  export interface DefaultTheme extends Colors {
    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToTablet: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToProSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToXMedium: ThemedCssFunction<DefaultTheme>
      upToProMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      upToExtraLarge: ThemedCssFunction<DefaultTheme>
    }
  }
}
