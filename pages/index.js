import { Box, Center, Heading, useToast, FormControl, Input, Text, Spinner } from "@chakra-ui/react";
import Header from '../comps/header';
import { useEffect, useState } from 'react';
import config from '../comps/config';

function Index() {
    const toast = useToast();
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const loginUser = async (pin) => {
        setLoading(true);
        let res = await fetch(`${config.api}/authorization/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pin }),
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            setPin("");
            setLoading(false);
            return toast(await config.error(res, 'Error logging in.'));
        }

        let result = await res.json().catch(e => { });

        if (result === undefined) {
            setPin("");
            setLoading(false);
            return toast(await config.error(res, 'Error logging in.'));
        }

        result.employee.loggedIn = Date.now();
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.employee));
        window.location.href = '/dashboard';
    }

    return (
        <Box>
            <Header />

            <Center>
                <Box>
                    <Heading mt={100}>Angel Cellular Phone Tracker</Heading>
                    <Center mt={15}><Text><b>PIN</b></Text></Center>
                    <Center>
                        <FormControl w={150} mt={1}>
                            {loading ?
                                <Box display='flex' alignItems='center' justifyContent='center' w='100%' h={55} borderRadius='0.375rem' borderWidth='1px'>
                                    <Spinner opacity='75%' />
                                </Box> :
                                <Input type='password' placeholder={loading ? <Spinner /> : '0123'} disabled={loading} fontSize={32} letterSpacing={10} textAlign='center' h={55} w='100%' value={pin} maxLength={4} onChange={(e) => {
                                    let p = e.currentTarget.value;
                                    if (parseInt(p) === null)
                                        return;

                                    setPin(p);

                                    if (parseInt(p) !== undefined && p.length === 4) {
                                        // login
                                        loginUser(p);
                                    }
                                }} />}
                        </FormControl>
                    </Center>
                </Box>
            </Center>
        </Box>
    );
}

export default Index;