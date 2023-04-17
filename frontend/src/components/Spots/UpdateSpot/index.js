import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import * as spotActions from '../../../store/spots'
import './UpdateSpot.css'

function UpdateSpotForm () {
  const dispatch = useDispatch()
  const history = useHistory()
  const sessionUser = useSelector(state => state.session.user)
  const spotDetails = useSelector(state => state.spot.spotDetails)
  const preview = spotDetails.SpotImages.find(image => image.preview === true)
  const previewUrl = preview.url

  const [name, setName] = useState(spotDetails.name)
  const [description, setDescription] = useState(spotDetails.description)
  const [price, setPrice] = useState(spotDetails.price)
  const [address, setAddress] = useState(spotDetails.address)
  const [city, setCity] = useState(spotDetails.city)
  const [state, setState] = useState(spotDetails.state)
  const [country, setCountry] = useState(spotDetails.country)
  const [lat, setLat] = useState(spotDetails.lat)
  const [lng, setLng] = useState(spotDetails.lng)
  const [previewImage, setPreviewImage] = useState(previewUrl)
  // ALL OTHER IMAGES BESIDES PREV IMAGE
  const [image1, setImage1] = useState("")
  const [image2, setImage2] = useState("")
  const [image3, setImage3] = useState("")
  const [image4, setImage4] = useState("")

  const [errors, setErrors] = useState([])
  const [hasSubmitted, setHasSubmitted] = useState(false)


useEffect(() => {
  if (hasSubmitted) {
    let validationErrors = {}

    if (!country) validationErrors.country = 'Country is required'
    if (!address) validationErrors.address = 'Address is required'
    if (!city) validationErrors.city = 'City is required'
    if (!state) validationErrors.state = 'State is required'
    if (description.length < 30)
      validationErrors.description =
        'Description needs a minimum of 30 characters'
    if (!name) validationErrors.name = 'Name is required'
    if (!price) validationErrors.price = 'Price is required'
    if (!previewImage.trim())
      validationErrors.previewImage = 'Preview image is required'
    if (
      previewImage &&
      !/\.(png|jpg|jpeg)$/i.test(
        previewImage.slice(previewImage.lastIndexOf('.'))
      )
    )
      validationErrors.previewImage =
        'Image URL must end in .png, .jpg, or .jpeg'
    if (
      image1 &&
      !/\.(png|jpg|jpeg)$/i.test(image1.slice(image1.lastIndexOf('.')))
    )
      validationErrors.image1 = 'Image URL must end in .png, .jpg, or .jpeg'
    if (
      image2 &&
      !/\.(png|jpg|jpeg)$/i.test(image2.slice(image2.lastIndexOf('.')))
    )
      validationErrors.image2 = 'Image URL must end in .png, .jpg, or .jpeg'
    if (
      image3 &&
      !/\.(png|jpg|jpeg)$/i.test(image3.slice(image3.lastIndexOf('.')))
    )
      validationErrors.image3 = 'Image URL must end in .png, .jpg, or .jpeg'
    if (
      image4 &&
      !/\.(png|jpg|jpeg)$/i.test(image4.slice(image4.lastIndexOf('.')))
    )
      validationErrors.image4 = 'Image URL must end in .png, .jpg, or .jpeg'

    setErrors(validationErrors)
  }
}, [
  hasSubmitted,
  country,
  address,
  city,
  state,
  description,
  name,
  price,
  previewImage,
  image1,
  image2,
  image3,
  image4
])

  const handleSubmit = async e => {
    e.preventDefault()
    setHasSubmitted(true)

    if (Object.keys(errors).length > 0) return

    const images = [image1, image2, image3, image4]
    .filter(Boolean)
    .map(url => ({
      url,
      preview: false
    }))


   return await dispatch(
      spotActions.updateSpotsThunk(
        spotDetails.id,
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
        .then(updatedSpotData => {
          history.push(`/spots/${updatedSpotData.id}`)
        })

        .catch(async res => {
         const data = await res.json();
          if (data && data.errors) setErrors(data.errors);

      })
  }

  if (!spotDetails) return null
  if (!sessionUser) return <Redirect to={'/'} />
  // ** add noValidate to form/submit button to prevent browser default validation msg
  return (
    <div className='form-container-div'>
      <div className='form-container'>
        <div className='update-spot-form'>
          <form noValidate className='uodate-spot' onSubmit={handleSubmit}>
            <div className='location-section'>
              <h1 className='title'>Update Your Spot</h1>
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
            <button
              className='submit-create-spot-btn'
              type='submit'
              onClick={handleSubmit}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateSpotForm
