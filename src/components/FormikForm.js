import React from 'react'
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
    .required("Must enter an email")
})

const FormikForm = () => {
  return (
    <Formik initialValues={{
      name: "",
      email: ""
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
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (

        // Form is inside Formik component as a render prop
        <form onSubmit={handleSubmit}>

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
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </div>

        </form>
      )}
    </Formik>
  )
}

export default FormikForm