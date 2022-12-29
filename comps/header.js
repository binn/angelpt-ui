import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";

function Header() {
    return (
        <Center mt={5}>
            <Flex bg='rgba(0, 0, 0, 0.10)' borderRadius={5} borderWidth={0} w='100%' position='relative' align='left' alignItems='center' h={110}>
                <Box position='absolute' left={25} >
                    <Heading as='a' _hover={{ opacity: '75%' }} href='/' color='primary'>Heading</Heading>
                    <Text opacity='80%' color='chakra-body-text'>Description</Text>
                </Box>
            </Flex>
        </Center >
    );
}

export default Header;