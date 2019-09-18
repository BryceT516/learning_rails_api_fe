import React from 'react';

const LoginForm = ({login = f => f}) => {
    let email, password
    const submit = e => {
        e.preventDefault()

        login(email.value, password.value, password.value)

        email.focus()
    }
    
    return (
        <form onSubmit={submit}>
            <input ref={input => email = input}
                type="text"
                placeholder="Email..." required />
            <input ref={input => password = input}
                type="text"
                placeholder="Password..." required />
            <button>Log in</button>
        </form>
    )
}

export default LoginForm;