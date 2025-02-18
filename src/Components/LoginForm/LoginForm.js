import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const LoginForm = ({setLoading,loading}) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    name: isLogin
      ? Yup.string()
      : Yup.string()
          .min(3, "Name must be at least 3 characters")
          .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };
  const PostRequest = async (url, payload, reset) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/${url}`,
        payload
      );

      if (response?.status === 200 || response?.status === 201) {
        toast.success(response.data.message);
        if (isLogin) {
          debugger
          navigate("/Quiz");
          sessionStorage.setItem("login", true);
          sessionStorage.setItem("userName", response.data.username);
          sessionStorage.setItem("userId", response.data.user_id);
          reset && reset();
        }
        setIsLogin(!isLogin);

      }
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (values, { resetForm }) => {
    isLogin
      ? PostRequest("signin", values, resetForm())
      : PostRequest("signup", values, resetForm());
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <div className="container d-flex justify-content-center align-items-center vh-100">
          <div className="card p-4 shadow" style={{ width: "350px" }}>
            <h3 className="text-center mb-3">{isLogin ? "Login" : "Signup"}</h3>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  {!isLogin && (
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <Field
                        type="text"
                        name="name"
                        className={`form-control ${
                          errors.name && touched.name ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className={`form-control ${
                        errors.email && touched.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <Field
                      type="password"
                      name="password"
                      className={`form-control ${
                        errors.password && touched.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    {isLogin ? "Login" : "Signup"}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="text-center mt-3">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Signup" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
