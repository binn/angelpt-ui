import { Box, Center, Heading, useToast, FormControl, Input, FormLabel } from "@chakra-ui/react";
import Header from '../comps/header';
import { useEffect, useState } from 'react';
import config from '../comps/config';

function Index() {
    const toast = useToast();
    const [pin, setPin] = useState("");

    useEffect(() => {
        if (localStorage === undefined)
            return;

        let token = localStorage.getItem("token");
        if (token !== undefined) {
            // redirect 
        }
    });

    const loginUser = async (pin) => {
        console.log(config.api);
        let res = await fetch(`${config.api}/authorization/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pin }),
        }).catch(e => { });

        if (res === undefined || !res.ok) {
            setPin("");
            return toast({
                status: 'error',
                position: 'bottom-right',
                title: 'Error',
                description: 'error'
            });
        }

        let result = await res.json().catch(e => { });

        if (result === undefined) {
            setPin("");
            return toast({
                status: 'error',
                position: 'bottom-right',
                title: 'Error',
                description: 'error'
            });
        }

        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.employee));
        window.location.href = '/dashboard';
    }

    return (
        <Box>
            <Header />

            <Center>
                <Box>
                    <Heading>Angel Cellular Phone Tracker</Heading>
                    <Center>
                        <FormControl w={150} mt={30}>
                            <FormLabel textAlign='center'>PIN</FormLabel>
                            <Input placeholder='0123' fontSize={32} letterSpacing={10} textAlign='center' h={55} w='100%' value={pin} maxLength={4} onChange={(e) => {
                                let p = e.currentTarget.value;
                                if (parseInt(p) === null)
                                    return;

                                setPin(p);

                                if (parseInt(p) !== undefined && p.length === 4) {
                                    // login
                                    loginUser(p);
                                }
                            }} />
                        </FormControl>
                    </Center>
                </Box>
            </Center>
        </Box>
    );
}

export default Index;