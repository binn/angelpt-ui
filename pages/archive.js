import { Heading, Box, Center, Spinner, Button, Image, HStack, LinkOverlay, Flex, IconButton, useToast, Text, Checkbox, SimpleGrid, FormControl, FormLabel, Input, VStack, Tooltip } from "@chakra-ui/react"
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
import { FiTrash, FiChevronLeft, FiChevronRight, FiFolderMinus } from 'react-icons/fi';

import config from '../comps/config';
import { useState, useEffect, useRef, useCallback } from 'react';
import AddLotModalButton from "../comps/addLotModal";
import AddNoteModalButton from "../comps/createNoteModal";
import EditTasksModalButton from "../comps/editTasksModal";
import DeletionConfirmationModalButton from "../comps/deletionConfirmationModal";
import ArchiveLotModalButton from "../comps/archiveLotModal";
import { Logo } from "../comps/logo";
import UnarchiveConfirmationModal from "../comps/unarchiveConfirmationModal";
import SelectedArchivedLot from "../comps/selectedArchivedLot";

function ArchivedLots() {
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [lots, setLots] = useState([]);
    const [selected, setSelected] = useState(undefined);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [lastSearch, setLastSearch] = useState(0);
    const [lastSearchChange, setLastSearchChange] = useState(Date.now());
    const [tasks, setTasks] = useState([]);
    const [loadingSelected, setLoadingSelected] = useState(false);

    const toast = useToast();
    const getLastSearchChange = useGetter(lastSearchChange);
    const getQuery = useGetter(query);
    const getPage = useGetter(page);

    useEffect(() => {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");

        if (u === undefined || t === undefined)
            window.location.href = '/';

        setToken(t);
        setUser(JSON.parse(u));

        (async () => {
            await fetchLots(t);
            await fetchDepartments(t);
            await fetchTasks(t);

            setInterval(() => {
                if (Date.now() - getLastSearchChange() < 750 && Date.now() - getLastSearchChange() > 250) {
                    fetchLots(t, getPage(), getQuery());
                }
            }, 500);
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
            return toast(await config.error(res, 'Error fetching lot ' + lot.lotNo));

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

    const fetchLots = async (t, p, q) => {
        let res = await fetch(`${config.api}/lots?archived=true&page=${p ? p : page - 1}${q ? `&lotNo=${q}` : query !== "" ? `&lotNo=${query}` : ''}`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        });

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }

        let result = await res.json();

        setPage(result.currentPage);
        setPages(result.totalPages);
        setLots(result.results);
    }

    const reloadSelected = async (updateLoading) => {
        updateLoading ?? setLoadingSelected(true);

        let res = await fetch(`${config.api}/lots/${selected.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            updateLoading ?? setLoadingSelected(false);

            return toast(await config.error(res, `Error fetching lot ${selected.lotNo}`));
        }

        let result = await res.json();
        setSelected(result);
        updateLoading ?? setLoadingSelected(false);
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
                            <SelectedArchivedLot lot={selected} user={user} token={token} departments={departments} reloadSelected={reloadSelected} toast={toast} />
                            : <>
                                <Center mt='25vh'>
                                    <VStack>
                                        <Image src="https://www.angelcellular.com/uploads/1/2/4/0/124019334/published/new-logo.png?1566586194" />
                                        <Heading pt={20}>Select a lot to get started</Heading>
                                    </VStack>
                                </Center>
                            </>)}

                </Box>

                <Box minW={[600, 700, 800]}>
                    <Flex alignItems='center' w='100%' borderWidth={1} p={15} borderBottomWidth={0} h='10vh'>
                        <Input w='50%' placeholder='Search' value={query} onChange={(e) => {
                            setLastSearchChange(Date.now());
                            setQuery(e.currentTarget.value);
                        }} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (Date.now() - lastSearch < 500)
                                    return;

                                setLastSearch(Date.now());
                                fetchLots();
                            }
                        }} />

                        <Flex alignItems='center' justifyContent='right' w='50%' ml={3}>
                            <Button mr={3} onClick={() => {
                                if (page > 1) {
                                    setPage(page - 1);
                                    fetchLots(undefined, page - 1);
                                }
                            }}><FiChevronLeft /></Button>
                            <Text>Page {page} of {pages}</Text>
                            <Button ml={3} onClick={() => {
                                if (page < pages) {
                                    setPage(page + 1);
                                    fetchLots(undefined, page + 1);
                                }
                            }}><FiChevronRight /></Button>
                        </Flex>
                    </Flex>

                    <TableContainer h={'82vh'} w={'100%'} overflowY='scroll' overflowX='hidden'>
                        <Table borderWidth={1} variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th hidden>id</Th>
                                    <Th>Lot #</Th>
                                    <Th>Model</Th>
                                    <Th>Grade</Th>
                                    <Th>GB</Th>
                                    <Th>Count</Th>
                                    <Th>Created On</Th>
                                    <Th hidden={!user.supervisor}><Center><FiFolderMinus /></Center></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {lots.map(lot => {
                                    return (
                                        <Tr bg={selected?.id === lot.id ? 'rgba(0, 0, 0, 0.1)' : ''} _hover={{ bg: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}>
                                            <Td hidden>{lot.id}</Td>
                                            <Td onClick={() => selectLot(lot)} fontSize={'0.9rem'}>{lot.lotNo}</Td>
                                            <Td w={125} maxW={125} overflowX='hidden' onClick={() => selectLot(lot)}>{lot.model}</Td>
                                            <Td onClick={() => selectLot(lot)}>{(lot.grade === "UNKNOWN" ? "UNK" : lot.grade)}</Td>
                                            <Td onClick={() => selectLot(lot)}>{lot.GB}</Td>
                                            <Td onClick={() => selectLot(lot)}>{lot.count}</Td>
                                            <Td onClick={() => selectLot(lot)}>
                                                {moment(lot.timestamp).format('MM/DD/YYYY')}<br />
                                                {moment(lot.timestamp).format('hh:mm A')}
                                            </Td>
                                            <Td hidden={!user.supervisor}>
                                                <UnarchiveConfirmationModal
                                                    onDelete={async () => {
                                                        let res = await fetch(`${config.api}/lots/${lot.id}/unarchive`, {
                                                            method: 'POST',
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                            }
                                                        }).catch(e => { });

                                                        if (res === undefined || !res.ok)
                                                            return toast(await config.error(res, `Error unarching lot ${lot.lotNo}`));

                                                        if (selected?.id === lot.id)
                                                            setSelected(undefined);

                                                        await fetchLots();
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

function useGetter(value) {
    const ref = useRef(value);
    ref.current = value;
    return useCallback(() => ref.current, []);
}

export default ArchivedLots;