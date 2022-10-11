import { render, screen } from "@testing-library/react"
import App from "./App"

test("search my name", () => {
	render(<App />)
	const linkElement = screen.getByText(/Ferdi Tarakçı/i)
	expect(linkElement).toBeInTheDocument()
})
