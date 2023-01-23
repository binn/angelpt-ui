
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
    api: 'https://track.angelcellular.com/api',
    error
};