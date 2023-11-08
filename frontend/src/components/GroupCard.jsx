import { Box, Heading } from "@chakra-ui/react";
const GroupCard = ({ group, onClick }) => {
  return (
    <Box
      minW="xl"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="4"
      bgColor="green.300"
      boxShadow="md"
      onClick={onClick}
    >
      <Heading size="md" mb="2">
        #{group.groupName}
      </Heading>
    </Box>
  );
};
export default GroupCard;
