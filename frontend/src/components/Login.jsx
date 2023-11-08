import React from "react";
import { VStack, Text, Input, Button, Center, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post("http://localhost:3000/user/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vH" minW="100vW">
      <VStack spacing={4} p={8} bg="green.400" borderRadius="xl">
        <Text fontSize="2xl" color="white">
          The Expense Tracker!!
        </Text>
        <Input
          type="text"
          bg="white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          bg="white"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="green" onClick={handleLogin}>
          {isLoading ? <Spinner size="sm" /> : "Login"}
        </Button>
        {error && <Text color="white">{error}</Text>}
      </VStack>
    </Center>
  );
}

export default Login;
