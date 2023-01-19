import { Heading, Box, Center, Spinner, Button, HStack, LinkOverlay, Flex, IconButton, useToast, Text, Checkbox, SimpleGrid, FormControl, FormLabel, Input } from "@chakra-ui/react"
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
import SelectedLot from "../comps/selectedLot";
import { FiTrash, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import config from '../comps/config';
import { useState, useEffect, useRef, useCallback } from 'react';
import AddLotModalButton from "../comps/addLotModal";
import AddNoteModalButton from "../comps/createNoteModal";
import EditTasksModalButton from "../comps/editTasksModal";

function Administration() {
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [employees, setEmployees] = useState([]);
    const [selected, setSelected] = useState(undefined);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [loadingSelected, setLoadingSelected] = useState(false);

    const toast = useToast();

    useEffect(() => {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");

        if (u === undefined || t === undefined)
            window.location.href = '/';

        setToken(t);
        setUser(JSON.parse(u));

        if(!user.admin)
            window.location.href = '/dashboard';

        (async () => {
            await fetchEmployees(t);
            await fetchDepartments(t);
            await fetchTasks(t);

            setLoading(false);
        })();
    }, []);

    const selectLot = async (lot) => {
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
    }

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

    const fetchTasks = async (t) => {
        if (tasks.length !== 0)
            return;

        let res = await fetch(`${config.api}/tasks/templates`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        });

        let result = await res.json();
        setTasks(result);
    }

    const fetchEmployees = async (t, p, q) => {
        let res = await fetch(`${config.api}/employees`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        });

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }

        let result = await res.json();
        setEmployees(result);
    }

    const reloadSelected = async () => {
        setLoadingSelected(true);
        let res = await fetch(`${config.api}/lots/${selected.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            return toast({
                status: 'error',
                position: 'bottom-left',
                title: 'Error',
                description: 'Error fetching lot',
            });
            setLoadingSelected(false);
        }

        let result = await res.json();
        setSelected(result);
        setLoadingSelected(false);
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
                <Box h='91.5vh' w='100%'>
                    {loadingSelected ?
                        <Center><Spinner mt={100} /></Center> :
                        (selected !== undefined ?
                            <SelectedLot lot={selected} user={user} token={token} departments={departments} reloadSelected={reloadSelected}/>
                            : <></>)}

                </Box>

                <Box minW={[600, 700, 800]}>
                    <HStack spacing={5} alignItems='center' w='100%' borderWidth={1} p={15} borderBottomWidth={0} h='10vh'>
                        <AddLotModalButton departments={departments} token={token} tasks={tasks} onChange={fetchEmployees} />
                        <AddNoteModalButton selected={selected} reloadSelected={reloadSelected} token={token} disabled={selected !== undefined ? false : true} />
                        <EditTasksModalButton reloadSelected={reloadSelected} disabled={selected !== undefined ? false : true} lot={selected} token={token} tasks={tasks} />
                    </HStack>

                    <TableContainer h={'71.85vh'} w={'100%'} overflowY='scroll' overflowX='hidden'>
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
                                        <Tr bg={selected?.id === lot.id ? 'rgba(0, 0, 0, 0.1)' : ''} _hover={{ bg: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}>
                                            <Td hidden>{lot.id}</Td>
                                            <Td onClick={() => selectLot(lot)}>{lot.lotNo}</Td>
                                            <Td onClick={() => selectLot(lot)} w={125} maxW={125} overflowX='hidden'>{lot.model}</Td>
                                            <Td onClick={() => selectLot(lot)}>{lot.grade}</Td>
                                            <Td onClick={() => selectLot(lot)}>{lot.count}</Td>
                                            <Td onClick={() => selectLot(lot)}>
                                                {moment(lot.timestamp).format('MM/DD/YYYY hh:mm A')}
                                            </Td>
                                            <Td hidden={!user.supervisor}>
                                                <IconButton
                                                    bg='none'
                                                    icon={<FiTrash color='red' />}
                                                    onClick={async () => {
                                                        let res = await fetch(`${config.api}/lots/${lot.id}`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                            }
                                                        }).catch(e => { });

                                                        if (res === undefined || !res.ok)
                                                            return toast({
                                                                position: 'bottom-right',
                                                                status: 'error',
                                                                title: 'Error',
                                                                description: 'Error deleting lot',
                                                            });

                                                        if (selected?.id === lot.id)
                                                            setSelected(undefined);

                                                        await fetchEmployees();
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

export default Administration;