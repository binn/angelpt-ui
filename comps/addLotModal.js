import { Button, Checkbox, CheckboxGroup, Flex, FormControl, FormLabel, Input, Radio, RadioGroup, Select, useToast, VStack } from "@chakra-ui/react";

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
import { useState } from "react";
import config from "./config";

function AddLotModalButton({ departments, tasks, token, disabled, onChange }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [lotNumber, setLotNumber] = useState("");
    const [modelNumber, setModelNumber] = useState("");
    const [itemCount, setItemCount] = useState("");
    const [grade, setGrade] = useState("A+");
    const [startingDepartmentId, setStartingDepartmentId] = useState(departments.filter(x => x.name !== 'HR')[0].id);
    const [lotTasks, setLotTasks] = useState([]);

    const toast = useToast();

    return (
        <>
            <Button disabled={disabled ? disabled : false} w='100%' colorScheme='green' onClick={onOpen}>
                Add Lot
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Lot</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl w='100%'>
                            <FormLabel>Lot #</FormLabel>
                            <Input onChange={(e) => setLotNumber(e.currentTarget.value)} value={lotNumber} placeholder='Lot #' />
                        </FormControl>

                        <Flex mt={15}>
                            <FormControl w='60%'>
                                <FormLabel>Model #</FormLabel>
                                <Input onChange={(e) => setModelNumber(e.currentTarget.value)} value={modelNumber} placeholder='Model #' />
                            </FormControl>

                            <FormControl ml={3} w='40%'>
                                <FormLabel>Item Count</FormLabel>
                                <Input onChange={(e) => setItemCount(e.currentTarget.value)} value={itemCount} placeholder='Item Count' />
                            </FormControl>
                        </Flex>

                        <FormControl mt={15} w='100%'>
                            <FormLabel>Grade</FormLabel>
                            <Select onChange={(e) => setGrade(e.currentTarget.value)} value={grade}>
                                <option value='A+'>A+</option>
                                <option value='A'>A</option>
                                <option value='A-'>A-</option>
                                <option value='B+'>B+</option>
                                <option value='B'>B</option>
                                <option value='B-'>B-</option>
                                <option value='C+'>C+</option>
                                <option value='C'>C</option>
                                <option value='C-'>C-</option>
                                <option value='D'>D</option>
                                <option value='CPO'>CPO</option>
                                <option value='NEW'>New</option>
                                <option value='UNKNOWN'>Unknown</option>
                            </Select>
                        </FormControl>

                        <FormControl mt={15} w='100%'>
                            <FormLabel>Starting Department</FormLabel>
                            <Select onChange={(e) => setStartingDepartmentId(e.currentTarget.value)} value={startingDepartmentId}>
                                {departments.filter(x => x.name !== 'HR').map(department => {
                                    return (
                                        <option value={department.id}>{department.name}</option>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <Flex>
                            <FormControl mt={15} w='50%'>
                                <FormLabel>Tasks / Testing</FormLabel>
                                <CheckboxGroup>
                                    <VStack spacing={4} w='100%' alignItems='left'>
                                        {tasks.filter(x => x.category === 'TESTING').map(x => {
                                            return (
                                                <Checkbox checked={lotTasks.includes(x.id)} onChange={(e) => {
                                                    lotTasks.includes(x.id) ?
                                                        delete lotTasks[lotTasks.indexOf(x.id)] :
                                                        lotTasks.push(x.id);
                                                }}>{x.template}</Checkbox>
                                            );
                                        })}
                                    </VStack>
                                </CheckboxGroup>
                            </FormControl>

                            <FormControl mt={15} w='50%'>
                                <FormLabel>Tasks / Grading</FormLabel>
                                <CheckboxGroup>
                                    <VStack spacing={4} w='100%' alignItems='left'>
                                        {tasks.filter(x => x.category === 'GRADING').map(x => {
                                            return (
                                                <Checkbox checked={lotTasks.includes(x.id)} onChange={(e) => {
                                                    lotTasks.includes(x.id) ?
                                                        delete lotTasks[lotTasks.indexOf(x.id)] :
                                                        lotTasks.push(x.id);
                                                }}>{x.template}</Checkbox>
                                            );
                                        })}
                                    </VStack>
                                </CheckboxGroup>
                            </FormControl>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%' onClick={async () => {
                            let res = await fetch(`${config.api}/lots`, {
                                method: 'POST',
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    lotNo: lotNumber,
                                    count: itemCount,
                                    department: startingDepartmentId,
                                    tasks: lotTasks,
                                    model: modelNumber,
                                    grade,
                                }),
                            }).catch(e => { });

                            if (res === undefined || !res.ok)
                                return toast({
                                    position: 'bottom-right',
                                    status: 'error',
                                    title: 'Error',
                                    description: 'Error creating lot',
                                });

                            if (onChange)
                                onChange();
                            onClose();
                        }}>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddLotModalButton;
