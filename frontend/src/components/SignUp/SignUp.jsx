/* eslint-disable eqeqeq */
import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { toast, ToastContainer } from 'react-toastify'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Alert from '@mui/material/Alert'
import { signup } from '../../services/auth'
import { NavLink, useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

function Copyright (props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const theme = createTheme()

export default function SignUp () {
  const [state, setState] = useState({ errMsg: '', succMsg: '', imagePath: '' })
  const [exist, setExist] = useState({ errMsg: '', succMsg: '' });

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [contact, setContact] = useState('')

  // regex
  const regexEmail =
    // eslint-disable-next-line no-empty-character-class
    /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/
  const regexUserName = /^[a-zA-Z\- ]+$/
  const regexPassword =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  const regexContact =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

  const navigate = useNavigate()

  const uploadImage = event => {
    if (event.target.files.length > 0) {
      setState({ ...state, imagePath: event.target.files[0] })
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (
      !regexUserName.test(userName) ||
      !regexContact.test(contact) ||
      !regexEmail.test(email) ||
      !regexPassword.test(password) ||
      password != confirmPassword
    ) {
      return toast('Invalid Fields')
    }
    if (state.imagePath != '') {
      if (
        state.imagePath.type == 'image/jpg' ||
        state.imagePath.type == 'image/jpeg' ||
        state.imagePath.type == 'image/png' ||
        state.imagePath.type == 'image/jfif'
      ) {
        // when we upload any attachment we can send the data with FormData
        const data = new FormData(event.currentTarget)
        const senddata = new FormData()
        senddata.append('userName', data.get('name'))
        senddata.append('email', data.get('email'))
        senddata.append('password', data.get('password'))
        senddata.append('contact', data.get('contact'))
        senddata.append('attach', state.imagePath)

        const data1 = await signup(senddata);
        if(data1.status === 201){
          navigate('/')
        }
        else if(data1.status == 202){
          setExist({...exist, errMsg : "User Already Exist"})
        }
        else{
          navigate('/signup')
        }
      } else {
        setState({ ...state, errMsg: 'Only support Jpg and Png Image' })
      }
    } else {
      setState({ ...state, errMsg: 'Please select a image' })
    }
  }

  return (
    <>
      <ToastContainer></ToastContainer>
      <ThemeProvider theme={theme}>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Create Account
            </Typography>
            {state.errMsg != '' && (
              <Alert severity='error'>{state.errMsg}</Alert>
            )}
            {state.succMsg != '' && (
              <Alert severity='success'>{state.succMsg}</Alert>
              )}
            {exist.errMsg != '' &&
              <Alert severity='error'>{exist.errMsg}</Alert>
            }
            <Box
              component='form'
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete='given-name'
                    name='name'
                    required
                    fullWidth
                    id='name'
                    label='User Name'
                    autoFocus
                    onChange={e => setUserName(e.target.value)}
                  />
                  {userName === '' || regexUserName.test(userName) ? null : (
                    <small style={{ color: 'red' }} className='mx-1'>
                      Invalid Username
                    </small>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='email'
                    label='Email'
                    type='email'
                    name='email'
                    autoComplete='Email'
                    onChange={e => setEmail(e.target.value)}
                  />
                  {email === '' || regexEmail.test(email) ? null : (
                    <small style={{ color: 'red' }} className='mx-1'>
                      Invalid Email
                    </small>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='password'
                    type='password'
                    label='Password'
                    name='password'
                    autoComplete='Password'
                    onChange={e => setPassword(e.target.value)}
                  />
                  {password === '' || regexPassword.test(password) ? null : (
                    <small style={{ color: 'red' }} className='mx-1'>
                      Password mush contain a number, special character
                    </small>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name='cpassword'
                    label='Confirm Password'
                    type='password'
                    id='cpassword'
                    autoComplete='cpassword'
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  {password === confirmPassword ? null : (
                    <small style={{ color: 'red' }} className='mx-1'>
                      Password did not match
                    </small>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id='contact'
                    label='contact'
                    name='contact'
                    autoComplete='contact'
                    onChange={e => setContact(e.target.value)}
                  />
                  {contact === '' || regexContact.test(contact) ? null : (
                    <small style={{ color: 'red' }} className='mx-1'>
                      Invalid Contact Number
                    </small>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type='file'
                    id='image'
                    label='Image'
                    name='image'
                    autoComplete='image'
                    onChange={uploadImage}
                  />
                  {state.errMsg ? (
                    <small style={{ color: 'red' }} className='mx-1'>
                      {state.errMsg}
                    </small>
                  ) : null}
                </Grid>
              </Grid>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent='flex-end'>
                <Grid item>
                  <NavLink to='/'>
                    <Link variant='body2'>
                      Already have an account? Sign in
                    </Link>
                  </NavLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </>
  )
}
