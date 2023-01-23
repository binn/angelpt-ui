
async function error(res, title, defaultError = 'Unknown reason.') {
    let reason = defaultError;
    if(res != undefined) {
        let data = await res.json();
        reason = data?.error ?? defaultError; 
    }

    return {
        position: 'bottom-left',
        status: 'error',
        title,
        description: reason
    };
}

export default {
    api: process.env.NODE_ENV === "production" ? 'https://localhost:7236' : 'https://track.angelcellular.com/api',
    error
};