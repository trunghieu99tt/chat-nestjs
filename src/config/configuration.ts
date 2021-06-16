export default () => {
    return ({
        port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    })
};