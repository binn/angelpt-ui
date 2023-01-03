import { Button, Checkbox, CheckboxGroup, Flex, FormControl, FormLabel, Input, Radio, RadioGroup, Select, VStack } from "@chakra-ui/react";

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

function AddLotModalButton({ departments, tasks, disabled }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const testingTasks = [
        "Fully Test",
        "Wifi, Touch, Charge",
        "Unlock",
        "Flash",
    ];

    const gradingTasks = [
        "Clean",
        "Grade",
        "Temporary Lenstape",
        "Original Lenstape",
    ];

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
                            <Input placeholder='Lot #' />
                        </FormControl>

                        <Flex mt={15}>
                            <FormControl w='60%'>
                                <FormLabel>Model #</FormLabel>
                                <Input placeholder='Model #' />
                            </FormControl>

                            <FormControl ml={3} w='40%'>
                                <FormLabel>Item Count</FormLabel>
                                <Input placeholder='Item Count' />
                            </FormControl>
                        </Flex>

                        <FormControl mt={15} w='100%'>
                            <FormLabel>Grade</FormLabel>
                            <Select>
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
                                <option value='New'>New</option>
                                <option value='Unknown'>Unknown</option>
                            </Select>
                        </FormControl>

                        <FormControl mt={15} w='100%'>
                            <FormLabel>Starting Department</FormLabel>
                            <Select>
                                {departments.map(department => {
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
                                                <>
                                                    <Checkbox value={x.template}>{x.template}</Checkbox>
                                                </>
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
                                                <>
                                                    <Checkbox value={x.template}>{x.template}</Checkbox>
                                                </>
                                            );
                                        })}
                                    </VStack>
                                </CheckboxGroup>
                            </FormControl>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' w='100%'>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddLotModalButton;
