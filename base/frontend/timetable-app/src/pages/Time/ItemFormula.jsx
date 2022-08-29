import {
  Box,
  Button,
  Center,
  Stack,
  StackItem,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { variables } from "../../Variables";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";

function ItemFormula(props) {
  const [formula, setformula] = useState({});
  const [formulaVisible, setformulaVisible] = useState(false);

  useEffect(() => {
    // console.log(props);
    getFormulaData(props.itemData?.formula);
  }, [props.itemData]);

  function getFormulaData(formula_id) {
    if (formula_id) {
      axios.get(variables.API_URL + `formula/${formula_id}`).then((res) => {
        // console.log(res.data);
        setformula(res.data);
      });
      return;
    }
  }

  function renderTableRow(mc_name, formula_no, name) {
    return (
      <Tr>
        <Td>{mc_name}</Td>
        <Td textAlign="center">{formula_no}</Td>
        <Td textAlign="center">{name}</Td>
      </Tr>
    );
  }

  return (
    <Box>
      <Button
        variant="outline"
        size="sm"
        colorScheme="teal"
        leftIcon={formulaVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
        onClick={() => setformulaVisible(!formulaVisible)}
      >
        {formulaVisible ? "ซ่อนสูตรการผลิต" : "แสดงสูตรการผลิต"}
      </Button>
      {formulaVisible ? (
        <TableContainer>
          <Table
            size="sm"
            display="block"
            variant="striped"
            p={3}
            border="solid"
            borderWidth={1}
            borderRadius={5}
            borderColor="gray.300"
          >
            <TableCaption fontSize={14}>สูตรที่ใช้ในการผลิต</TableCaption>
            <Thead>
              <Tr>
                <Th>เครื่อง</Th>
                <Th>
                  <Center>สูตรที่</Center>
                </Th>
                <Th>
                  <Center>ชื่อ</Center>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {renderTableRow(
                "ชั่งสารเคมี",
                formula.formula_no,
                formula.chem_weighing
              )}
              {renderTableRow(
                "ดูดสารเคมี [hopper]",
                formula.formula_no,
                formula.hopper
              )}
              {renderTableRow(
                "นีดเดอร์ [Kneader]",
                formula.formula_no,
                formula.kneader
              )}
              {renderTableRow(
                "เอ็กทรูดเดอร์ [Extruder]",
                formula.formula_no,
                formula.extruder
              )}
              {renderTableRow(
                "ไพรมารี่ เพลส [Primary Press]",
                formula.formula_no,
                formula.primary
              )}
              {renderTableRow(
                "เซกันดารี่ เพลส [Secondary Press]",
                formula.formula_no,
                formula.secondary
              )}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
}

export default ItemFormula;
