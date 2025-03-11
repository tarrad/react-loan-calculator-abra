export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL,
    ENDPOINTS: {
        LOAN: {
            SUBMIT: '/Loan'
        }
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
}; 