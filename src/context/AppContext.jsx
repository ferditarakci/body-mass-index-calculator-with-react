import { createContext } from 'react'

const AppContext = createContext()

const numericInput = {
  type: 'number',
  autoComplete: 'off',
  inputMode: 'numeric',
  pattern: '[0-9]*',
  min: 0,
  max: 250,
  step: 0.1,
}

const isNull = (value) => {
  return value === null
}

const randNumber = (num, dec) => {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)
}

const AppContextProvider = ({ children }) => {
  const name = process.env.REACT_APP_MY_NAME
  const title = process.env.REACT_APP_TITLE
  const domain = process.env.REACT_APP_DOMAIN

  const values = {
    name,
    title,
    domain,
    numericInput,
    isNull,
    randNumber,
  }

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>
}

export { AppContextProvider }
export default AppContext
