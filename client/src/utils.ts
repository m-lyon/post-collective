
export function getConfig(token: string, params?){
    const config = {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        ...(params && { params }),
    }
    return config
}