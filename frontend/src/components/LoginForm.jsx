import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "@mui/base";
import { Link } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/features/userslice";

function LoginForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authentication, setAuthentication] = useState(false);

  const handleOnClick = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/users", {
        email: email,
        password: password,
        chats: [],
      });
      console.log(response.data)
      setAuthentication(response.data.success);
      if (!response.data.success) {
        alert("Incorrect password. Please try again");
      }
      else{
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <div className="rectangle-parent">
        <div className="frame-child" />
        <b className="signup-login">Signup / Login</b>
        <div className="frame-parent">
          <div className="frame-group">
            <div className="your-email-id-wrapper">
              <div className="your-email-id">Your Email id</div>
            </div>
            <Input
              className="frame-item"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="frame-group">
            <div className="your-email-id-wrapper">
              <div className="your-email-id">Password</div>
            </div>
            <Input
              className="frame-item"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="button">
          <div className="button-child" />
          <div className="lets-go">
            <Button onClick={handleOnClick}>
              <Link
                to={authentication ? "/speechToText" : "/"}
                style={{ color: "inherit", "text-decoration": "none" }}
              >
                Lets Go!!
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
