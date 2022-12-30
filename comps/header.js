import {
    Box,
    Button,
    ButtonGroup,
    Link,
    Flex,
    HStack,
    useColorModeValue,
    Center,
} from "@chakra-ui/react";
import { Logo } from "./logo";

function Header() {
    return (
        <Box as="section" >
            <Flex py={{ base: '4', lg: '5' }} as="nav" h={75} alignItems='center' bg="bg-surface" boxShadow='base'>
                <Logo />

                <ButtonGroup position='absolute' left={250} variant="link" spacing="8">
                    <Button as={Link} href="/dashboard">Lots Dashboard</Button>
                    <Button as={Link} href="/archive">Archived Lots</Button>
                    <Button as={Link} href="/administration">Administration</Button>
                    <Button as={Link} href="/analytics">Analytics</Button>
                </ButtonGroup>

                <HStack position='absolute' spacing="3" right={25}>
                    <Button colorScheme='blue'>Login</Button>
                </HStack>
            </Flex>
        </Box>
    );
}

export default Header;