import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Stack,
  StackItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { CgFileDocument } from "react-icons/cg";
import { variables } from "../../../Variables";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function AdminFormular() {
  const [formulaList, setformulaList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(variables.API_URL + "formula").then((res) => {
      console.log(res.data);
      setformulaList(res.data);
    });
  }, []);

  return (
    <Container maxW="container.xl">
      <Box>
        <Flex
          mt={5}
          borderBottom="solid"
          borderColor="gray"
          textColor="gray.600"
          justifyContent="space-between"
        >
          <Flex pb={2} alignItems="center">
            <CgFileDocument size={40} />
            <Text fontSize="2xl">สูตรการผลิต</Text>
          </Flex>
          <Button
            colorScheme="orange"
            leftIcon={<AddIcon />}
            onClick={() => navigate("formula/new")}
          >
            เพิ่มสูตร
          </Button>
        </Flex>
      </Box>

      {/* Table formula */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>เครื่อง</Th>
              <Th>สูตรที่</Th>
              <Th>ชั่งสารเคมี</Th>
              <Th>Hopper</Th>
              <Th>Kneader</Th>
              <Th>Extruder</Th>
              <Th>Primary</Th>
              <Th>Secondary</Th>
              <Th>Item</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody fontSize="sm">
            {formulaList.map((data) => (
              <Tr key={data.id}>
                <Td>{data.name}</Td>
                <Td>{data.formula_no}</Td>
                <Td>{data.chem_weighing}</Td>
                <Td>{data.hopper}</Td>
                <Td>{data.kneader}</Td>
                <Td>{data.extruder}</Td>
                <Td>{data.primary}</Td>
                <Td>{data.secondary}</Td>
                <Td>{data.item}</Td>
                <Td display="inline-block">
                  <EditIcon
                    w={4}
                    h={4}
                    color="facebook"
                    _hover={{ color: "facebook.300" }}
                    mx={2}
                  />
                  <DeleteIcon
                    w={4}
                    h={4}
                    color="red"
                    _hover={{ color: "red.300" }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminFormular;
