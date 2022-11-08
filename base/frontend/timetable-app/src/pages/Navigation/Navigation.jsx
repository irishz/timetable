import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import AuthContext from "../../Context/AuthContext";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";

function Navigation() {
  const authCtx = useContext(AuthContext);
  const [userData, setuserData] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  let navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    authCtx.setuserToken("");
  }

  useEffect(() => {
    const user_data = jwtDecode(authCtx.userToken);
    setuserData(user_data);
    // navigate("../", { replace: true });
    return () => {
      setuserData([])
    }
  }, []);

  return (
    <Flex
      justify="space-between"
      p={1}
      bgColor={colorMode === "light" ? "teal.500" : "#011627"}
      color={colorMode === "light" ? "white" : "teal"}
      shadow="md"
    >
      <Box className="px-2 py-3 flex gap-2">
        <Link to="/time">
          <Text>ตารางเวลา</Text>
        </Link>
        {/* Link for Admin */}
        {userData?.is_staff ? (
          <>
            <Link to="/admin-time/new">
              <Text>จัดการตารางเวลา</Text>
            </Link>
            {/* <Link to="/user">
              <Text>จัดการผู้ใช้</Text>
            </Link> */}
            <Link to="/admin-formula">
              <Text>จัดการสูตรการผลิต</Text>
            </Link>
            <Link to="/admin-item">
              <Text>จัดการ Item</Text>
            </Link>
          </>
        ) : null}
      </Box>
      <Flex alignItems="center" gap={2}>
        <Text>ยินดีต้อนรับคุณ: {userData?.username}</Text>
        <Menu closeOnSelect={false}>
          <MenuButton>
            <Avatar name={userData?.username} size="sm" />
          </MenuButton>
          <MenuList color="black">
            <MenuItem>
              <Switch
                onChange={toggleColorMode}
                transitionDuration={500}
              >
                {colorMode === "light" ? "โหมดสว่าง" : "โหมดมืด"}
              </Switch>
            </MenuItem>
            {/* <MenuItem>Menu 2</MenuItem>
            <MenuItem>Menu 3</MenuItem> */}
            <Divider />
            <MenuItem
              color="red"
              icon={<MdLogout />}
              onClick={() => handleLogout()}
            >
              ออกจากระบบ
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default Navigation;
