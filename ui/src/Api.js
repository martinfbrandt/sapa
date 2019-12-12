import {assoc, propOr} from 'ramda';

// checks for error on api call and returns it to be displayed
const throwError = async response => {
    if(unauthorizedClearSession(response)){
        throw Error('Expired Token')
    }
    if(response.status !== 200){
        const errBody = await response.json();
        throw Error(errBody.error)
    }
}


const unauthorizedClearSession = response => {
    if(response.status === 401){
        sessionStorage.clear();
        return true;
    }
    return false;
}
export const signUpUser = async user => {
    try {
        const created = await fetch('http://localhost:3000/api/signup', {
            method:'POST',
            mode: 'cors',
            cache: "no-cache",
            url: 'http://localhost:3000',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(assoc('roles', ['user'], user))
        })

        if(created.status === 409){
            throw Error(`User with email address ${user.email} exists`)
        } 

        await throwError(created)
        return created.json();
        
    } catch(err) {
        throw err;
    }
}

export const loadUser = async userId => {
    const jwt = propOr(null, 'jwt', JSON.parse(sessionStorage.getItem('user')))
    if(jwt === null){
        throw Error('Expired Token')
    }
    try {
        const fetchedUser = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method:'GET',
            mode: 'cors',
            cache: "no-cache",
            url: 'http://localhost:3000',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt
            },
        })
        await throwError(fetchedUser)
        return fetchedUser.json();
    } catch(err) {
        throw err;
    }
}


export const logInUser = async user => {
    try {
        const loggedInUser = await  fetch('http://localhost:3000/api/login', {
            method:'POST',
            mode: 'cors',
            cache: "no-cache",
            url: 'http://localhost:3000',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        });
        await throwError(loggedInUser)
        return loggedInUser.json();
    } catch(err) {
        throw err;
    }
}


export const loadUserExperiences = async () => {
    const jwt = propOr(null, 'jwt', JSON.parse(sessionStorage.getItem('user')))
    if(jwt === null){
        throw Error('Expired Token')
    }

    try {
        const experienceResponse = await fetch('http://localhost:3000/api/experiences', {
            method:'GET',
            mode: 'cors',
            cache: "no-cache",
            url: 'http://localhost:3000',
            headers: {
                "Content-Type": "application/json",
                "Authorization":jwt
            },
        })
 
        await throwError(experienceResponse)
        return experienceResponse.json();
    } catch(err) {
        throw err;
    }
}

export const saveNewExperience = async experience => {
    const jwt = propOr(null, 'jwt', JSON.parse(sessionStorage.getItem('user')))
    if(jwt == null){
        throw Error('Expired Token')
    }
    try {
        const newExperience = await fetch('http://localhost:3000/api/experiences', {
            method:'POST',
            mode: 'cors',
            cache: "no-cache",
            url: 'http://localhost:3000',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt 
            },
            body: JSON.stringify(experience)
        })
        await throwError(newExperience)
        return newExperience.json();
    } catch(err) {
        throw err;
    }
}

    export const updateExperience = async (experienceId, experience) => {
        const jwt = propOr(null, 'jwt', JSON.parse(sessionStorage.getItem('user')))
        if(jwt === null){
            throw Error('Expired Token')
        }

        try {
            const updatedExperience = await fetch(`http://localhost:3000/api/experiences/${experienceId}`, {
                method:'PATCH',
                mode: 'cors',
                cache: "no-cache",
                url: 'http://localhost:3000',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                },
                body: JSON.stringify(experience)
            })
            await throwError(updatedExperience)
            return updatedExperience.json();
        } catch(err) {
            throw err;
        }
    }

    export const deleteExperience = async experienceId => {
        const jwt = propOr(null, 'jwt', JSON.parse(sessionStorage.getItem('user')))
        if(jwt == null){
            throw Error('Expired Token')
        }

        try {
            const response = await fetch(`http://localhost:3000/api/experiences/${experienceId}`, {
                method:'DELETE',
                mode: 'cors',
                cache: "no-cache",
                url: 'http://localhost:3000',
                headers: {
                    "Authorization": jwt
                },
            })
            await throwError(response)
        } catch(err) {
            throw err;
        }
    }

        export const updateUser = async (userId, user) => {
            const jwt = propOr(null, 'jwt', JSON.parse(sessionStorage.getItem('user')))
            if(jwt == null){
                throw Error('Expired Token')
            }
            try {
                const updatedUser =  await fetch(`http://localhost:3000/api/users/${userId}`, {
                    method:'PATCH',
                    mode: 'cors',
                    cache: "no-cache",
                    url: 'http://localhost:3000',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jwt
                    },
                    body: JSON.stringify(user)
                });
                await throwError(updatedUser)
                return updatedUser.json();
            } catch(err) {
                throw err;
            }
}