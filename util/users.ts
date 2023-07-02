import {User} from '../contexts/ProfileContext';


export async function getUser(username: string): Promise<User | null> {
    const res = await fetch(`${process.env.API_BASE}/api/user/${username}`, {next: {tags: [`user-${username}`]}});
    return res.json();
}