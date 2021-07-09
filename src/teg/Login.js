import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
const ENDPOINT = process.env.REACT_APP_BACK;

function Login() {

  const history = useHistory();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("")

  const login = async () => {
    try {
      const usuToken = await axios.post(`${ENDPOINT}/login/login`, loginForm)
      console.log(usuToken)
      localStorage.setItem("token", usuToken.data.token)
      history.push("/teg")
    } catch (e) {
      console.log(e)
      setError(e.response.data)
    }

  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      history.push("/teg")
    }
  })

  const handleForm = ({target}) => {
    const login = {...loginForm}
    login[target.name] = target.value
    setLoginForm(login)
  }

  return (
    <div>
      <input
        placeholder="usuario"
        name="email"
        onChange={handleForm}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={handleForm}
      />

      <button
        onClick={login} >
        Entrar
      </button>

      <div>{error}</div>
    </div>
  );
}

export default Login;