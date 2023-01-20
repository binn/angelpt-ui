import Header from '../comps/header';
import { Box, Center, Heading, HStack, Spinner, StackDivider, useToast, IconButton, Flex, Button, Text } from '@chakra-ui/react';
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
import { useState, useEffect } from 'react';
import { FiTrash } from 'react-icons/fi';
import config from '../comps/config';
import CreateEmployeeModalButton from '../comps/createEmployeeModal';
import CreateDepartmentModalButton from '../comps/createDepartmentModal';
import CreateTaskTemplateModalButton from '../comps/createTaskTemplateModal';
import DeletionConfirmationModalButton from '../comps/deletionConfirmationModal';
import EditEmployeeModalButton from '../comps/editEmployeeModal';

function AdministrationDashboard() {
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [selectedDepartment, setSelectedDepartment] = useState();
    const [selectedTask, setSelectedTask] = useState();
    const [selectedEmployee, setSelectedEmployee] = useState();
    const toast = useToast();

    const fetchTasks = async (t) => {
        let res = await fetch(`${config.api}/tasks/templates`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            toast(await config.error(res, 'Error fetching task templates'));
            return false;
        }

        let result = await res.json().catch(e => { });
        if (result === undefined)
            return false;

        setTasks(result);
        return result;
    }

    const fetchDepartments = async (t) => {
        let res = await fetch(`${config.api}/admin/departments`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            toast(await config.error(res, 'Error fetching departments'));
            return false;
        }

        let result = await res.json().catch(e => { });
        if (result === undefined)
            return false;

        setDepartments(result);
        return result;
    }

    const fetchEmployees = async (t) => {
        let res = await fetch(`${config.api}/admin/employees`, {
            headers: {
                Authorization: `Bearer ${token ? token : t}`,
            },
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            toast(await config.error(res, 'Error fetching employees'));
            return false;
        }

        let result = await res.json().catch(e => { });
        if (result === undefined)
            return false;

        setEmployees(result);
        return result;
    }

    useEffect(() => {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");

        if (u === undefined || t === undefined || JSON.parse(u).admin !== true)
            window.location.href = '/';

        setToken(t);
        setUser(JSON.parse(u));

        (async () => {
            let tsks = await fetchTasks(t);
            let dpts = await fetchDepartments(t);
            let empl = await fetchEmployees(t);

            if (tsks === false || dpts === false || empl === false)
                return;

            setLoading(false);
        })();
    }, []);

    if (loading)
        return (
            <Box>
                <Header />
                <Center>
                    <Spinner mt={100} />
                </Center>
            </Box>
        );

    return (
        <Box>
            <Header />
            <Box p={25} w='100%' h={600}>
                <Flex id='employees' alignItems='center'>
                    <Heading>Employees</Heading>
                    <CreateEmployeeModalButton departments={departments} disabled={false} reloadSelected={fetchEmployees} token={token} />
                    <EditEmployeeModalButton departments={departments} disabled={selectedEmployee !== undefined ? false : true} reloadSelected={fetchEmployees} token={token} selected={selectedEmployee ? employees.filter(x => x.id === selectedEmployee)[0] : undefined} />
                </Flex>

                <TableContainer p={25} maxH={540} w={'100%'} overflowY='scroll' overflowX='hidden'>
                    <Table borderWidth={1} variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Department</Th>
                                <Th>Is Administrator?</Th>
                                <Th>Is Supervisor?</Th>
                                <Th>PIN</Th>    
                                <Th>Created On</Th>
                                <Th><FiTrash /></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {employees.sort((a, b) => a.id - b.id).map(employee => {
                                return (
                                    <Tr onClick={() => selectedEmployee === employee.id ? setSelectedEmployee(undefined) : setSelectedEmployee(employee.id)} bg={selectedEmployee === employee.id ? 'rgba(0, 0, 0, 0.1)' : ''} _hover={{ bg: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}>
                                        <Td>{employee.id}</Td>
                                        <Td>{employee.firstName} {employee.lastName}</Td>
                                        <Td>{employee.department.name}</Td>
                                        <Td>{employee.admin ? 'Yes' : 'No'}</Td>
                                        <Td>{employee.supervisor ? 'Yes' : 'No'}</Td>
                                        <Td>{employee.pin}</Td>
                                        <Td>{new Date(employee.timestamp).toLocaleString()}</Td>

                                        <Td>
                                            <DeletionConfirmationModalButton
                                                onDelete={async () => {
                                                    let res = await fetch(`${config.api}/admin/employees/${employee.id}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        }
                                                    }).catch(e => { });

                                                    if (res === undefined || !res.ok)
                                                        return toast(await config.error(res, `Error deleting employee ${employee.firstName} ${employee.lastName}`));

                                                    if (selectedEmployee === employee.id)
                                                        setSelectedEmployee(undefined);

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
            <HStack maxW='100vw' p={25} spacing={5}>
                <Box id='departments' w='100%' h='100%'>
                    <Flex alignItems='center'>
                        <Heading>Departments</Heading>
                        <CreateDepartmentModalButton disabled={false} reloadSelected={fetchDepartments} token={token} />
                    </Flex>

                    <TableContainer p={25} maxH={440} w={'100%'} overflowY='scroll' overflowX='hidden'>
                        <Table borderWidth={1} variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Employees</Th>
                                    <Th>Description</Th>
                                    <Th><FiTrash /></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {departments.sort((a, b) => a.id - b.id).map(department => {
                                    return (
                                        <Tr onClick={() => selectedDepartment === department.id ? setSelectedDepartment(undefined) : setSelectedDepartment(department.id)} bg={selectedDepartment === department.id ? 'rgba(0, 0, 0, 0.1)' : ''} _hover={{ bg: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}>
                                            <Td>{department.default ? <b>{department.name}</b> : department.name}</Td>
                                            <Td>{department.employees.length}</Td>
                                            <Td maxW={700} overflowX='hidden'>{department.description}</Td>

                                            <Td>
                                                <DeletionConfirmationModalButton onDelete={async () => {
                                                    let res = await fetch(`${config.api}/admin/departments/${department.id}`, {
                                                        method: 'DELETE',
                                                        headers: {
                                                            Authorization: `Bearer ${token}`,
                                                        }
                                                    }).catch(e => { });

                                                    if (res === undefined || !res.ok)
                                                        return toast(await config.error(res, `Error deleting department ${department.name}`));

                                                    if (selectedDepartment === department.id)
                                                        setSelectedDepartment(undefined);

                                                    await fetchDepartments();
                                                }} />
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>

                <StackDivider />

                <Box w='100%' id='task-templates' h='100%'>
                    <Flex alignItems='center'>
                        <Heading>Task Templates</Heading>
                        <CreateTaskTemplateModalButton token={token} reloadSelected={fetchTasks} disabled={false} />
                    </Flex>

                    <TableContainer p={25} maxH={440} w={'100%'} overflowY='scroll' overflowX='hidden'>
                        <Table borderWidth={1} variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>ID</Th>
                                    <Th>Template</Th>
                                    <Th>Category</Th>
                                    <Th><FiTrash /></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {tasks.sort((a, b) => a.id - b.id).map(task => {
                                    return (
                                        <Tr onClick={() => selectedTask === task.id ? setSelectedTask(undefined) : setSelectedTask(task.id)} bg={selectedTask === task.id ? 'rgba(0, 0, 0, 0.1)' : ''} _hover={{ bg: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}>
                                            <Td>{task.id}</Td>
                                            <Td maxW={550} overflowX='hidden'>{task.template}</Td>
                                            <Td>{task.category}</Td>

                                            <Td>
                                                <DeletionConfirmationModalButton
                                                    onDelete={async () => {
                                                        let res = await fetch(`${config.api}/tasks/templates/${task.id}`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                            }
                                                        }).catch(e => { });

                                                        if (res === undefined || !res.ok)
                                                            return toast(await config.error(res, `Error deleting task template ${task.template}`));

                                                        if (selectedTask === task.id)
                                                            setSelectedTask(undefined);

                                                        await fetchTasks();
                                                    }}
                                                />
                                            </Td>
                                        </Tr>
                                    )
                                })}

                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </HStack>
        </Box>
    );
}

export default AdministrationDashboard;