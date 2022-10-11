import { useContext, useState } from "react"
import AppContext from "../context/AppContext"
import AppLangContext from "../context/AppLangContext"
import { Grid, Divider, Typography, Button, FormControl, TextField, FormHelperText } from "@mui/material"

const BMI = (bmi) => {
	let type = 0
	if (bmi < 18.5) type = 1
	else if (bmi >= 18.5 && bmi < 25) type = 2
	else if (bmi >= 25 && bmi < 30) type = 3
	else if (bmi >= 30 && bmi < 35) type = 4
	else if (bmi >= 35 && bmi < 40) type = 5
	else if (bmi >= 40) type = 6
	return type
}

const TitleColor = (index) => {
	const colors = {
		0: "",
		1: "var(--turquoise)",
		2: "var(--green)",
		3: "var(--yellow)",
		4: "var(--orange)",
		5: "var(--red)",
		6: "var(--red)",
	}

	return colors[index]
}

const formInitialValues = {
	height: null,
	weight: null,
}

const resultInitialValues = {
	title: "",
	description: "",
	index: "",
	color: ""
}

const BodyMassIndex = () => {

	const { getLang } = useContext(AppLangContext)
	console.log(getLang);
	const { numericInput, isNull, randNumber } = useContext(AppContext)
	const [form, setForm] = useState(formInitialValues)
	const [result, setResult] = useState(resultInitialValues)

	const handleSubmit = async (e) => {
		e.preventDefault()

		let obj = {}

		if (isNull(form.height) || isNaN(form.height)) {
			obj.height = ""
		}

		if (isNull(form.weight) || isNaN(form.weight)) {
			obj.weight = ""
		}

		obj = { ...form, ...obj }

		setForm(obj)

		let isValidate = (obj.height === "" || obj.weight === "")

		if (!isValidate) {
			const weight = obj.weight

			const height = obj.height / 100

			const bmi = weight / (height * height)

			const index = randNumber(bmi, 2)

			const bmiType = BMI(bmi)

			const result = await (await fetch('api/bmi_contents.json')).json()

			const { title, description } = await result[bmiType]

			setResult({ title, description, index, color: TitleColor(bmiType) })
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={1.5}>
				<Grid item xs={6} sm={4} md={5}>
					<FormControl fullWidth>
						<TextField
							label={getLang('height')}
							name="height"
							onInput={(e) => setForm({ ...form, height: parseFloat(e.target.value.replace(/,/i, ".")) })}
							inputProps={numericInput}
							error={!form.height && form.height !== null}
						/>
						{!form.height && form.height !== null && <FormHelperText error style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>}
					</FormControl>
				</Grid>
				<Grid item xs={6} sm={4} md={5}>
					<FormControl fullWidth>
						<TextField
							label={getLang('weight')}
							name="weight"
							onInput={(e) => setForm({ ...form, weight: parseFloat(e.target.value.replace(/,/i, ".")) })}
							inputProps={numericInput}
							error={!form.weight && form.weight !== null}
						/>
						{!form.weight && form.weight !== null && <FormHelperText error style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>}
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={4} md={2}>
					<Button type="submit" size="large" variant="contained" className="btn" fullWidth>{getLang('calculate')}</Button>
				</Grid>
				<Grid item xs={12}>
					{(result.title || result.description) && <Divider style={{ margin: "2rem 0" }} />}
					{result.index && <Typography variant="h2" style={{ marginBottom: 0, color: result.color }} align="center">{result.index}</Typography>}
					{result.title && <Typography variant="h2" style={{ fontSize: "2rem", marginBottom: "1rem", color: result.color }} align="center">{result.title}</Typography>}
					{result.description && <Typography align="center">{result.description}</Typography>}
				</Grid>
			</Grid>
		</form>
	)
}

export default BodyMassIndex