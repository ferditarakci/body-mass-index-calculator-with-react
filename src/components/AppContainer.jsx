import React, { useContext, useState, useEffect } from "react"
import AppLangContext from "../context/AppLangContext"
import BodyMassIndex from "./BodyMassIndex"
import ChildBodyMassIndex from "./ChildBodyMassIndex"
import RiskDetectionInTheWaistCircle from "./RiskDetectionInTheWaistCircle"
import EnergySpentByActivity from "./EnergySpentByActivity"
import { Container, Tabs, Tab, Box, Typography, Divider } from "@mui/material"

function TabPanel({ children, value, index, ...other }) {
	return (
		<div
			{...other}
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
		>
			{value === index && (<Box sx={{ py: 3 }}>{children}</Box>)}
		</div>
	)
}

function a11yProps(index) {
	return {
		id: `tab-${index}`,
		'aria-controls': `tabpanel-${index}`
	}
}

const AppContainer = () => {

	const { lang, getLang, setLang } = useContext(AppLangContext)

	const [value, setValue] = useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	useEffect(() => {
		document.title = getLang('tabs')[value].replace('<br>', '')
	}, [value, getLang])

	return (
		<React.Fragment>
			<Container maxWidth="md">
				<header>
					<h1><img src="/assets/images/header-image.png" alt={process.env.REACT_APP_TITLE} /></h1>
					<div className="langs">
						{lang !== 'tr' && <button onClick={() => setLang('tr')}>
							<img src="/assets/images/tr.svg" alt="Türkçe" width="30" height="30" />
						</button>}
						{lang !== 'en' && <button onClick={() => setLang('en')}>
							<img src="/assets/images/en.svg" alt="English" width="30" height="30" />
						</button>}
					</div>
				</header>
				<Divider style={{ margin: '2rem 0' }} />
				<div>
					<Tabs
						value={value} onChange={handleChange} centered>
						<Tab {...a11yProps(0)} value={0} label={<div dangerouslySetInnerHTML={{ __html: getLang('tabs')[0] }}></div>} />
						<Tab {...a11yProps(1)} value={1} label={<div dangerouslySetInnerHTML={{ __html: getLang('tabs')[1] }}></div>} />
						<Tab {...a11yProps(2)} value={2} label={<div dangerouslySetInnerHTML={{ __html: getLang('tabs')[2] }}></div>} />
						<Tab {...a11yProps(3)} value={3} label={<div dangerouslySetInnerHTML={{ __html: getLang('tabs')[3] }}></div>} />
					</Tabs>
					<TabPanel value={value} index={0}>
						<BodyMassIndex />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<ChildBodyMassIndex />
					</TabPanel>
					<TabPanel value={value} index={2}>
						<RiskDetectionInTheWaistCircle />
					</TabPanel>
					<TabPanel value={value} index={3}>
						<EnergySpentByActivity />
					</TabPanel>
				</div>
			</Container>
			<Typography variant="h4" style={{ marginTop: '1rem', fontSize: '1rem', opacity: '0.4' }} align="center">
				<a href="https://www.ferditarakci.com.tr" target="_blank" rel="noreferrer" title="Web Developer Ferdi Tarakçı">Development: Ferdi Tarakçı</a>
			</Typography>
		</React.Fragment>
	)
}

export default AppContainer