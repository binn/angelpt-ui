import { Heading, Box, Button, HStack, VStack, LinkOverlay, Flex, IconButton, useToast, Text, Checkbox, SimpleGrid, FormControl, FormLabel, Input, Icon, Editable, EditablePreview, EditableInput } from "@chakra-ui/react"
import config from "./config";

import React from 'react';

class SelectedLot extends React.Component {
    constructor(props) {
        super(props);

        let t = props.lot.assignments.map(x => x);
        this.state = {
            assignments: t,
        };
    }

    componentWillReceiveProps(newProps) {
        let t = newProps.lot.assignments.map(x => x);
        this.state = {
            assignments: t,
        };
    }

    async updateTaskCompletedState(completed, task) {
        let res = await fetch(`${config.api}/tasks/${task.id}/complete?completed=${completed}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.props.token}`,
            },
        }).catch(e => { });

        if (res === undefined || !res.ok)
            return false;

        return true;
    }

    render() {
        let assignmentCountSum = this.state.assignments.reduce((a, b) => {
            return a + parseInt(b.count);
        }, 0);

        return (
            <Box p={25} h='100%' overflowY='scroll'>
                <HStack w='100%' spacing={5}>
                    <VStack h={500}>
                        <Box w='100%' h='100%'>
                            <Box w='100%' h={200}>
                                <Heading fontSize='160%'>{this.props.lot.lotNo}</Heading>

                                <Text mt={3}>Time Created - {new Date(this.props.lot.timestamp).toLocaleString()}</Text>
                                <Text>Amount Items - {this.props.lot.count}</Text>
                                <Text>Model - {this.props.lot.grade} {this.props.lot.model}</Text>
                                <Text>Notes - {this.props.lot.notes.length}</Text>
                                <Text>Audits - {this.props.lot.audits.length}</Text>
                                <Text>Last Updated - {new Date(this.props.lot.audits[0].timestamp).toLocaleString()}</Text>
                            </Box>
                            <Heading fontSize='125%'>Assignments</Heading>
                            <Box h='100%' mt={5}>
                                <VStack w='100%' h='100%'>
                                    <SimpleGrid spacing={4} columns={3} w='100%'>
                                        {this.props.lot.assignments.map(assignment => {
                                            return (
                                                <FormControl>
                                                    <FormLabel>{this.props.departments.filter(x => x.id === assignment.id)[0].name}</FormLabel>
                                                    <Input type='number' placeholder='0' defaultValue={0} value={this.state.assignments.filter(x => x.id === assignment.id)[0].count} onChange={(e) => {
                                                        let updatedAssignments = this.state.assignments;
                                                        updatedAssignments[updatedAssignments.indexOf(assignment)].count = e.currentTarget.value;

                                                        this.setState((state, props) => {
                                                            return {
                                                                assignments: updatedAssignments,
                                                            };
                                                        });
                                                    }} />
                                                </FormControl>
                                            );
                                        })}
                                    </SimpleGrid>
                                    <Text mt={0} textAlign='left' w='100%'>Total: <b style={{ color: assignmentCountSum !== this.props.lot.count ? 'red' : 'black' }}>{`${assignmentCountSum}`} / {this.props.lot.count}</b></Text>
                                    <Flex w='100%'>
                                        <Button w='50%' mr={2} onClick={async () => {
                                        }} colorScheme='green'>
                                            Save Changes
                                        </Button>

                                        <Button w='50%' onClick={() => {
                                            console.log(this.props.lot.assignments);
                                            this.setState((state, props) => {
                                                let t = this.props.lot.assignments.map(x => x);
                                                return {
                                                    assignments: t,
                                                };
                                            });
                                        }} colorScheme='red'>
                                            Discard Changes
                                        </Button>
                                    </Flex>
                                </VStack>
                            </Box>
                        </Box>
                    </VStack>

                    <Box h='100%'>
                        <Flex h={15} w='100%' alignItems='center' position='relative'>
                            <Heading fontSize='125%' left={0} position='absolute'>Tasks / Testing</Heading>
                        </Flex>

                        <Box p={15} h={500} mt={5} borderWidth={1} borderRadius={5} w={300}>
                            {this.props.lot.tasks.filter(x => x.category === 'TESTING').map(task => {
                                return (
                                    <FormControl>
                                        <Flex w='100%' mt={2} alignItems='center'>
                                            <Checkbox mr={2} defaultChecked={task.completed} onChange={async (e) => {
                                                let completed = e.currentTarget.checked;

                                                let result = await updateTaskCompletedState(completed, task);
                                                if (!result) {
                                                    e.currentTarget.checked = !completed;
                                                }
                                            }} />
                                            <Text>{task.name}</Text>
                                        </Flex>
                                    </FormControl>
                                );
                            })}
                        </Box>
                    </Box>
                    <Box h='100%'>
                        <Flex h={15} w='100%' alignItems='center' position='relative'>
                            <Heading fontSize='125%' left={0} position='absolute'>Tasks / Grading</Heading>
                        </Flex>
                        <Box p={15} h={500} mt={5} borderWidth={1} borderRadius={5} w={300}>
                            {this.props.lot.tasks.filter(x => x.category === 'GRADING').map(task => {
                                return (
                                    <FormControl>
                                        <Flex w='100%' mt={2} alignItems='center'>
                                            <Checkbox mr={2} defaultChecked={task.completed} onChange={async (e) => {
                                                let completed = e.currentTarget.checked;

                                                let result = await updateTaskCompletedState(completed, task);
                                                if (!result) {
                                                    e.currentTarget.checked = !completed;
                                                }
                                            }} />
                                            <Text>{task.name}</Text>
                                        </Flex>
                                    </FormControl>
                                );
                            })}
                        </Box>
                    </Box>
                </HStack>

                <Box w='100%' mt={15}>
                    <Heading fontSize='125%'>Notes</Heading>
                    <Box borderRadius={5} h={300} overflowY='scroll' p={15} borderWidth={1} mt={5}>
                        {this.props.lot.notes.map(note => {
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
                        {this.props.lot.audits.map(audit => {
                            return (
                                <Box mb={5} borderRadius={5} p={15} borderWidth={1}>
                                    <Text fontSize='115%'><b>{audit.type}</b></Text>
                                    <Text>Triggered by <b>{audit.createdBy}</b></Text>

                                    <AuditData departments={this.props.departments} audit={audit} mt={5} />
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

            </Box>
        )
    }

}

function generateRandomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
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