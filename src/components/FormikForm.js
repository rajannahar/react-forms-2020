import React, { useState } from 'react'
import Autosuggest from 'react-autosuggest';
import axios from 'axios'
import { Formik } from 'formik'
import  * as Yup from 'yup'
import Error from './Error'

/*
Key concepts with forms:
  1. values user enters
  2. validation of user entered values
  3. form submission, isSubmitting state handling
*/

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .max(255, "Must be shorter than 255")
    .required("Must enter a name"),
  email: Yup.string()
    .email("Must be a valid email address")
    .max(255, "Must be shorter than 255")
    .required("Must enter an email"),
  country: Yup.string()
    .required("Must choose a country")
})

const FormikForm = () => {

  const [country, setCountry] = useState("")
  const [suggestions, setSuggestions] = useState([])

  return (
    <Formik initialValues={{
      name: "",
      email: "",
      country: ""
    }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      setSubmitting(true) // disables the submit button to prevent double submission

      // fakes sending data to server such as using axios post or graphql mutation
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2))
        resetForm() // resets form fields
        setSubmitting(false) // enables submit button again
      }, 500)
    }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue
      }) => (

        // Form is inside Formik component as a render prop
        <form onSubmit={handleSubmit}>

          <p>Formik, Yup Form</p>

          <div className="input-row">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              className={touched.name && errors.name && "has-error"}
            />
            <Error touched={touched.name} message={errors.name} />
          </div>

          <div className="input-row">
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              className={touched.email && errors.email && "has-error"}
            />
            <Error touched={touched.email} message={errors.email} />
          </div>

          <div className="input-row">
            <label htmlFor="country">Country</label>
            <Autosuggest
              inputProps={{
                placeholder: "Type your country",
                autoComplete: "abc",
                name: "country",
                id: "country",
                value: country,
                onChange: (_event, { newValue }) => {
                  setCountry(newValue)
                },
                className: touched.country && errors.country && "has-error"
              }}
              suggestions={suggestions}
              onSuggestionsFetchRequested={async ({value}) => {
                if (!value) {
                  setSuggestions([])
                  return
                }

                try {
                  const result = await axios.get(`https://restcountries.eu/rest/v2/name/${value}`)
                  console.log(result.data)
                  setSuggestions(result.data.map(row => ({
                    name: row.name,
                    flag: row.flag
                  })))
                } catch(e) {
                  setSuggestions([])
                }
              }}
              onSuggestionsClearRequested={() => {
                setSuggestions([])
              }}
              onSuggestionSelected={(event, {suggestion, method}) => {
                if (method === "enter") {
                  // stops form submitting when hitting enter to select autosuggest option
                  event.preventDefault()
                }
                setCountry(suggestion.name)
                setFieldValue("country", suggestion.name) // hooks up the Autosuggest to Formik
              }}
              getSuggestionValue={suggestion => suggestion.name}
              renderSuggestion={suggestion => (
                <div>
                  <img
                    style={{width: '25px', paddingRight: '10px'}}
                    src={suggestion.flag}
                    alt={suggestion.name}
                  />
                  {suggestion.name}
                </div>
              )}
            />
            <Error touched={touched.country} message={errors.country} />
          </div>

          <div className="input-row">
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </div>

        </form>
      )}
    </Formik>
  )
}

export default FormikForm