import { Heading, Box, Center, Spinner, Button, HStack, VStack, LinkOverlay, Flex, IconButton, useToast, Text, Checkbox, SimpleGrid, FormControl, FormLabel, Input } from "@chakra-ui/react"
import AddNoteModalButton from "./createNoteModal";

function SelectedLot({ lot, token, user, departments }) {
    return (
        <Box p={25} h='100%' overflowY='scroll'>
            <HStack spacing={5}>
                <Box w='100%' h={500}>
                    <Heading fontSize='125%'>Assignments</Heading>
                    <Box mt={5}>
                        <VStack spacing={5}>
                            {lot.assignments.map(assignment => {
                                return (
                                    <FormControl>
                                        <FormLabel>{departments.filter(x => x.id === assignment.id)[0].name}</FormLabel>
                                        <Input placeholder='0' value={assignment.count} />
                                    </FormControl>
                                );
                            })}
                        </VStack>
                    </Box>
                </Box>

                <Box h={500}>
                    <Heading fontSize='125%'>Tasks / Testing</Heading>

                    <Box p={15} h={500} mt={5} borderWidth={1} borderRadius={5} w={300}>
                        {lot.tasks.filter(x => x.category === 'TESTING').map(task => {
                            return (
                                <FormControl>
                                    <Checkbox mt={2} isChecked={task.completed}>{task.name}</Checkbox>
                                </FormControl>
                            );
                        })}
                    </Box>
                </Box>
                <Box h={500}>
                    <Heading fontSize='125%'>Tasks / Grading</Heading>
                    <Box p={15} h={500} mt={5} borderWidth={1} borderRadius={5} w={300}>
                        {lot.tasks.filter(x => x.category === 'GRADING').map(task => {
                            return (
                                <FormControl>
                                    <Checkbox mt={2} isChecked={task.completed}>{task.name}</Checkbox>
                                </FormControl>
                            );
                        })}
                    </Box>
                </Box>
            </HStack>

            <Box w='100%' mt={20}>
                <Heading fontSize='125%'>Notes</Heading>
                <Box borderRadius={5} h={300} overflowY='scroll' p={15} borderWidth={1} mt={5}>
                    {lot.notes.map(note => {
                        return (
                            <Box mb={5} borderRadius={5} p={15} borderWidth={1}>
                                <Text>Created by <b>{note.createdBy}</b></Text>

                                <Text mt={2}>{note.data}</Text>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            <Box w='100%' mt={10}>
                <Heading fontSize='125%'>Audits</Heading>
                <Box borderRadius={5} h={300} overflowY='scroll' p={15} borderWidth={1} mt={5}>
                    {lot.audits.map(audit => {
                        return (
                            <Box mb={5} borderRadius={5} p={15} borderWidth={1}>
                                <Text fontSize='115%'><b>{audit.type}</b></Text>
                                <Text>Triggered by <b>{audit.createdBy}</b></Text>

                                <AuditData departments={departments} audit={audit} mt={5} />
                            </Box>
                        );
                    })}
                </Box>
            </Box>

        </Box>
    );
}

function AuditData({ audit, departments, mt = 0 }) {
    let d = audit.data;
    if (d === undefined)
        return (<Text mt={mt}>No data</Text>);

    if (audit.type === 'LOT_REASSIGNED') {
        let data = JSON.parse(d);

        return (
            <HStack mt={mt} spacing={5} >
                <Text>
                    <b>Old</b>
                    {data.old.map((x) => {
                        return (<Text>{departments.filter(y => y.id === x.id)[0].name}: {x.count}</Text>);
                    })}
                </Text>

                <Text>
                    <b>New</b>
                    {data.updated.map((x) => {
                        return (<Text>{departments.filter(y => y.id === x.id)[0].name}: {x.count}</Text>);
                    })}
                </Text>
            </HStack>
        );
    }

    return (<Text mt={mt}>{audit.data}</Text>);
}

export default SelectedLot;