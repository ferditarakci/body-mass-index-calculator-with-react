import { createContext, useEffect, useState } from 'react'
import Translations from '../translations'

const AppLangContext = createContext()

const AppLangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'tr')

  const getLang = (text) => {
    return Translations[lang][text]
  }

  const values = {
    lang,
    setLang,
    getLang,
  }

  useEffect(() => {
    localStorage.setItem('lang', lang)

    const html = document.querySelector('html')
    html.classList.remove('tr')
    html.classList.remove('en')
    html.classList.add(lang)
    html.setAttribute('lang', lang)
  }, [lang])

  return <AppLangContext.Provider value={values}>{children}</AppLangContext.Provider>
}

export { AppLangProvider }
export default AppLangContext
