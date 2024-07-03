import { useNavigate } from "react-router";
import { Formik } from "formik";
import { RouteProps } from "react-router";
import LoginLayout from "../layouts/Login";
import * as Yup from "yup";
import axios from "../axios";
import Webcam from "react-webcam";
import { useCallback, useRef, useState, useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import CustomWebcam from "../components/CustomWebcam";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(3).required("Required"),
});

const Login = (props: RouteProps): JSX.Element => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [open, setOpen] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string >("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<any>("");

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const handleLogin = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const arrayBuffer = base64ToArrayBuffer(imgSrc);
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', blob, 'webcam-photo.jpg');
      formData.append("email", email);
      formData.append("password", password);
    try{
      axios
      .post("/login-face", formData)
      .then((res) => {
        authContext.authenticate(res.data.user, res.data.accessToken);
      })
      .catch((err) => {
        let error = err.message;
        console.log(error)
        if (err?.response?.data)
          error = JSON.stringify(err.response.data);
        setError(error);
      });
    }catch(err) {
        console.log(err)
    }
  }

  return (
    <div>
      <LoginLayout error={error}>
        <div className="form-container">
          {open ? (
            <CustomWebcam 
              imgSrc={imgSrc}
              setImgSrc={setImgSrc}
            />
          ):(
            <>
            <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              console.log(values)
              axios
                .post("/auth/login", { ...values })
                .then((res) => {
                  authContext.authenticate(res.data.user, res.data.accessToken);
                })
                .catch((err) => {
                  let error = err.message;
                  console.log(error)
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error);
                });
            }}
          >
            {({ errors, touched, getFieldProps, handleSubmit }) => (
              <form >
                {/* onSubmit={handleSubmit} */}
                <div className="input-container">
                  <input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    // {...getFieldProps("email")}
                    />
                  <div className="form-error-text">
                    {touched.email && errors.email ? errors.email : null}
                  </div>
                </div>

                <div className="input-container">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    // {...getFieldProps("password")}
                  />
                  <div className="form-error-text">
                    {touched.password && errors.password
                      ? errors.password
                      : null}
                  </div>
                </div>

                <button onClick={() => setOpen(!open)} className="login-button button-primary" type="submit">
                  Login
                </button>
              </form>
            )}
          </Formik>

          <div className="form-info-text">Forgot Password?</div>

          <hr />

          <button
          onClick={() => navigate("/signup")}
          className="button-secondary"
          >
            Create a New Account
          </button>
          </>
          )}
          {imgSrc && (
            <button className="login-button button-primary" onClick={handleLogin}>Submit</button>
          )}
        </div>
      </LoginLayout>
    </div>
  );
};

export default Login;
