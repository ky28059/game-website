'use client'

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {revalidateTag} from 'next/cache';
import {getUser} from '../../util/users';


export default function SignupPanel() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(false);

    const {replace, refresh} = useRouter();

    async function register() {
        const res = await fetch('/api/next/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password})
        });
        if (!res.ok) return setError(true);

        replace('/');
        refresh();
    }

    // TODO: very inefficient with get requests; cache fetches on client somehow?
    async function validateUsername() {
        const user = await getUser(username);
        setError(!!user);
    }

    return (
        <main className="bg-content rounded py-10 px-12 w-96 flex flex-col">
            <h1 className="text-4xl font-light mb-6">Register</h1>

            <label htmlFor="username" className="mb-1 text-secondary font-semibold text-sm">
                Username
            </label>
            <input
                required
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={validateUsername}
                className={'px-4 py-2 rounded bg-content-tertiary border border-tertiary mb-4 focus:outline-none focus:ring-[3px] transition duration-100 ' + (error ? 'border-red-500' : 'invalid:border-red-500')}
            />

            <label htmlFor="password" className="mb-1 text-secondary font-semibold text-sm">
                Password
            </label>
            <input
                required
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 rounded bg-content-tertiary border border-tertiary invalid:border-red-500 focus:outline-none focus:ring-[3px] transition duration-100"
            />

            {error && (
                <p className="text-red-500 text-sm mt-4">That username is already taken.</p>
            )}

            <button
                className="rounded bg-blue-500 uppercase px-4 py-2.5 font-medium mt-8 mb-2 disabled:opacity-50 hover:bg-[#56a3eb] disabled:hover:bg-blue-500 transition duration-100"
                disabled={!username || !password}
                onClick={register}
            >
                Register
            </button>
        </main>
    )
}
