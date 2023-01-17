import { Button, Textarea, useToast } from "@chakra-ui/react";

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

function AddNoteModalButton({ disabled, selected, token, reloadSelected }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [note, setNote] = useState('');
    const toast = useToast();

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
                        <Button colorScheme='green' w='100%' onClick={async () => {
                            let res = await fetch(`${config.api}/notes/lots/${selected.id}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify(note),
                            }).catch(e => { });

                            if (res === undefined || !res.ok) {
                                toast({
                                    status: 'error',
                                    position: 'bottom-left',
                                    title: 'Error',
                                    description: 'Error creating note, please try again.',
                                });
                            } else {
                                // reload lot
                                reloadSelected();
                                onClose();
                            }
                        }}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddNoteModalButton;
