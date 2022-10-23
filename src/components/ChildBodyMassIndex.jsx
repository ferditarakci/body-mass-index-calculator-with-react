import { useContext, useState } from "react"
import AppContext from "../context/AppContext"
import AppLangContext from "../context/AppLangContext"
import { Grid, Divider, Typography, Button, FormControl, TextField, Select, MenuItem, InputLabel, FormHelperText } from "@mui/material"

const BMI = ({bmi, p3, p15, p85, p97}) => {
	let type = 0
	if (bmi < p3) type = 1
	else if (bmi >= p3 && bmi < p15) type = 2
	else if (bmi >= p15 && bmi < p85) type = 3
	else if (bmi >= p85 && bmi < p97) type = 4
	else if (bmi >= p97) type = 5
	return type
}

const TitleColor = (index) => {
	const colors = {
		0: "",
		1: "var(--red)",
		2: "var(--turquoise)",
		3: "var(--green)",
		4: "var(--yellow)",
		5: "var(--orange)",
	}

	return colors[index]
}

const Months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]

const formInitialValues = {
	gender: "",
	month: "",
	year: "",
	height: null,
	weight: null,
}

const resultInitialValues = {
	title: "",
	description: "",
	index: "",
	color: ""
}

const ChildBodyMassIndex = () => {

	const { getLang } = useContext(AppLangContext)
	const { numericInput, isNull, randNumber } = useContext(AppContext)
	const [form, setForm] = useState(formInitialValues)
	const [result, setResult] = useState(resultInitialValues)

	const handleSubmit = async (e) => {
		e.preventDefault()

		// setResult(resultInitialValues)

		let obj = {}

		if (form.gender === "") {
			obj.gender = 0
		}

		if (form.month === "") {
			obj.month = 0
		}

		if (form.year === "") {
			obj.year = 0
		}

		if (isNull(form.height) || isNaN(form.height)) {
			obj.height = ""
		}

		if (isNull(form.weight) || isNaN(form.weight)) {
			obj.weight = ""
		}

		obj = { ...form, ...obj }

		setForm(obj)

		let isValidate = (obj.gender === 0 || obj.month === 0 || obj.year === 0 || obj.height === "" || obj.weight === "")

		if (!isValidate) {

			const gender = obj.gender

			const month = obj.month

			const year = obj.year

			const birthDate = new Date(`${year}/${month}/01`).getTime()

			const monthDiff = Math.round(((Date.now() - birthDate) / 1000 / 30 / 24 / 60 / 60))

			const yearDiff = Math.round(monthDiff / 12)

			if (yearDiff > 18) {
				alert('yaşınız büyük')
				return false
			}

			const weight = obj.weight

			const height = obj.height / 100

			const bmi = weight / (height * height)

			const dbResult = await (await fetch(`api/bmi_${gender === 1 ? 'girl' : 'boy'}_db.json`)).json()

			const {p3, p15, p85, p97} = await dbResult.find(({monthEnd}) => monthEnd === monthDiff)

			const index = randNumber(bmi, 2)

			const bmiType = BMI({bmi, p3, p15, p85, p97})

			const result = await (await fetch('api/bmi_child_contents.json')).json()

			const { title, description } = await result[bmiType]

			setResult({ title, description, index, color: TitleColor(bmiType) })
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={1.5}>
				<Grid item xs={6} md={2}>
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
				<Grid item xs={6} md={2}>
					<FormControl fullWidth error={!form.month && form.month === 0}>
						<InputLabel id="month">{getLang('month')}</InputLabel>
						<Select
							label={getLang('month')}
							labelId="month"
							value={form.month}
							onChange={(e) => setForm({ ...form, month: e.target.value })}
						>
							<MenuItem value={form.month === "" ? "" : 0}>{getLang('choose')}</MenuItem>
							{Months.map((m, i) => <MenuItem value={i + 1} key={i + 1}>{m}</MenuItem>)}
						</Select>
						{!form.gender && form.gender === 0 && <FormHelperText style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>}
					</FormControl>
				</Grid>
				<Grid item xs={6} md={2}>
					<FormControl fullWidth error={!form.year && form.year === 0}>
						<InputLabel id="year">{getLang('year')}</InputLabel>
						<Select
							label={getLang('year')}
							labelId="year"
							value={form.year}
							onChange={(e) => setForm({ ...form, year: e.target.value })}
						>
							<MenuItem value={form.year === "" ? "" : 0}>{getLang('choose')}</MenuItem>
							{(() => {
								const options = []
								const year = new Date().getFullYear()
								for (let i = 0; i < 19; i++) {
									let value = year - i
									options.push(<MenuItem value={value} key={value}>{value}</MenuItem>)
								}
								return options
							})()}
						</Select>
						{!form.year && form.year === 0 && <FormHelperText style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>}
					</FormControl>
				</Grid>
				<Grid item xs={6} md={2}>
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
				<Grid item xs={6} md={2}>
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
				<Grid item xs={6} md={2}>
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

export default ChildBodyMassIndex