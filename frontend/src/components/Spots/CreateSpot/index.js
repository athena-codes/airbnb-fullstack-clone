import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import * as spotActions from '../../../store/spots'
import './CreateSpot.css'

export default function CreateSpotForm ({ createdSpotId, onSuccess, open }) {
  const sessionUser = useSelector(state => state.session.user)
  console.log('CURRENT USER -->', sessionUser)
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

  // ALL OTHER IMAGES BESIDES PREV IMAGE
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const dispatch = useDispatch()

  const [errors, setErrors] = useState([])
  console.log('ERRORS -->', errors)
  const history = useHistory()


  if (!sessionUser) return <Redirect to={'/'} />

  const handleSubmit = async e => {
    e.preventDefault()

    const images = [image1, image2, image3, image4]
      .filter(Boolean)
      .map(url => ({
        url,
        preview: false
      }))

    const newSpot =  dispatch(
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
        },
        images
      )
    )
      .then(spot => {
        open(false)
        history.push(`/spots/${spot.id}`)
      })

      .catch(async res => {
        const data = await res.json()
        const imageErrors = {}
        const descriptionErr = {}

        if (!previewImage) {
          imageErrors.previewImage = 'Preview Image is required'
        }

        if (!/\.(png|jpe?g)$/i.test(image1)) {
          imageErrors.imageUrl = 'Image URL must end in .png, .jpg or .jpeg'
        }

        if (description.length < 30) {
          errors.description = 'Please write at least 30 characters'
        }

        const combinedErrors = { ...data.errors, ...imageErrors, ...descriptionErr }

        setErrors(combinedErrors)
      })
      return newSpot
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
                  className='address-input'
                  type='text'
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder='Address'
                  required
                ></input>
                {errors.address && (
                  <div className='error'>{errors.address}</div>
                )}
                <div className='city-state'>
                  <div className='input-group'>
                    <label className='city' htmlFor='city'>
                      City
                    </label>
                    <input
                      className='input2'
                      type='text'
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder='City'
                      required
                    ></input>
                  </div>
                  {errors.city && <div className='error'>{errors.city}</div>}
                  <div className='input-group'>
                    <label className='state' htmlFor='state'>
                      State
                    </label>
                    <input
                      className='input2'
                      type='text'
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder='State'
                      required
                    ></input>
                  </div>
                  {errors.state && <div className='error'>{errors.state}</div>}
                </div>
                <div className='lat-lng'>
                  <div className='input-group'>
                    <label className='lat' htmlFor='lat'>
                      Latitude
                    </label>
                    <input
                      className='input2'
                      type='text'
                      value={lat}
                      onChange={e => setLat(e.target.value)}
                      placeholder='Latitude'
                      required
                    ></input>
                  </div>
                  {errors.lat && <div className='error'>{errors.lat}</div>}
                  <div className='input-group'>
                    <label className='lng' htmlFor='lng'>
                      Longitude
                    </label>
                    <input
                      className='input2'
                      type='text'
                      value={lng}
                      onChange={e => setLng(e.target.value)}
                      placeholder='Longitude'
                      required
                    ></input>
                  </div>
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
                className='name-input'
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
                value={image1}
                onChange={e => setImage1(e.target.value)}
                placeholder='Image URL'
                required
              ></input>
              {errors.imageUrl && (
                <div className='error'>{errors.imageUrl}</div>
              )}

              <input
                className='input-img'
                type='url'
                value={image2}
                onChange={e => setImage2(e.target.value)}
                placeholder='Image URL'
                required
              ></input>
              <input
                className='input-img'
                type='url'
                value={image3}
                onChange={e => setImage3(e.target.value)}
                placeholder='Image URL'
                required
              ></input>
              <input
                className='input-img'
                type='url'
                value={image4}
                onChange={e => setImage4(e.target.value)}
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
