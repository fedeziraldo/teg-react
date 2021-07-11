import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap'
const ENDPOINT = process.env.REACT_APP_BACK;

function Login() {

  const history = useHistory();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("")

  const login = async e => {
    e.preventDefault()
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

  const handleForm = ({ target }) => {
    const login = { ...loginForm }
    login[target.name] = target.value
    setLoginForm(login)
  }

  const estilos = {
    backgroundColor: 'white' 
  }

  return (
    <Container style={estilos}>
      <Form onSubmit={login}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control placeholder="Ingrese su email" name="email" onChange={handleForm} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" onChange={handleForm} />
        </Form.Group>

        <Button variant="primary" type="submit">Entrar</Button>
      </Form>
      {error &&
        <Alert variant="danger">
          {error}
        </Alert>
      }
    </Container>

  );
}

export default Login;