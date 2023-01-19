import { Button, Flex, FormControl, FormLabel, useToast, Input, Checkbox, Select, Textarea } from "@chakra-ui/react";

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

function CreateTaskTemplateModalButton({ disabled, selected, token, reloadSelected }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [template, setTemplate] = useState("");
    const [category, setCategory] = useState("TESTING");
    const toast = useToast();

    return (
        <>
            <Button disabled={disabled ? disabled : false} ml={5} colorScheme='green' onClick={onOpen}>
                Create Task Template
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Task Template</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Template</FormLabel>
                            <Input placeholder='Template' value={template} onChange={(e) => setTemplate(e.currentTarget.value)} />
                        </FormControl>

                        <FormControl mt={5}>
                            <FormLabel>Category</FormLabel>
                            <Select value={category} onChange={(e) => setCategory(e.currentTarget.value)}>
                                <option value={"TESTING"}>TESTING</option>
                                <option value={"GRADING"}>GRADING</option>
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%' onClick={async () => {
                            let res = await fetch(`${config.api}/tasks/templates?category=${category}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify(template),
                            }).catch(e => { });

                            if (res === undefined || !res.ok) {
                                toast(await config.error(res, `Error creating task template ${template}`));
                            } else {
                                toast({
                                    title: "Success",
                                    position: "top-right",
                                    description: `Successfully created task template ${template}`,
                                    status: "success"
                                });

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

export default CreateTaskTemplateModalButton;
