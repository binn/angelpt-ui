import { Button, Textarea } from "@chakra-ui/react";

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

function EditTasksModalButton({ disabled }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button disabled={disabled ? disabled : false} w='100%' onClick={onOpen}>
                Edit Tasks
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Tasks</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%'>Update</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditTasksModalButton;
