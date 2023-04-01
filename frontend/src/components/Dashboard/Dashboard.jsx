import React, { useEffect, useState } from 'react'
import DateTimePicker from 'react-datetime-picker'
import { toast, ToastContainer } from 'react-toastify'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addSlot } from '../../redux/reducer/slotSlice.js'
import { getVehicleSlots, getStatisticsByMonth } from '../../services/auth'
import './Dashboard.css'
import 'react-toastify/dist/ReactToastify.css'

export default function DashBoard () {
  const [vehicle, setVehicle] = useState('')
  const [fromValue, fromValueOnChange] = useState(new Date())
  const [toValue, toValueOnChange] = useState(new Date())
  const [formDone, setFormDone] = useState(false)
  const [data, setData] = useState([])
  const [color, setColor] = useState(false)
  const [itemId, setItemId] = useState('')
  const [year, setYear] = useState(2022)

  const auth = useSelector(state => state.auth);

  const token = localStorage.getItem("token");

  const [options, setOptions] = useState({
    chart: {
      inverted: false
    },
    title: {
      text: 'Statistics Of Booking'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
    },
    yAxis: {
      title: {
        text: 'Price'
      }
    },
    series: [
      {
        type: 'line',
        data: [],
        name: 'total booking'
      }
    ]
  })

  const dispatch = useDispatch()

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    getStatisticsByMonth(year, headers).then(res => {
      setOptions({
        ...options,
        series: {
          type: 'line',
          data: res.data,
          name: 'total booking'
        }
      })
    })
  }, [])

  useEffect(() => {
    getStatisticsByMonth(year, headers).then(res => {
      setOptions({
        ...options,
        series: {
          type: 'line',
          data: res.data,
          name: 'total booking'
        }
      })
    })
  }, [year, formDone])

  const handleSubmit = e => {
    e.preventDefault()
    if (vehicle === '') {
      return toast('please fill the form for booking')
    }
    // dispatch(booking({ vehicle: vehicle, from: fromValue, to: toValue }))
    dispatch(addSlot({ vehicle: vehicle, from: fromValue, to: toValue }))
    setFormDone(true)
  }

  useEffect(() => {
    getVehicleSlots(vehicle, fromValue, toValue, headers).then(res => {
      setData(res.data.result)
    })
  }, [formDone])

  const handleBackButton = () => {
    setFormDone(false)
    setData(null)
    navigate('/dashboard')
  }

  const handleColor = id => {
    if (!color) {
      document.getElementById(id).style.background = '#f7f42d'
      document.getElementById(id).style.border = '#f7f42d'
      setColor(true)
      setItemId(id)
    } else {
      document.getElementById(id).style.background = 'green'
      document.getElementById(id).style.border = 'green'
      setColor(false)
    }
  }

  const handleBooking = () => {
    if (color) {
      navigate(`/checkout/${itemId}/${fromValue}/${toValue}`)
    } else {
      // apply toastify
      toast('Please select a slot for booking')
    }
  }

  const handleYear = e => {
    setYear(e.target.value)
  }

  return (
    <>
      <ToastContainer></ToastContainer>
      {formDone ? null : (
        <div className='col-md-7 mt-4' style={{ width: '100vw' }}>
          <Form.Select
            onChange={handleYear}
            aria-label='Default select example'
            style={{ width: '150px', float: 'right' }}
            className='mx-5'
          >
            <option>Select Year</option>
            <option value={2022} onClick={handleYear}>
              2022
            </option>
            <option value={2023} onClick={handleYear}>
              2023
            </option>
          </Form.Select>
          <HighchartsReact highcharts={Highcharts} options={options} />
          <hr />
        </div>
      )}
      <br />
      {formDone ? (
        <div>
          <div className='main'>
            <div className='wrapper'>
              {data?.map(item =>
                item.booked ? (
                  <Button variant='danger' className='numbers' key={item._id}>
                    {item.slot_no}
                  </Button>
                ) : (
                  <Button
                    id={item._id}
                    variant='success'
                    className='numbers'
                    key={item._id}
                    onClick={() => handleColor(item._id)}
                  >
                    {item.slot_no}
                  </Button>
                )
              )}
            </div>
          </div>
          <div className='text-center mt-2 group-btn pb-4 pt-3'>
            <Button variant='outline-primary' onClick={handleBackButton}>
              Back
            </Button>
            <Button
              variant='outline-success'
              className='mx-3'
              onClick={handleBooking}
            >
              Book
            </Button>
          </div>
        </div>
      ) : (
        <div className='row'>
          <div className='mx-auto col-10 col-md-8 col-lg-6'>
            <Card>
              <Card.Body>
                <Card.Title className='text-center card-title'>
                  Book Your Slot!
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Choose Vehicle</Form.Label>
                    <Form.Check
                      type='radio'
                      id='TWO'
                      label='TWO'
                      name='vehical'
                      value='TWO'
                      onChange={e => setVehicle(e.target.value)}
                    />
                    <Form.Check
                      type='radio'
                      id='FOUR'
                      label='FOUR'
                      name='vehical'
                      value='FOUR'
                      onChange={e => setVehicle(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>From</Form.Label>
                    <div>
                      <DateTimePicker
                        onChange={fromValueOnChange}
                        value={fromValue}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className='mb-3' controlId='formBasicPassword'>
                    <Form.Label>To</Form.Label>
                    <div>
                      <DateTimePicker
                        onChange={toValueOnChange}
                        value={toValue}
                      />
                    </div>
                  </Form.Group>
                  <Button className='mt-2' variant='primary' type='submit'>
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
      <br />
    </>
  )
}
