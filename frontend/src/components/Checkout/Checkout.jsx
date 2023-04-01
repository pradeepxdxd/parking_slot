import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useRazorpay from 'react-razorpay'
import {
  getSlotInfo,
  slotBooking,
  createOrder,
  createVerify,
  getPaymentDetails
} from '../../services/auth'
import { toast, ToastContainer } from 'react-toastify'
import sweetAlert from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css'
import './Checkout.css'

export default function Checkout () {
  const { id, from, to } = useParams()

  const [data, setData] = useState([])
  const [min, setMin] = useState()
  const [count, setCount] = useState()
  const [amount, setAmount] = useState()
  const [payment, setPayment] = useState(false)

  const navigate = useNavigate()
  const Razorpay = useRazorpay()
  const auth = useSelector(state => state.auth);
  const slot = useSelector(state => state.slot.state);

  const from1 = slot.from;
  const to1 = slot.to;

  // console.log(typeof from);
  // console.log(from1, "reduxxxxxxxxxxxxxxxxxxxxxxxx");
  // console.log(String(from1).split("T")[1].split(":")[2].split(".")[0]);

  const paymentSuccess = () => {
    sweetAlert.fire({
      title: 'Payment Successfull!',
      icon: 'success'
    })
  }

  const headers = {
    headers: {
      Authorization: `Bearer ${auth.token}`
    }
  }

  useEffect(() => {
    getSlotInfo(id, headers).then(res => {
      setData(res.data.info)
      const totalTime = getTotalTime()
      setCount(totalTime)
      if (res.data.info.vehicle === 'TWO') {
        setAmount(totalTime * 10 + 50)
      } else {
        setAmount(totalTime * 10 + 100)
      }
    })
  }, [])

  const getTotalTime = () => {
    var time_start = new Date() ;
    var time_end = new Date() ;
    var value_start = from.split(' ')[4].split(':')
    var value_end = to.split(' ')[4].split(':')
    // var value_end = '07:30:00'.split(':')
    // var value_start = String(from1).split("T")[1].split(":")[2].split(".")[0]
    // var value_end = String(to1).split("T")[1].split(":")[2].split(".")[0]

    // console.log(value_start);

    time_start.setHours(value_start[0], value_start[1], value_start[2], 0)
    time_end.setHours(value_end[0], value_end[1], value_end[2], 0)
// console.log(time_start, "anddddd", time_end);
    const x = time_end - time_start

    let ans = Math.floor((x / 1000 / 60) << 0)

    // console.log(ans)
    setMin(ans)

    let count = 0
    while (ans > 0) {
      count = count + 1
      ans = ans - 30
      // console.log(ans)
    }

    return count
  }

  // const handleSubmit = e => {
  //   e.preventDefault()
  //   if (
  //     cardHolder == '' ||
  //     expMonth == '' ||
  //     expYear == '' ||
  //     cardNumber == '' ||
  //     cvv == ''
  //   ) {
  //     toast('fields are required')
  //   } else {
  //     // userId,
  //     const response = {
  //       user_id: userId,
  //       slot_id: data._id,
  //       slot_no: data.slot_no,
  //       from: from,
  //       to: to,
  //       type: data.vehicle
  //     }

  //     slotBooking(response, headers).then(() => {
  //       paymentSuccess()
  //       navigate('/dashboard')
  //     })
  //   }
  // }

  const handleSubmit = e => {
    e.preventDefault()
    createOrder({ amount }).then(res => {
      handleRazorPayment(res.data)
    })
  }

  const handleRazorPayment = useCallback(
    result => {
      const options = {
        key: 'rzp_test_pyeJr11ulLzEDM',
        amount: result.data.amount,
        currency: result.data.currency,
        order_id: result.data.id,
        name: auth.name,
        description: 'Test Transaction',

        handler: res => {
          createVerify({ response: res }).then(() => {
            getPaymentDetails({
              razorpay_payment_id: res?.razorpay_payment_id
            }).then(() => {
              setPayment(true)
            })
          })
        },
        prefill: {
          name: auth.name,
          email: auth.email,
          contact: auth.contact
        },
        notes: {
          address: 'Neosoft'
        },
        theme: {
          color: '#3399cc'
        }
      }
      const rzpay = new Razorpay(options)
      rzpay.open()
    },
    [Razorpay]
  )

  useEffect(() => {
    const response = {
      user_id: auth._id,
      slot_id: data._id,
      slot_no: data.slot_no,
      from: from,
      to: to,
      type: data.vehicle
    }

    slotBooking(response, headers).then(() => {
      paymentSuccess()
      navigate('/dashboard')
    })
  }, [payment])

  return (
    <>
      <ToastContainer />
      <main className='page payment-page'>
        <section className='payment-form dark'>
          <div className='container'>
            <div className='block-heading'>
              <h2>Payment</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                quam urna, dignissim nec auctor in, mattis vitae leo.
              </p>
            </div>
            <form>
              <div className='products'>
                <h3 className='title'>Checkout</h3>
                {data.vehicle === 'TWO' ? (
                  <div className='item'>
                    <span className='price'>Two Wheeler</span>
                    <p className='item-name'>Vehicle</p>
                    {/* <p className='item-description'>
                      Lorem ipsum dolor sit amet
                    </p> */}
                  </div>
                ) : (
                  <div className='item'>
                    <span className='price'>Four Wheeler</span>
                    <p className='item-name'>Vehicle</p>
                    {/* <p className='item-description'>
                        Lorem ipsum dolor sit amet
                      </p> */}
                  </div>
                )}

                <div className='item'>
                  <span className='price'>{data.slot_no}</span>
                  <p className='item-name'>Slot No.</p>
                  {/* <p className='item-description'>Lorem ipsum dolor sit amet</p> */}
                </div>
                <div className='item'>
                  <span className='price'>{from.split(' ')[4]}</span>
                  <p className='item-name'>From</p>
                  {/* <p className='item-description'>Lorem ipsum dolor sit amet</p> */}
                </div>
                <div className='item'>
                  <span className='price'>{to.split(' ')[4]}</span>
                  <p className='item-name'>To</p>
                  {/* <p className='item-description'>Lorem ipsum dolor sit amet</p> */}
                </div>
                <div className='item'>
                  <span className='price'>{min} minutes</span>
                  <p className='item-name'>Total Time</p>
                  {/* <p className='item-description'>Lorem ipsum dolor sit amet</p> */}
                </div>
                {data.vehicle === 'TWO' ? (
                  <div className='total'>
                    Total Amount
                    <span className='price'>
                      <span>&#8377;</span>
                      {count * 10 + 50}
                    </span>
                  </div>
                ) : (
                  <div className='total'>
                    Total Amount
                    <span className='price'>
                      <span>&#8377;</span>
                      {count * 10 + 100}
                    </span>
                  </div>
                )}
              </div>
              {/* <div className='card-details'>
                <h3 className='title'>Credit Card Details</h3>
                <div className='row'>
                  <div className='form-group col-sm-7'>
                    <label htmlFor='card-holder'>Card Holder</label>
                    <input
                      required
                      id='card-holder'
                      type='text'
                      className='form-control'
                      placeholder='Card Holder'
                      aria-label='Card Holder'
                      aria-describedby='basic-addon1'
                      onChange={e => setCardHolder(e.target.value)}
                    />
                    {cardHolder === '' ||
                    regCardHolder.test(cardHolder) ? null : (
                      <small style={{ color: '#fc552b' }} className='mx-1'>
                        Invalid Name
                      </small>
                    )}
                  </div>
                  <div className='form-group col-sm-5'>
                    <label htmlFor=''>Expiration Date</label>
                    <div className='input-group expiration-date'>
                      <input
                        type='text'
                        required
                        className='form-control'
                        placeholder='MM'
                        aria-label='MM'
                        aria-describedby='basic-addon1'
                        onChange={e => setExpMonth(e.target.value)}
                      />
                      <span className='date-separator'>/</span>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='YY'
                        aria-label='YY'
                        aria-describedby='basic-addon1'
                        required
                        onChange={e => setExpYear(e.target.value)}
                      />
                    </div>
                    {expMonth === '' ||
                    expYear === '' ||
                    (regExpMonth.test(expMonth) &&
                      regExpYear.test(expYear)) ? null : (
                      <small style={{ color: '#fc552b' }} className='mx-1'>
                        Invalid Expiration Date
                      </small>
                    )}
                  </div>
                  <div className='form-group col-sm-8 mt-3'>
                    <label htmlFor='card-number'>Card Number</label>
                    <input
                      id='card-number'
                      type='text'
                      className='form-control'
                      required
                      placeholder='Card Number'
                      aria-label='Card Holder'
                      aria-describedby='basic-addon1'
                      onChange={e => setCardNumber(e.target.value)}
                    />
                    {cardNumber === '' ||
                    regCardNumber.test(cardNumber) ? null : (
                      <small style={{ color: '#fc552b' }} className='mx-1'>
                        Invalid Card Number
                      </small>
                    )}
                  </div>
                  <div className='form-group col-sm-4 mt-3'>
                    <label htmlFor='cvc'>CVV</label>
                    <input
                      id='cvc'
                      type='password'
                      className='form-control'
                      placeholder='CVV'
                      aria-label='Card Holder'
                      aria-describedby='basic-addon1'
                      required
                      onChange={e => setCvv(e.target.value)}
                    />
                    {cvv === '' || regCvv.test(cvv) ? null : (
                      <small style={{ color: '#fc552b' }} className='mx-1'>
                        Invalid CVV
                      </small>
                    )}
                  </div>

                  <div className='form-group col-sm-12'>
                    <button
                      type='submit'
                      // disabled
                      className='btn btn-primary btn-block'
                      onClick={handleSubmit}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div> */}
              <div className='form-group col-sm-12'>
                <button
                  type='submit'
                  // disabled
                  className='btn btn-primary btn-block'
                  onClick={handleSubmit}
                >
                  Proceed
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
