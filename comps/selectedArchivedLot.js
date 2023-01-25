import { Heading, Box, Button, HStack, VStack, LinkOverlay, Flex, IconButton, useToast, Text, Checkbox, SimpleGrid, FormControl, FormLabel, Input, Icon, Editable, EditablePreview, EditableInput } from "@chakra-ui/react"
import config from "./config";
import moment from "moment";
import React from 'react';
import { FiTrash } from "react-icons/fi";
import DeletionConfirmationModalButton from "./deletionConfirmationModal";

class SelectedArchivedLot extends React.Component {
    constructor(props) {
        super(props);

        let incomingAssignments = JSON.parse(JSON.stringify(props.lot.assignments)); // prevent javascript shallow copy
        this.state = {
            assignments: incomingAssignments,
        };

        this.toast = props.toast;
    }

    componentWillReceiveProps(newProps) {
        let incomingAssignments = JSON.parse(JSON.stringify(newProps.lot.assignments));
        this.state = {
            assignments: incomingAssignments,
        };
    }

    async updateTaskCompletedState(completed, task) {
        let res = await fetch(`${config.api}/tasks/${task.id}/complete?completed=${completed}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.props.token}`,
            },
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            this.toast(await config.error(res, 'Error updating task'));
            return false;
        }

        return true;
    }

    render() {
        let assignmentCountSum = this.state.assignments.reduce((a, b) => {
            return a + parseInt(b.count);
        }, 0);

        if (assignmentCountSum == NaN)
            assignmentCountSum = "INVALID!";

        return (
            <Box p={25} h='100%' overflowY='scroll' overflowX='hidden'>
                <HStack w='100%' spacing={5}>
                    <VStack h={500}>
                        <Box w='100%' h='100%'>
                            <Box w='100%' h={200}>
                                <Heading mt={-5} fontSize='160%'>{this.props.lot.lotNo}</Heading>

                                <Text mt={3}>Time Created - {new Date(this.props.lot.timestamp).toLocaleString()}</Text>
                                <Text>Amount Items - {this.props.lot.count}</Text>
                                <Text>Model - {this.props.lot.grade} {this.props.lot.model}</Text>
                                <Text>Notes - {this.props.lot.notes.length}</Text>
                                <Text>Audits - {this.props.lot.audits.length}</Text>
                                <Text>Last Updated - {new Date(this.props.lot.audits[0].timestamp).toLocaleString()}</Text>
                                <Text>Archived At - {new Date(this.props.lot.archivedAt).toLocaleString()}</Text>
                            </Box>
                            <Heading fontSize='125%' mt={10}>Assignments</Heading>
                            <Box mt={5}>
                                <VStack w='100%' h='100%'>
                                    <SimpleGrid maxH={172} overflowY='auto' spacing={4} columns={3} w='100%'>
                                        {this.props.lot.assignments.map(assignment => {
                                            return (
                                                <FormControl>
                                                    <FormLabel>{this.props.departments.filter(x => x.id === assignment.id)[0].name}</FormLabel>
                                                    <Input type='number' placeholder='0' defaultValue={0} value={this.state.assignments.filter(x => x.id === assignment.id)[0].count} disabled />
                                                </FormControl>
                                            );
                                        })}
                                    </SimpleGrid>
                                    <Text mt={0} textAlign='left' w='100%'>Total: <b style={{ color: assignmentCountSum !== this.props.lot.count ? 'red' : 'black' }}>{`${assignmentCountSum}`} / {this.props.lot.count}</b></Text>
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
                                        <Flex w='100%' transform='scale(1.2)' ml={6} mt={2} alignItems='center'>
                                            <Checkbox mr={2} defaultChecked={task.completed} disabled>{task.name}</Checkbox>
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
                                        <Flex w='100%' transform='scale(1.2)' ml={6} mt={2} alignItems='center'>
                                            <Checkbox mr={2} defaultChecked={task.completed} disabled>{task.name}</Checkbox>
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
                        <SimpleGrid w='100%' columns={2}>
                            {this.props.lot.notes.length == 0 ?
                                <Text>There are no notes currently associated with this lot.</Text>
                                : this.props.lot.notes.map(note => {
                                    return (
                                        <Box mb={5} borderRadius={5} p={15} borderWidth={1}>
                                            <Flex h={8} mb={2} w={'100%'} position='relative' alignItems='center'>
                                                <Text position='absolute' left={0}>Created by <b>{note.createdBy}</b></Text>
                                            </Flex>

                                            {note.data.split('\n').map(x => <Text>{x}</Text>)}
                                        </Box>
                                    );
                                })}
                        </SimpleGrid>
                    </Box>
                </Box>

                <Box w='100%' mt={10}>
                    <Heading fontSize='125%'>Audits</Heading> { /* please add a filter multiselect where you can select audit types to filter by */}
                    <Box borderRadius={5} h={500} overflowY='scroll' p={15} borderWidth={1} mt={5}>
                        <SimpleGrid columns={3} spacing={5}>
                            {this.props.lot.audits.map(audit => {
                                return (
                                    <Box borderRadius={5} p={15} borderWidth={1}>
                                        <Text fontSize='115%'><b>{audit.type}</b></Text>
                                        <Text>Triggered by <b>{audit.createdBy}</b></Text>
                                        <Text>{moment(audit.timestamp).format('MM/DD/YYYY hh:mm A')}</Text>

                                        <AuditData departments={this.props.departments} audit={audit} mt={5} />
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
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
                        let d = departments.filter(y => y.id === x.id)[0];
                        return (<Text>{d ? d.name : `Unknown (${x.id})`}: {x.count}</Text>);
                    })}
                </Text>

                <Text>
                    <b>New</b>
                    {data.updated.map((x) => {
                        let d = departments.filter(y => y.id === x.id)[0];
                        return (<Text>{d ? d.name : `Unknown (${x.id})`}: {x.count}</Text>);
                    })}
                </Text>
            </HStack>
        );
    }

    if(audit.type === 'NOTE_DELETED') {
        let data = JSON.parse(d);
        
        return (
                <>
                    <Text mt={mt}>{data.data}</Text>
                    <br />
                    <Text>Created by: {data.createdBy}</Text>
                    <Text>Timestamp: {moment(data.timestamp).format('MM/DD/YYYY hh:mm A')}</Text>
                </>
        );
    }

    return (<Text mt={mt}>{audit.data}</Text>);
}

export default SelectedArchivedLot;