
export const Const = {
    apiurl : "http://localhost:3000/api"
};

export async function fetchUser() {
    const response = await fetch(`${Const.apiurl}/user`, {
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
    });
    return await response.json();
}

export async function fetchUserManaged() {
    const response = await fetch(`${Const.apiurl}/userManager/vip`, {
        method: 'GET',
        headers: {
            Authorization: localStorage.token
        },
    });
    return await response.json();
}
