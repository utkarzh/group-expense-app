import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Stack, Button } from "@chakra-ui/react";
import axios from "axios";

import GroupCard from "./GroupCard";

const Dashboard = () => {
  const [groups, setUserGroups] = useState([]);
  const navigate = useNavigate();

  //
  const getGroupDetails = async (groupId) => {
    try {
      navigate(`/groups/${groupId}`);
    } catch (e) {
      console.error(e.message);
    }
  };
  //
  const createGroup = async () => {
    try {
      navigate(`/groups/create`);
    } catch (e) {
      console.error(e.message);
    }
  };
  //

  const getUserGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/groups/getUserGroups",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setUserGroups(response.data);
    } catch (e) {
      console.error(e.message);
    }
  };
  //
  useEffect(() => {
    getUserGroups();
  }, []);
  //
  return (
    <Box p="8">
      <Heading size="xl" mb="4" textAlign="center">
        THE EXPENSE TRACKER!!
      </Heading>
      <Button
        colorScheme="green"
        size="sm"
        mb="4"
        rounded="full"
        onClick={() => createGroup()}
      >
        +New Group
      </Button>
      <Stack direction="row" spacing="4" wrap="wrap" justify="center">
        {groups.map((group) => (
          <GroupCard
            group={group}
            onClick={() => getGroupDetails(group.groupId)}
            key={group.groupId}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboard;
