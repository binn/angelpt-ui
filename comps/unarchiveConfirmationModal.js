import { Button, Flex, IconButton, Text } from "@chakra-ui/react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { FiFolderMinus, FiTrash } from 'react-icons/fi';

function UnarchiveConfirmationModal({ disabled, onDelete }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Tooltip label="Unarchive Lot">
                <IconButton
                    bg='none'
                    icon={<FiFolderMinus color='orange' />}
                    onClick={onOpen}
                    disabled={disabled ? disabled : false}
                />
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader borderBottomWidth={1}>Restore</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody m={25}>
                        <Text><b>Are you sure you want to unarchive this resource?</b></Text>
                    </ModalBody>

                    <ModalFooter borderTopWidth={1}>
                        <Flex w='100%'>
                            <Button colorScheme='orange' w='100%' onClick={() => {
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

export default UnarchiveConfirmationModal;
