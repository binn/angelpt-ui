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

function ArchiveLotModalButton({ disabled, onArchive, hidden }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                colorScheme='orange'
                icon={<FiTrash color='red' />}
                onClick={onOpen}
                disabled={disabled ? disabled : false}
                hidden={hidden ? hidden : false}
                w='100%'
            >Archive Lot</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader borderBottomWidth={1}>Archive Lot</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody m={25}>
                        <Text><b>Are you sure you want to archive this resource?</b></Text>
                    </ModalBody>

                    <ModalFooter borderTopWidth={1}>
                        <Flex w='100%'>
                            <Button colorScheme='orange' w='100%' onClick={() => {
                                onArchive();
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

export default ArchiveLotModalButton;
