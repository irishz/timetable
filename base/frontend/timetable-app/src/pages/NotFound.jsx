import { Flex, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'

function NotFound() {
  const {colorMode, toggleColorMode} = useColorMode()
  return (
    <Flex h="screen" justifyContent="center" alignItems="center">
      <Text color={colorMode === "light" ? "teal" : "orange"} fontSize={32}>ไม่พบหน้าที่ร้องขอ</Text>
    </Flex>
  )
}

export default NotFound