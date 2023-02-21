import packageJson from './../../package.json'
import { isLocalStorageAvailable } from './utils'

export let local: Storage

if (isLocalStorageAvailable()) {
  local = window.localStorage
}

const buildKey = (key: string) => `${packageJson.version}_${key}`

export const setLocal = (key: string, data: any) => {
  const jsonData = JSON.stringify(data)
  if (local) {
    local.setItem(buildKey(key), jsonData)
  }
}

export const getLocal = (key: string) => {
  let data = null
  let raw = null
  if (local) {
    raw = local.getItem(buildKey(key))
  }
  if (raw && typeof raw === 'string') {
    try {
      data = JSON.parse(raw)
    } catch (error) {
      return null
    }
  }
  return data
}

export const removeLocal = (key: string) => {
  if (local) {
    local.removeItem(buildKey(key))
  }
}

export const updateLocal = (key: string, data: any) => {
  const localData = getLocal(key) || {}
  const mergedData = { ...localData, ...data }
  setLocal(key, mergedData)
}
