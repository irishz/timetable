import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Highlight,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { BsPlusCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { variables } from "../../../Variables";

function AdminItem() {
  const [itemList, setitemList] = useState([]);
  const [itemSelected, setitemSelected] = useState({});
  const [isDeleting, setisDeleting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get(`${variables.API_URL}item`).then((res) => {
      setitemList(res.data);
    });
  }, [isDeleting]);

  function handleEditDeleteClick(id, type) {
    const item = itemList.find(({ item_id }) => item_id === id);
    setitemSelected(item);
    if (type === "edit") {
      navigate(`/admin-item/${id}`, { state: item });
      return;
    }
    // Delete
    console.log(itemSelected);
    onOpen();
  }

  function onDeleteBtnCLick() {
    setisDeleting(true);
    axios
      .delete(`${variables.API_URL}item/${itemSelected.item_id}`)
      .then((res) => {
        onClose();
        setisDeleting(false);
        if (res.status === 200) {
          toast({
            title: res.data.msg,
            status: "success",
            duration: 3000,
          });
          return;
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถลบข้อมูล",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  }

  return (
    <Container maxW={"container.xl"}>
      <Flex alignItems={"center"} justifyContent="space-between">
        <Heading color={"gray.600"} my={5}>
          All Items
        </Heading>
        <Button
          variant={"solid"}
          colorScheme="green"
          leftIcon={<BsPlusCircle />}
          onClick={() => navigate("/admin-item/new")}
        >
          เพิ่ม Item
        </Button>
      </Flex>
      {itemList.length > 0 ? (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Item</Th>
                <Th>initial</Th>
                <Th>Kneader</Th>
                <Th>extruder</Th>
                <Th>pre-press</Th>
                <Th>Start Primary press</Th>
                <Th>End Primary press</Th>
                <Th>Steam In</Th>
                <Th>start Secondary press #1</Th>
                <Th>start Secondary press #2</Th>
                <Th>cooling</Th>
                <Th>Record Secondary press #1</Th>
                <Th>Record Secondary press #2</Th>
                <Th>end secondary press</Th>
                <Th>extra1</Th>
              </Tr>
            </Thead>
            <Tbody>
              {itemList.map((item) => (
                <Tr key={item.item_id}>
                  <Td>{item.item_id}</Td>
                  <Td>{item.item}</Td>
                  <Td>{item.init}</Td>
                  <Td>{item.kneader}</Td>
                  <Td>{item.end_extruder}</Td>
                  <Td>{item.end_prepress}</Td>
                  <Td>{item.start_prim_press}</Td>
                  <Td>{item.end_prim_press}</Td>
                  <Td>{item.steam_in}</Td>
                  <Td>{item.start_sec_press}</Td>
                  <Td>{item.start_sec_press2}</Td>
                  <Td>{item.cooling}</Td>
                  <Td>{item.record_sec_press}</Td>
                  <Td>{item.record_sec_press2}</Td>
                  <Td>{item.end_sec_press}</Td>
                  <Td>{item.extra1}</Td>
                  <Td display="inline-block">
                    <EditIcon
                      w={4}
                      h={4}
                      color="facebook"
                      _hover={{ color: "facebook.300" }}
                      mx={2}
                      onClick={() =>
                        handleEditDeleteClick(item.item_id, "edit")
                      }
                    />
                    <DeleteIcon
                      w={4}
                      h={4}
                      color="red"
                      _hover={{ color: "red.300" }}
                      onClick={() =>
                        handleEditDeleteClick(item.item_id, "delete")
                      }
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Center color={"gray.600"} gap={2} my={3}>
          <Text>ไม่พบข้อมูล!</Text>
          <Text
            cursor={"pointer"}
            color={"blue.600"}
            textDecorationLine="underline"
            textUnderlineOffset={3}
            fontWeight="semibold"
            _hover={{ color: "blue.400" }}
            onClick={() => navigate("/admin-item/new")}
          >
            ไปยังหน้าสร้าง Item
          </Text>
        </Center>
      )}

      {/* Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter={"blur(3px)"} />
        <ModalContent>
          <ModalHeader>ยืนยันการทำรายการ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={1} alignItems="baseline">
              <Text>ต้องการลบ Item :</Text>
              <Text
                bgColor={"tomato"}
                py={1}
                px={2}
                color="white"
                rounded={"md"}
              >
                {itemSelected.item}
              </Text>
              <Text>ใช่หรือไม่?</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<DeleteIcon />}
              variant="solid"
              colorScheme={"red"}
              onClick={onDeleteBtnCLick}
              isLoading={isDeleting}
              loadingText="กำลังลบ"
            >
              ลบ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default AdminItem;
