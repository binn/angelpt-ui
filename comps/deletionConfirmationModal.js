import { Button, Flex, IconButton, Text } from "@chakra-ui/react";

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
import { FiTrash } from 'react-icons/fi';

function DeletionConfirmationModalButton({ disabled, onDelete }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <IconButton
                bg='none'
                icon={<FiTrash color='red' />}
                onClick={onOpen}
                disabled={disabled ? disabled : false}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader borderBottomWidth={1}>Delete</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody m={25}>
                        <Text><b>Are you sure you want to delete this resource?</b></Text>
                    </ModalBody>

                    <ModalFooter borderTopWidth={1}>
                        <Flex w='100%'>
                            <Button colorScheme='red' w='100%' onClick={() => {
                                onDelete();
                                onClose();
                            }}>Yes</Button>
                            <Button ml={2} w='100%' onClick={onClose}>No</Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default DeletionConfirmationModalButton;
