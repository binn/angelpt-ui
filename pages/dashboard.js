import { Heading, Box, Center, Spinner, Button, HStack, LinkOverlay, Flex, IconButton, useToast, Text, Checkbox } from "@chakra-ui/react"
import Header from "../comps/header";

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react';

import moment from 'moment';
import { FiTrash } from 'react-icons/fi';

import config from '../comps/config';
import { useState, useEffect } from 'react';

function Dashboard() {
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [lots, setLots] = useState([]);
    const [selected, setSelected] = useState(undefined);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const toast = useToast();

    useEffect(() => {
        if (localStorage === undefined)
            return;

        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");

        if (u === undefined || t === undefined)
            window.location.href = '/';

        setToken(t);
        setUser(u);

        (async () => {
            await fetchLots(t);
            await fetchDepartments(t);
            setLoading(false);
        })();
    });

    const fetchDepartments = async (t) => {
        if (departments.length !== 0)
            return;

        let res = await fetch(`${config.api}/departments`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        });

        let result = await res.json();
        setDepartments(result);
    }

    const fetchLots = async (t) => {
        if (lots.length !== 0)
            return;

        let res = await fetch(`${config.api}/lots?page=0`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        });

        let result = await res.json();
        setLots(result.results);
    }

    if (loading)
        return (
            <>
                <Header />

                <Center mt={100}>
                    <Spinner />
                </Center>
            </>
        );

    return (
        <Box>
            <Header />

            <HStack w='100%'>
                <Box p={25} h='91.5vh' w='65%'>
                    {selected !== undefined ?
                        <HStack w='100%'>
                            <Box w='100%' h={500}>
                                <Heading fontSize='125%'>Lot Information</Heading>
                                <Text mt={5}>Lot No - {selected.lotNo}</Text>
                                <Text>Count - {selected.count}</Text>
                                <Text>Model - {selected.model}</Text>
                                <Text>Grade - {selected.grade}</Text>
                                <Text>Created On - {moment(selected.timestamp).format('MM/DD/YYYY hh:mm A')}</Text>

                                <Heading fontSize='125%' mt={25}>Assignments</Heading>
                                <Box mt={5}>
                                    {selected.assignments.map(assignment => {
                                        return (
                                            <Text>{departments.filter(x => x.id === assignment.id)[0].name} - {assignment.count}</Text>
                                        );
                                    })}
                                </Box>
                            </Box>

                            <HStack spacing={5}>
                                <Box h={500}>
                                    <Heading fontSize='125%'>Testing</Heading>

                                    <Box p={15} h={500} mt={5} borderWidth={1} borderRadius={5} w={250}>
                                        {selected.tasks.filter(x => x.category === 'TESTING').map(task => {
                                            return (
                                                <Checkbox mt={2} isChecked={task.completed}>{task.name}</Checkbox>
                                            );
                                        })}
                                    </Box>
                                </Box>
                                <Box h={500}>
                                    <Heading fontSize='125%'>Grading</Heading>
                                    <Box p={15} h={500} mt={5} borderWidth={1} borderRadius={5} w={250}>
                                        {selected.tasks.filter(x => x.category === 'GRADING').map(task => {
                                            return (
                                                <Checkbox mt={2} isChecked={task.completed}>{task.name}</Checkbox>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </HStack>
                        </HStack>
                        : <></>}

                </Box>

                <Box w='35%'>
                    <TableContainer h={'91.5vh'} w={'100%'} overflowY='scroll' overflowX='hidden'>
                        <Table borderWidth={1} variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th hidden>id</Th>
                                    <Th>Lot #</Th>
                                    <Th>Model</Th>
                                    <Th>Grade</Th>
                                    <Th>Count</Th>
                                    <Th>Created On</Th>
                                    <Th hidden={!user.supervisor}><Center><FiTrash /></Center></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {lots.map(lot => {
                                    return (
                                        <Tr bg={selected?.id === lot.id ? 'rgba(0, 0, 0, 0.1)' : ''} _hover={{ bg: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' }} onClick={async () => {
                                            let res = await fetch(`${config.api}/lots/${lot.id}`, {
                                                headers: {
                                                    Authorization: `Bearer ${token}`,
                                                },
                                            }).catch(e => { });

                                            if (res === undefined || !res.ok)
                                                return toast({
                                                    status: 'error',
                                                    position: 'bottom-left',
                                                    title: 'Error',
                                                    description: 'Error fetching lot',
                                                });

                                            let result = await res.json();
                                            setSelected(result);
                                        }}>
                                            <Td hidden>{lot.id}</Td>
                                            <Td>{lot.lotNo}</Td>
                                            <Td>{lot.model}</Td>
                                            <Td>{lot.grade}</Td>
                                            <Td>{lot.count}</Td>
                                            <Td>
                                                {moment(lot.timestamp).format('MM/DD/YYYY hh:mm A')}
                                            </Td>
                                            <Td hidden={!user.supervisor}>
                                                <IconButton
                                                    bg='none'
                                                    icon={<FiTrash color='red' />}
                                                    onClick={() => {
                                                        // delete
                                                    }}
                                                />
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </HStack >
        </Box >
    );
}

export default Dashboard;