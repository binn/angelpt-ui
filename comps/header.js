import {
    Box,
    Button,
    ButtonGroup,
    Link,
    Flex,
    HStack,
    Menu,
    useColorModeValue,
    Center,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { Logo } from "./logo";

function Header() {
    const [loggedIn, setLoggedIn] = useState(true);
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        if (localStorage === undefined)
            return;

        setLoggedIn(localStorage.getItem("token") !== null);

        const u = localStorage.getItem("user");
        if (u != undefined)
            setUser(JSON.parse(u));
    });

    return (
        <Box as="section" >
            <Flex py={{ base: '4', lg: '5' }} as="nav" h={75} alignItems='center' bg="bg-surface" boxShadow='base'>
                <Logo />

                <ButtonGroup position='absolute' left={250} variant="link" spacing="8">
                    <Button as={Link} href="/dashboard">Lots Dashboard</Button>
                    <Button as={Link} href="/archive">Archived Lots</Button>
                    <Menu isLazy>
                        <MenuButton hidden={!user?.admin}>Administration</MenuButton>
                        <MenuList>
                            <MenuItem as={Link} href="/administration/employees">Employees</MenuItem>
                            <MenuItem as={Link} href="/administration/departments">Departments</MenuItem>
                            <MenuItem as={Link} href="/administration/task-templates">Task Templates</MenuItem>
                        </MenuList>
                    </Menu>
                    <Button hidden={!user?.admin} as={Link} href="/analytics">Analytics</Button>
                </ButtonGroup>

                <HStack position='absolute' spacing="3" right={25}>
                    {loggedIn ? <Button onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }} colorScheme='red'>Logout</Button> : <></>}
                </HStack>
            </Flex>
        </Box>
    );
}

export default Header;