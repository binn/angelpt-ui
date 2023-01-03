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

function AddNoteModalButton({ disabled }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [note, setNote] = useState('');

    return (
        <>
            <Button disabled={disabled ? disabled : false} w='100%' colorScheme='green' onClick={onOpen}>
                Create Note
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Note</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Textarea w='100%' h={200} placeholder='Note' value={note} onChange={(e) => setNote(e.currentTarget.value)} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%'>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddNoteModalButton;
