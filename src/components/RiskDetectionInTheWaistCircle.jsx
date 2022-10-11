import { useContext, useState } from "react"
import AppContext from "../context/AppContext"
import AppLangContext from "../context/AppLangContext"
import { Grid, Divider, Typography, Button, FormControl, TextField, Select, MenuItem, InputLabel, FormHelperText } from "@mui/material"

const Waist = ({ diameter, gender }) => {
	let type = 0

	if (gender === 1) {
		if (diameter <= 80) type = 1
		else if (diameter > 80 && diameter <= 88) type = 2
		else if (diameter > 88) type = 3
	}
	else if (gender === 2) {
		if (diameter <= 94) type = 1
		else if (diameter > 94 && diameter <= 102) type = 2
		else if (diameter > 102) type = 3
	}

	return type
}

const TitleColor = (index) => {
	const colors = {
		0: "",
		1: "var(--green)",
		2: "var(--yellow)",
		3: "var(--red)",
	}

	return colors[index]
}

const formInitialValues = {
	gender: "",
	diameter: null,
}

const resultInitialValues = {
	title: "",
	description: "",
	color: ""
}

const ChildBodyMassIndex = () => {

	const { getLang } = useContext(AppLangContext)
	const { numericInput, isNull } = useContext(AppContext)
	const [form, setForm] = useState(formInitialValues)
	const [result, setResult] = useState(resultInitialValues)

	const handleSubmit = async (e) => {
		e.preventDefault()

		let obj = {}

		if (form.gender === "") {
			obj.gender = 0
		}

		if (isNull(form.diameter) || isNaN(form.diameter)) {
			obj.diameter = ""
		}

		obj = { ...form, ...obj }

		setForm(obj)

		let isValidate = (obj.gender === 0 || obj.diameter === "")

		if (!isValidate) {

			const gender = obj.gender

			const diameter = obj.diameter

			const result = await (await fetch(`api/waist_risk_${gender === 1 ? 'woman' : 'man'}_contents.json`)).json()

			const waistType = Waist({ diameter, gender })

			const { title, description } = await result[waistType]

			setResult({ title, description, color: TitleColor(waistType) })
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={1.5}>
				<Grid item xs={6} sm={4} md={5}>
					<FormControl fullWidth error={!form.gender && form.gender === 0}>
						<InputLabel id="gender">{getLang('gender')}</InputLabel>
						<Select
							label={getLang('gender')}
							labelId="gender"
							value={form.gender}
							onChange={(e) => setForm({ ...form, gender: e.target.value })}
						>
							<MenuItem value={form.gender === "" ? "" : 0}>{getLang('genderOptions')[0]}</MenuItem>
							<MenuItem value={1}>{getLang('genderOptions')[1]}</MenuItem>
							<MenuItem value={2}>{getLang('genderOptions')[2]}</MenuItem>
						</Select>
						{!form.gender && form.gender === 0 && <FormHelperText style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>}
					</FormControl>
				</Grid>
				<Grid item xs={6} sm={4} md={5}>
					<FormControl fullWidth>
						<TextField
							label={getLang('diameter')}
							name="diameter"
							onInput={(e) => setForm({ ...form, diameter: parseFloat(e.target.value) })}
							inputProps={{ ...numericInput, step: 1 }}
							error={!form.diameter && form.diameter !== null}
						/>
						{!form.diameter && form.diameter !== null && <FormHelperText error style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>}
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={4} md={2}>
					<Button type="submit" size="large" variant="contained" className="btn" fullWidth>{getLang('calculate')}</Button>
				</Grid>
				<Grid item xs={12}>
					{(result.title || result.description) && <Divider style={{ margin: "2rem 0" }} />}
					{result.title && <Typography variant="h2" style={{ fontSize: "2rem", marginBottom: "1rem", color: result.color }} align="center">{result.title}</Typography>}
					{result.description && <Typography align="center">{result.description}</Typography>}
				</Grid>
			</Grid>
		</form>
	)
}

export default ChildBodyMassIndex