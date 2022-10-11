import React from "react"
import { AppLangProvider } from "./context/AppLangContext"
import { AppContextProvider } from "./context/AppContext"
import AppContainer from "./components/AppContainer"

const App = () => {
	return (
		<AppLangProvider>
			<AppContextProvider>
				<AppContainer />
			</AppContextProvider>
		</AppLangProvider>
	)
}

export default App