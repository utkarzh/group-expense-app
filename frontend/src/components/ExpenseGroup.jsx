import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const ExpenseItem = ({ expense }) => {
  return (
    <Tr>
      <Td>{expense.amount}</Td>
      <Td>{expense.description}</Td>
      <Td>{expense.category}</Td>
      <Td>{expense.UserId}</Td>
    </Tr>
  );
};

const ExpenseGroup = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { id } = useParams();
  //
  const getExpenses = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/expense/${id}/getExpenses`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(data);
      setExpenses(data.expenses);
    } catch (e) {
      console.error(e);
    }
  };
  //
  useEffect(() => {
    getExpenses();
  }, []);
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (amount && description && category) {
        const newExpense = {
          amount,
          description,
          category,
          UserId: "you",
        };
        await axios.post(
          `http://localhost:3000/expense/${id}/addExpense`,
          newExpense,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setExpenses([...expenses, newExpense]);
        setAmount("");
        setDescription("");
        setCategory("");
      } else {
        alert("please fill all the fields");
      }
    } catch (e) {
      console.error(e.message);
    }
  };
  //

  const getTotalExpenses = () => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
  };
  //
  const viewAnalysis = async () => {
    navigate(`/expense/${id}/viewAnalysis`);
  };

  const green = useColorModeValue("green.500", "green.300");

  return (
    <Box p="8">
      <Heading size="lg" mb="4" color={green}>
        Expenses Tracker
      </Heading>
      <Stack direction="row" spacing="4" wrap="wrap" justify="center">
        <Box maxW="sm" borderWidth="1px" borderRadius="lg" p="4" boxShadow="md">
          <Heading size="md" mb="4" color={green}>
            Add Expense
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="amount" mb="4">
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </FormControl>
            <FormControl id="description" mb="4">
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl id="category" mb="4">
              <FormLabel>Category</FormLabel>
              <Input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="green" size="lg" mb="4">
              Add
            </Button>
          </form>
        </Box>

        <Box maxW="lg" borderWidth="1px" borderRadius="lg" p="4" boxShadow="md">
          <Heading size="md" mb="4" color={green}>
            Expenses List
          </Heading>
          <Text fontSize="xl" color="gray.700" mt="4">
            Total Expenses: Rupees {getTotalExpenses()}
          </Text>
          <Button
            colorScheme="green"
            size="sm"
            mb="4"
            rounded="full"
            onClick={() => viewAnalysis()}
          >
            View Analysis
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Amount</Th>
                <Th>Description</Th>
                <Th>Category</Th>
                <Th>Added By</Th>
              </Tr>
            </Thead>
            <Tbody>
              {expenses.map((expense) => (
                <ExpenseItem expense={expense} key={expense.id} />
              ))}
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </Box>
  );
};

export default ExpenseGroup;
