import React from "react";
import { VStack, Text, Input, Button, Center, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateGroup() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  const addGroup = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/groups/create",
        {
          name: groupName,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const id = response.data.id;
      console.log(users);
      console.log(id);
      try {
        await axios.post(
          `http://localhost:3000/groups/${id}/addMembers`,
          { usernames: users },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
      } catch (e) {
        console.error(e.message);
      }

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError("Unable to create group or maybe no other users!!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vH" minW="100vW">
      <VStack spacing={4} p={8} bg="green.400" borderRadius="xl">
        <Text fontSize="2xl" color="white">
          Create New Group
        </Text>
        <Input
          type="text"
          bg="white"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Input
          type="text"
          bg="white"
          placeholder="Usernames with spaces"
          value={users}
          onChange={(e) => setUsers(e.target.value.split(" "))}
        />
        <Button colorScheme="green" onClick={addGroup}>
          {isLoading ? <Spinner size="sm" /> : "Create Now"}
        </Button>
        {error && <Text color="white">{error}</Text>}
      </VStack>
    </Center>
  );
}

export default CreateGroup;
