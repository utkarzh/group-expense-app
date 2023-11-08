import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewAnalysis = () => {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const getAnalysis = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/expense/${id}/getAnalysis`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    setUser(data.data.individualAmounts);
    console.log(user);
  };

  useEffect(() => {
    getAnalysis();
  }, []);
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th isNumeric>Balance</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.entries(user).map(([key, value]) => (
          <Tr key={key}>
            <Td>{key}</Td>
            <Td isNumeric>{value}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ViewAnalysis;
