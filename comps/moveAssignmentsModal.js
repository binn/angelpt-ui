import { Box, Button, Heading, SimpleGrid, Textarea, useToast, Text } from "@chakra-ui/react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from '@chakra-ui/react';

import { useState } from 'react';
import config from "./config";

function MoveAssignmentsModalButton({ disabled, selected, token, reloadSelected, departments }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    return (
        <>
            <Button disabled={disabled ? disabled : false} w='100%' colorScheme='green' onClick={onOpen}>
                Move Assignments
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={1400}>
                    <ModalHeader>Move Assignments</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody w='100%'>
                        <SimpleGrid columns={3} spacing={4} w='100%'>
                            {selected.assignments.map(assignment => {
                                return (
                                    <Box>
                                        <Heading mb={3}>{departments.filter(x => x.id === assignment.id)[0].name}</Heading>
                                        <Box overflowY='auto' w={'100%'} borderRadius={10} p={15} borderWidth={1} h={300}>
                                            {assignment.count > 0 ?
                                                <Box p={5} borderRadius={10} borderWidth={1}>
                                                    <Text><b>{assignment.count}</b></Text>
                                                </Box> : <></>}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%' onClick={async () => {
                            // save assignments
                        }}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default MoveAssignmentsModalButton;
