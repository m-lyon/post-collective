export const UPDATE_FORM = 'UPDATE_FORM'

export function onInputChange(name: string, value: any, dispatch, formState) {
    const [hasError, error, isFormValid] = runValidation(name, value, formState)

    dispatch({
        type: UPDATE_FORM,
        data: { name, value, hasError, error, touched: false, isFormValid },
    })
}

export function onFocusOut(name: string, value: any, dispatch, formState) {
    const [hasError, error, isFormValid] = runValidation(name, value, formState)

    dispatch({
        type: UPDATE_FORM,
        data: { name, value, hasError, error, touched: true, isFormValid },
    })
}

function runValidation(name: string, value: any, formState) {
    const { hasError, error } = validateInput(name, value)
    let isFormValid = true
    for (const key in formState) {
        const item = formState[key]
        if (key === name && hasError) {
            isFormValid = false
            break
        } else if (key !== name && item.hasError) {
            isFormValid = false
            break
        }
    }
    return [hasError, error, isFormValid]
}

export function runFormStateValidation(formState, dispatch){
    let isFormValid = true;
    for (const name in formState) {
        const { value } = formState[name];
        const { hasError, error } = validateInput(name, value);
        if (hasError) {
            isFormValid = false;
        }
        dispatch({
            type: UPDATE_FORM,
            data: {
                name,
                value,
                hasError,
                error,
                touched: true,
                isFormValid,
            },
        });
    }
}

export function validateInput(name: string, value: any) {
    let hasError = false
    let error = ''
    switch (name) {
        case 'name':
            if (value.trim() === '') {
                hasError = true
                error = 'Name cannot be empty'
            } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/.test(value)) {
                hasError = true
                error = 'Invalid name.'
            } else {
                hasError = false
                error = ''
            }
            break
        case 'aptNum':
            if (value.trim() === '') {
                hasError = true
                error = 'Apartment number cannot be empty'
            } else if (!/^\d+$/.test(value)) {
                hasError = true
                error = 'Must be a number.'
            } else {
                hasError = false
                error = ''
            }
            break
        case 'email':
            if (value.trim() === '') {
                hasError = true
                error = 'Email cannot be empty'
            } else if (
                !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
                    value
                )
            ) {
                hasError = true
                error = 'Invalid email'
            } else {
                hasError = false
                error = ''
            }
            break
        case 'password':
            if (value.trim() === '') {
                hasError = true
                error = 'Password cannot be empty'
            } else if (value.trim().length < 6) {
                hasError = true
                error = 'Password must have at least 6 characters'
            } else {
                hasError = false
                error = ''
            }
            break
        default:
            break
    }
    return { hasError, error }
}