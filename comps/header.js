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
    IconButton,
    Icon,
    Text,
    useColorMode
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { CiLight } from 'react-icons/ci';

function Header() {
    const [loggedIn, setLoggedIn] = useState(true);
    const [user, setUser] = useState(undefined);
    const { toggleColorMode } = useColorMode();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage === undefined)
            return;

        setLoggedIn(localStorage.getItem("token") !== null);

        let u = localStorage.getItem("user");
        if (u !== undefined)
            setUser(JSON.parse(u));

        setLoading(false);
    }, []);

    if (loading)
        return <></>;

    return (
        <Box as="section" >
            <Flex py={{ base: '4', lg: '5' }} as="nav" h={75} alignItems='center' bg="bg-surface" boxShadow='base'>
                <Logo />

                <ButtonGroup position='absolute' left={250} variant="link" spacing="8">
                    <Button as={Link} href="/dashboard">Lots Dashboard</Button>
                    <Button as={Link} href="/archive">Archived Lots</Button>
                    <Button hidden={!user?.admin} as={Link} href="/administration">Administration</Button>
                    <Button hidden={!user?.supervisor} as={Link} href="/analytics">Analytics</Button>
                </ButtonGroup>

                <HStack position='absolute' spacing="3" right={25}>
                    <IconButton
                        onClick={toggleColorMode}
                        icon={<Icon as={CiLight} />}
                    />

                    {loggedIn ? <>
                        <Button onClick={() => {
                            localStorage.clear();
                            window.location.href = '/';
                        }} colorScheme='red'>Logout</Button>

                        <Flex
                            flexDirection='column'
                            spacing={4}
                            alignItems='left'
                        >
                            <Text>Hello, <b>{user.name.toUpperCase().split(" ").reverse().join(" ")}</b></Text>
                            <Text>Logged in at {new Date(user.loggedIn).toLocaleTimeString()}</Text>
                        </Flex>
                    </> : <></>}
                </HStack>
            </Flex>
        </Box>
    );
}

export default Header;