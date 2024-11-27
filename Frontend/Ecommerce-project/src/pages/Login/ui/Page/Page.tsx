import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleLogin = async () => {
    const user = { username, password }
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/login/`, user,{
        headers: { 'Content-Type': 'application/json'},
          withCredentials: true})

      localStorage.clear()
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      const decoded = jwtDecode(response.data.access) as { user_id: string };
      localStorage.setItem("user_id", decoded.user_id)
      console.log(decoded.user_id)
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access']}`;
      navigate("/dashboard")
    } catch (err) {
      setError("Credenciais inválidas")
      console.error(err)
    }
  }

  return (
    <>
      <section>
        <div className="pt-60  min-h-[calc(100vh-64px)] bg-base-200">
          <div className="login-form flex flex-col justify-center items-center">
            <h2>Login to your account</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg my-2 px-2 py-1"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg my-2 px-2 py-1"
            />
            <button onClick={handleLogin} className="bg-green-800 px-4 rounded-lg text-lg font-semibold py-1 hover:bg-green-700 duration-300">Login</button>
            {error && <p>{error}</p>}

          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
