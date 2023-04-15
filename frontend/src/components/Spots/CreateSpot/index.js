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
  console.log('PREV IMAGE --->', previewImage)
  const [imageUrl, setImageUrl] = useState('')
  console.log('IMAGE URL ---->', imageUrl)
  const [errors, setErrors] = useState([])

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
        const imageErrors = {}

        if (!previewImage) {
          imageErrors.previewImage = 'Preview Image is required'
        }

        if (!/\.(png|jpe?g)$/i.test(imageUrl)) {
          imageErrors.imageUrl = 'Image URL must end in .png, .jpg or .jpeg'
        }

        const combinedErrors = { ...data.errors, ...imageErrors }

        setErrors(combinedErrors)
      })
  }

  // ** add noValidate to form/submit button to prevent browser default validation msg
  return (
    <div className='form-container-div'>
      <div className='form-container'>
        <div className='form'>
          <form noValidate className='create-spot' onSubmit={handleSubmit}>
            <div className='location-section'>
              <h1 className='title'>Create a new Spot</h1>
              <div className='location-info'>
                <h2 className='form-heading'>Where's your place located?</h2>
                <p className='form-subheading'>
                  Guests will only get your exact address once they booked a
                  reservation.
                </p>
                <div className='location-inputs'>
                  <div className='input-group'></div>
                </div>
                <label htmlFor='country'>Country</label>
                <input
                  className='input2'
                  type='text'
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder='Country'
                  required
                ></input>
                {errors.country && (
                  <div className='error'>{errors.country}</div>
                )}

                <label htmlFor='address'>Street Address</label>
                <input
                  className='input1'
                  type='text'
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder='Address'
                  required
                ></input>
                {errors.address && (
                  <div className='error'>{errors.address}</div>
                )}
                <div className='city-state-labels'>
                  <label className='city' htmlFor='city'>
                    City
                  </label>
                  <label className='state' htmlFor='state'>
                    State
                  </label>
                </div>
                <div className='city-state'>
                  <input
                    className='input2'
                    type='text'
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder='City'
                    required
                  ></input>
                  {errors.city && <div className='error'>{errors.city}</div>}

                  <input
                    className='input2'
                    type='text'
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder='State'
                    required
                  ></input>
                  {errors.state && <div className='error'>{errors.state}</div>}
                </div>
                <div className='lat-lng-labels'>
                  <label className='lat' htmlFor='lat'>
                    Latitude
                  </label>
                  <label className='lng' htmlFor='lng'>
                    Longitude
                  </label>
                </div>
                <div className='lat-lng'>
                  <input
                    className='input2'
                    type='text'
                    value={lat}
                    onChange={e => setLat(e.target.value)}
                    placeholder='Latitude'
                    required
                  ></input>
                  {errors.lat && <div className='error'>{errors.lat}</div>}
                  <input
                    className='input2'
                    type='text'
                    value={lng}
                    onChange={e => setLng(e.target.value)}
                    placeholder='Longitude'
                    required
                  ></input>
                  {errors.lng && <div className='error'>{errors.lng}</div>}
                </div>
              </div>
            </div>
            <div className='description-section'>
              <h2 className='form-heading'>Describe your place to guests</h2>
              <p className='form-subheading'>
                Mention the best features of your space, any special amenities
                like fast wifi or parking, and what you love about the
                neighborhood.
              </p>
              <textarea
                className='input-desc'
                type='text'
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Please write at least 30 characters.'
                required
              ></textarea>
              {errors.description && (
                <div className='error'>{errors.description}</div>
              )}
            </div>
            <div className='title-section'>
              <h2 className='form-heading'>Create a title for your spot</h2>
              <p className='form-subheading'>
                Catch guests' attention with a spot title that highlights what
                makes your place special.
              </p>
              <input
                className='input1'
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Name of your spot'
                required
              ></input>
              {errors.name && <div className='error'>{errors.name}</div>}
            </div>
            <div className='price-section'>
              <h2 className='form-heading'>Set a base price for your spot</h2>
              <p className='form-subheading'>
                Competitive pricing can help your listing stand out and rank
                higher in search results.
              </p>
              <div className='price'>
                <p>$</p>
                <input
                  className='input2'
                  type='text'
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder='Price per night (USD)'
                  required
                ></input>
                {errors.price && <div className='error'>{errors.price}</div>}
              </div>
            </div>
            <div className='photo-section'>
              <h2 className='form-heading'>Liven up your spot with photos</h2>
              <p className='form-subheading'>
                Submit a link to AT LEAST one photo to publish your spot.
              </p>
              <input
                className='input-img'
                type='url'
                value={previewImage}
                onChange={e => setPreviewImage(e.target.value)}
                placeholder='Preview Image URL'
                required
              ></input>
              {errors.previewImage && (
                <div className='error'>{errors.previewImage}</div>
              )}

              <input
                className='input-img'
                type='url'
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder='Image URL'
                required
              ></input>
              {errors.imageUrl && (
                <div className='error'>{errors.imageUrl}</div>
              )}

              <input
                className='input-img'
                type='url'
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder='Image URL'
                required
              ></input>
              <input
                className='input-img'
                type='url'
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder='Image URL'
                required
              ></input>
              <input
                className='input-img'
                type='url'
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder='Image URL'
                required
              ></input>
            </div>
            <button className='submit-create-spot-btn' type='submit'>
              Create Spot
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
