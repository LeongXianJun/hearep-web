import React from 'react'
import { Typography, Grid, DialogTitle, TextField, makeStyles, 
  Theme, createStyles, Button, RadioGroup, FormControlLabel, 
  Radio, FormControl, InputLabel, Select, MenuItem, 
  DialogContent, Dialog, DialogActions, useTheme, useMediaQuery } from '@material-ui/core'
import UC from '../../connections/UserConnection'

const useStyle = makeStyles((theme: Theme) => 
  createStyles({
    paper: {
      padding: theme.spacing(3),
      textAlign: 'center'
    },
    input: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  })
)

const roles = [
  { val: 'doctor', text: 'Doctor' },
  { val: 'nurse', text: 'Nurse' },
  { val: 'professional', text: 'Allied Health Professional' },
  { val: 'staff', text: 'Support Staff' }
]

export default function ProfileUpdatePage() {
  const theme = useTheme()
  const styles = useStyle()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [fullname, setFullname] = React.useState('')
  const [age, setAge] = React.useState(0)
  const [gender, setGender] = React.useState<'M' | 'F'>('M')
  const [altEmail, setAltEmail] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [institution, setInstitution] = React.useState('')
  const [role, setRole] = React.useState('')
  const [intAdd, setIntAddress] = React.useState('')
  const [department, setDepartment] = React.useState('')

  const submit = () => {
    UC.updateProfileDetail({fullname, age, gender, altEmail, phoneNumber, institution, role, intAdd, department})
  }

  return(
    <React.Fragment>
      <Dialog
        open
        fullScreen={fullScreen}
      >
        <DialogTitle disableTypography>
          <Typography variant='h4' align='left'>{'Profile Detail'}</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container direction='row' spacing={3}>
            <Grid item md={6} xs={12} container spacing={1} direction='column'>
              <Grid item>
                <Typography variant='h5' align='left'>{'Basic Information'}</Typography>
                <TextField
                  required
                  variant="outlined"
                  className={styles.input}
                  placeholder="Enter your Fullname"
                  label="Fullname"
                  fullWidth
                  onChange = {event => setFullname(event.target.value)}
                />
                <TextField
                  required
                  variant="outlined"
                  className={styles.input}
                  type="number"
                  placeholder="Enter your Age"
                  label="Age"
                  fullWidth
                  onChange = {event => setAge(Number(event.target.value))}
                />
                <FormControl fullWidth className={styles.input}>
                  <Typography variant='subtitle1' align='left'>{'Gender'}</Typography>
                  <RadioGroup row aria-label="gender" name="gender" value={gender} onChange={event => setGender(event.target.value === 'M'? 'M': 'F')}>
                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item>
                <Typography variant='h5' align='left'>{'Contact'}</Typography>
                <TextField
                  variant="outlined"
                  className={styles.input}
                  type="email"
                  placeholder="Enter your alternative Email"
                  label="Alternative Email"
                  fullWidth
                  onChange = {event => setAltEmail(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  className={styles.input}
                  placeholder="Enter your Phone Number"
                  label="Phone Number"
                  fullWidth
                  onChange = {event => setPhoneNumber(event.target.value)}
                />
              </Grid>
            </Grid>
            <Grid item md={6} xs={12} container direction='column' spacing={1} alignItems='flex-start'>
              <Typography variant='h5' align='left' noWrap>{'Working Information'}</Typography>
              <TextField
                variant="outlined"
                className={styles.input}
                placeholder="Enter your Medical Institution"
                label="Medical Institution"
                fullWidth
                onChange={event => setInstitution(event.target.value)}
              />
              <FormControl variant="outlined" fullWidth className={styles.input}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  onChange={event => setRole(event.target.value as string)}
                >
                  {
                    roles.map(({val, text}, index) => <MenuItem key={'role-' + index} value={val}>{text}</MenuItem>)
                  }
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                className={styles.input}
                placeholder="Enter the address of the Medical Institution"
                label="Address of Medical Institution"
                fullWidth
                multiline
                rows={3}
                rowsMax={3}
                onChange={event => setIntAddress(event.target.value)}
              />
              <TextField
                variant="outlined"
                className={styles.input}
                placeholder="Enter your Department"
                label="Department"
                fullWidth
                onChange = {event => setDepartment(event.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={submit}>Update Info</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}