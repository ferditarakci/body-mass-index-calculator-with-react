import { useContext, useState, useEffect } from 'react'
import AppContext from '../context/AppContext'
import AppLangContext from '../context/AppLangContext'
import {
  Grid,
  Divider,
  Typography,
  Button,
  FormControl,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material'

const Note =
  'NOT: Enerji harcaması için bulunan değer ortalama bir değer olup, bireyin vücut tipi, yaptığı aktivitenin şiddeti, yaşı vb. bireysel faktörlere göre değişiklik gösterebilir. Kaynak: Maughan R, Nutrition in Sport, 2001, Blackwell Science Ltd.'

const formInitialValues = {
  activityGroup: '',
  activity: '',
  activityDuration: null,
  weight: null,
}

const resultInitialValues = {
  title: '',
  description: '',
}

const EnergySpentByActivity = () => {
  const { getLang } = useContext(AppLangContext)
  const { numericInput, isNull, randNumber } = useContext(AppContext)
  const [form, setForm] = useState(formInitialValues)
  const [activities, setActivities] = useState([])
  const [activityList, setActivityList] = useState([])
  const [result, setResult] = useState(resultInitialValues)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let obj = {}

    if (form.activityGroup === '') {
      obj.activityGroup = 0
    }

    if (form.activity === '') {
      obj.activity = 0
    }

    if (isNull(form.weight) || isNaN(form.weight)) {
      obj.weight = ''
    }

    if (isNull(form.activityDuration) || isNaN(form.activityDuration)) {
      obj.activityDuration = ''
    }

    obj = { ...form, ...obj }

    setForm(obj)

    let isValidate =
      obj.activityGroup === 0 ||
      obj.activity === 0 ||
      obj.weight === '' ||
      obj.activityDuration === ''

    if (!isValidate) {
      const activity = obj.activity

      const weight = obj.weight

      const activityDuration = obj.activityDuration

      const calorie = randNumber((activity / 60) * weight * activityDuration, 2)

      setResult({
        title: getLang('activityResultTitle').replace(/#123#/i, calorie),
        description: getLang('activityResultDescription').replace(/#123#/i, calorie),
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      const getActivities = await (await fetch(`api/activities.json`)).json()
      setActivities(getActivities)
    })()
  }, [])

  useEffect(() => {
    setForm({ ...form, activity: '' })

    if (form.activityGroup !== '') {
      const getActivities = activities.find(({ name }) => name === form.activityGroup)?.activities
      setActivityList(getActivities || [])
    }
  }, [form.activityGroup])

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1.5}>
        <Grid item xs={6} sm={6} md={2.5}>
          <FormControl fullWidth error={!form.activityGroup && form.activityGroup === 0}>
            <InputLabel id="activityGroup">{getLang('activityGroup')}</InputLabel>
            <Select
              label={getLang('activityGroup')}
              labelId="activityGroup"
              value={form.activityGroup}
              onChange={(e) => setForm({ ...form, activityGroup: e.target.value })}
            >
              <MenuItem value={form.gender === '' ? '' : 0}>{getLang('choose')}</MenuItem>
              {activities.map(({ name }, index) => (
                <MenuItem value={name} key={index}>
                  {name}
                </MenuItem>
              ))}
            </Select>
            {!form.gender && form.gender === 0 && (
              <FormHelperText style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={2.5}>
          <FormControl fullWidth error={!form.activity && form.activity === 0}>
            <InputLabel id="activity">{getLang('activity')}</InputLabel>
            <Select
              label={getLang('activity')}
              labelId="activity"
              value={form.activity}
              onChange={(e) => setForm({ ...form, activity: e.target.value })}
            >
              <MenuItem value={form.gender === '' ? '' : 0}>{getLang('choose')}</MenuItem>
              {activityList.map(({ title, value }, index) => (
                <MenuItem value={value} key={index}>
                  {title}
                </MenuItem>
              ))}
            </Select>
            {!form.gender && form.gender === 0 && (
              <FormHelperText style={{ marginLeft: 0 }}>{getLang('required')}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <FormControl fullWidth>
            <TextField
              label={getLang('activityDuration')}
              name="activityDuration"
              onInput={(e) => setForm({ ...form, activityDuration: parseFloat(e.target.value) })}
              inputProps={{ ...numericInput, step: 1 }}
              error={!form.activityDuration && form.activityDuration !== null}
            />
            {!form.activityDuration && form.activityDuration !== null && (
              <FormHelperText error style={{ marginLeft: 0 }}>
                {getLang('required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <FormControl fullWidth>
            <TextField
              label={getLang('weight')}
              name="weight"
              onInput={(e) => setForm({ ...form, weight: parseFloat(e.target.value) })}
              inputProps={{ ...numericInput, step: 1 }}
              error={!form.weight && form.weight !== null}
            />
            {!form.weight && form.weight !== null && (
              <FormHelperText error style={{ marginLeft: 0 }}>
                {getLang('required')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          <Button type="submit" size="large" variant="contained" className="btn" fullWidth>
            {getLang('calculate')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {(result.title || result.description) && <Divider style={{ margin: '2rem 0' }} />}
          {result.title && (
            <Typography
              variant="h2"
              style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--orange)' }}
              align="center"
            >
              {result.title}
            </Typography>
          )}
          {result.description && <Typography align="center">{result.description}</Typography>}
          {result.description && (
            <Typography align="center" style={{ marginTop: '2rem' }}>
              <Typography variant="caption">{Note}</Typography>
            </Typography>
          )}
        </Grid>
      </Grid>
    </form>
  )
}

export default EnergySpentByActivity
