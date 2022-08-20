import { Box, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { CgFileDocument } from "react-icons/cg";
function AdminFormular() {
  return (
    <Container maxW="container.lg">
      <Flex
        mt={5}
        pb={2}
        alignItems="center"
        borderBottom="solid"
        w="75%"
        borderColor="gray"
        textColor="gray.600"
      >
        <CgFileDocument size={40} />
        <Text fontSize="2xl">สูตรการผลิต</Text>
      </Flex>
    </Container>
  );
}

export default AdminFormular;
