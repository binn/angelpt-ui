import { Button, Textarea, Flex, FormControl, Checkbox, CheckboxGroup, VStack, FormLabel, useToast } from "@chakra-ui/react";

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

import { useEffect, useState } from 'react';
import config from "./config";

function EditTasksModalButton({ disabled, lot, tasks, token, reloadSelected }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [lotTasks, setLotTasks] = useState([]);
    const [newTasks, setNewTasks] = useState([]);
    const toast = useToast();

    useEffect(() => {
        if (lot === undefined)
            return;

        let t = [];
        lot.tasks.forEach(task => {
            let lt = tasks.filter(x => x.template.toLowerCase() === task.name.toLowerCase())[0];
            if (lt !== undefined) {
                t.push(lt.id);
            }
        });
        setNewTasks([]);
        setLotTasks(t);
    }, [lot]);

    if (lot === undefined)
        return <Button disabled={disabled ? disabled : false} w='100%' onClick={onOpen}>
            Edit Tasks
        </Button>;

    return (
        <>
            <Button disabled={tasks.filter(x => !lotTasks.includes(x.id)).length === 0 ? true : disabled ? disabled : false} w='100%' onClick={onOpen}>
                Edit Tasks
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Tasks</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex>
                            <FormControl w='50%'>
                                <FormLabel>Tasks / Testing</FormLabel>
                                <CheckboxGroup>
                                    <VStack spacing={4} w='100%' alignItems='left'>
                                        {tasks.filter(x => x.category === 'TESTING' && !lotTasks.includes(x.id)).map(x => {
                                            return (
                                                <Checkbox onChange={(e) => {
                                                    newTasks.includes(x.id) ?
                                                        delete newTasks[newTasks.indexOf(x.id)] :
                                                        newTasks.push(x.id);
                                                }}>{x.template}</Checkbox>
                                            );
                                        })}
                                    </VStack>
                                </CheckboxGroup>
                            </FormControl>

                            <FormControl w='50%'>
                                <FormLabel>Tasks / Grading</FormLabel>
                                <CheckboxGroup>
                                    <VStack spacing={4} w='100%' alignItems='left'>
                                        {tasks.filter(x => x.category === 'GRADING' && !lotTasks.includes(x.id)).map(x => {
                                            return (
                                                <Checkbox onChange={(e) => {
                                                    newTasks.includes(x.id) ?
                                                        delete newTasks[newTasks.indexOf(x.id)] :
                                                        newTasks.push(x.id);
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
                            let res = await fetch(`${config.api}/lots/${lot.id}/tasks`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newTasks.filter(x => x !== undefined || x !== null)),
                            }).catch(e => { });

                            if (res === undefined || !res.ok)
                                return toast({
                                    status: 'error',
                                    title: 'Error',
                                    description: 'Error updating tasks',
                                    position: 'bottom-right',
                                });

                            onClose();
                            reloadSelected();
                        }}>Save Changes</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditTasksModalButton;
