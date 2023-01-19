import { Button, Flex, FormControl, FormLabel, Textarea, useToast, Input, Checkbox, Select } from "@chakra-ui/react";

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

function CreateEmployeeModalButton({ disabled, selected, token, reloadSelected, departments }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [pin, setPin] = useState("0000");
    const [admin, setAdmin] = useState(false);
    const [supervisor, setSupervisor] = useState(false);
    const [department, setDepartment] = useState("1");

    const toast = useToast();

    return (
        <>
            <Button disabled={disabled ? disabled : false} ml={5} colorScheme='green' onClick={onOpen}>
                Create Employee
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Employee</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>

                            <Flex w='100%'>
                                <Input placeholder='John' value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)} />
                                <Input placeholder='Doe' value={lastName} onChange={(e) => setLastName(e.currentTarget.value)} ml={2} />
                            </Flex>
                        </FormControl>

                        <FormControl mt={5}>
                            <FormLabel>PIN</FormLabel>
                            <Flex>
                                <Input w='100%' placeholder='PIN' value={pin} maxLength={4} onChange={(e) => setPin(e.currentTarget.value)} type='number' />
                                <Button colorScheme={'green'} ml={2} onClick={() => {
                                    setPin(`${getRandomInt(1000, 9999)}`);
                                }}>Randomize</Button>
                            </Flex>
                        </FormControl>

                        <FormControl mt={5}>
                            <FormLabel>Department</FormLabel>
                            <Select value={department} onChange={(e) => setDepartment(e.currentTarget.value)}>
                                {departments.map((department) => {
                                    return (
                                        <option value={department.id}>{department.name}</option>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <FormControl mt={5}>
                            <Checkbox value={admin} onChange={(e) => setAdmin(e.currentTarget.checked)}>Admin</Checkbox>
                            <br />
                            <Checkbox mt={2} value={supervisor} onChange={(e) => setSupervisor(e.currentTarget.checked)}>Supervisor</Checkbox>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%' onClick={async () => {
                            let res = await fetch(`${config.api}/admin/employees`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    firstName,
                                    lastName,
                                    pin,
                                    department,
                                    admin,
                                    supervisor,
                                }),
                            }).catch(e => { });

                            if (res === undefined || !res.ok) {
                                toast(await config.error(res, `Error creating employee ${firstName} ${lastName}`));
                            } else {
                                toast({
                                    title: "Success",
                                    position: "top-right",
                                    description: `Successfully created employee ${firstName} ${lastName}`,
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export default CreateEmployeeModalButton;
