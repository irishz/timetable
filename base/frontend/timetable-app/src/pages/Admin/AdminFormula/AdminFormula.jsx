import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { CgFileDocument } from "react-icons/cg";
import { variables } from "../../../Variables";
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function AdminFormular() {
  const [formulaList, setformulaList] = useState([]);
  const [selectedToDelete, setselectedToDelete] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios.get(variables.API_URL + "formula").then((res) => {
      // console.log(res.data);
      setformulaList(res.data);
    });
  }, [selectedToDelete]);

  function handleEditDeleteClick(id, type) {
    const formulaData = formulaList.find((formula) => formula.id === id);
    setselectedToDelete(formulaData);
    if (type === "edit") {
      return navigate(`${id}`, { state: formulaData });
    }
    onOpen();
  }

  function handleConfirmDelClick() {
    axios
      .delete(variables.API_URL + `formula/${selectedToDelete.id}`)
      .then((res) => {
        toast({
          title: res.data.msg,
          status: "success",
          icon: <CheckCircleIcon />,
          isClosable: true,
          duration: 3000,
        });
        setselectedToDelete({});
      });
    onClose();
  }

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
            onClick={() => navigate("/admin-formula/new")}
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
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody fontSize="sm">
            {formulaList
              .sort((a, b) => a.formula_no - b.formula_no)
              .map((data) => (
                <Tr key={data.id}>
                  <Td>{data.name}</Td>
                  <Td>{data.formula_no}</Td>
                  <Td>{data.chem_weighing}</Td>
                  <Td>{data.hopper}</Td>
                  <Td>{data.kneader}</Td>
                  <Td>{data.extruder}</Td>
                  <Td>{data.primary}</Td>
                  <Td>{data.secondary}</Td>
                  <Td display="inline-block">
                    <EditIcon
                      w={4}
                      h={4}
                      color="facebook"
                      _hover={{ color: "facebook.300" }}
                      mx={2}
                      onClick={() => handleEditDeleteClick(data.id, "edit")}
                    />
                    <DeleteIcon
                      w={4}
                      h={4}
                      color="red"
                      _hover={{ color: "red.300" }}
                      onClick={() => handleEditDeleteClick(data.id, "delete")}
                    />
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ยืนยีนการทำรายการ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            คุณต้องการลบสูตร <strong>{selectedToDelete.name}</strong>{" "}
            ใช่หรือไม่?
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              onClick={() => handleConfirmDelClick()}
            >
              ลบสูตร
            </Button>
            <Button onClick={() => onClose()} variant="outline">
              ยกเลิก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default AdminFormular;
