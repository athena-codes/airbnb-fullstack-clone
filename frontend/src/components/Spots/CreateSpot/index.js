import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import * as spotActions from '../../../store/spots'
import './CreateSpot.css'

export default function CreateSpotForm ({ createdSpotId, onSuccess, open }) {
  const dispatch = useDispatch()
  const history = useHistory()

  const sessionUser = useSelector(state => state.session.user)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState([])
  console.log('ERRORS -->', errors)

  if (!sessionUser) return <Redirect to={'/'} />

  const handleSubmit = async e => {
    e.preventDefault()

    return dispatch(
      spotActions.createSpotsThunk(
        {
          name,
          description,
          price,
          address,
          city,
          state,
          country,
          lat,
          lng
        },
        {
          url: previewImage,
          preview: true
        }
      )
    )
      .then(spot => {
        open(false)
        history.push(`/spots/${spot.id}`)
      })

      .catch(async res => {
        const data = await res.json()
        if (data && data.errors) setErrors(data.errors)
      })
  }

  return (
    <div className='form-container-div'>
      <div className='form-container'>
        <div className='title'>Create a Spot</div>
        <div className='form'>
          <form className='create-spot' onSubmit={handleSubmit}>
            <input
              className='input1'
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Full Name'
              required
            ></input>
            <input
              className='input1'
              type='text'
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder='Address'
              required
            ></input>
            <input
              className='input2'
              type='text'
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder='City'
              required
            ></input>
            <input
              className='input2'
              type='text'
              value={state}
              onChange={e => setState(e.target.value)}
              placeholder='State'
              required
            ></input>
            <input
              className='input2'
              type='text'
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder='Country'
              required
            ></input>
            <input
              className='input2'
              type='text'
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder='Price'
              required
            ></input>
            <input
              className='input2'
              type='text'
              value={lat}
              onChange={e => setLat(e.target.value)}
              placeholder='Latitude'
              required
            ></input>
            <input
              className='input2'
              type='text'
              value={lng}
              onChange={e => setLng(e.target.value)}
              placeholder='Longitude'
              required
            ></input>

            <textarea
              className='input-desc'
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Description'
              required
            ></textarea>
            <input
              className='input-img'
              type='url'
              value={previewImage}
              onChange={e => setPreviewImage(e.target.value)}
              placeholder='Preview Image'
              required
            ></input>
            {/* <ul className='errors'>
            {errors.map((error, id) => (
              <li key={id}>{error}</li>
            ))}
          </ul> */}
            <button type='submit'>Create Spot</button>
          </form>
        </div>
      </div>
    </div>
  )
}
