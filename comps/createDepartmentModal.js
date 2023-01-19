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

function CreateDepartmentModalButton({ disabled, selected, token, reloadSelected }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [defaultDepartment, setDefaultDepartment] = useState(false);
    const toast = useToast();

    return (
        <>
            <Button disabled={disabled ? disabled : false} ml={5} colorScheme='green' onClick={onOpen}>
                Create Department
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Department</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input placeholder='Name' value={name} onChange={(e) => setName(e.currentTarget.value)} />
                        </FormControl>

                        <FormControl mt={5}>
                            <FormLabel>Description</FormLabel>
                            <Textarea placeholder='Description' value={description} onChange={(e) => setDescription(e.currentTarget.value)} minH={150} />
                        </FormControl>

                        <FormControl mt={5}>
                            <Checkbox value={defaultDepartment} onChange={(e) => setDefaultDepartment(e.currentTarget.checked)}>Default</Checkbox>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%' onClick={async () => {
                            let res = await fetch(`${config.api}/admin/departments`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    name,
                                    description,
                                    default: defaultDepartment,
                                }),
                            }).catch(e => { });

                            if (res === undefined || !res.ok) {
                                toast(await config.error(res, `Error creating department ${name}`));
                            } else {
                                toast({
                                    title: "Success",
                                    position: "top-right",
                                    description: `Successfully created department ${name}`,
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

export default CreateDepartmentModalButton;
