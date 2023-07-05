'use client'

import {MouseEventHandler, ReactNode} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Menu} from '@headlessui/react';


export default function ProfileDropdown(props: {username: string}) {
    const {refresh} = useRouter();

    async function signOut() {
        await fetch('/api/next/logout', {
            method: 'POST',
            credentials: 'include'
        });
        refresh();
    }

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="text-secondary px-3 py-4 ui-open:bg-content-secondary hover:text-[#ccc]">
                {props.username}
            </Menu.Button>
            <Menu.Items className="absolute right-0 bg-content-secondary py-1.5 rounded-l rounded-br w-48 shadow-xl z-10">
                <Link href={`/profile/${props.username}`}>
                    <ProfileDropdownItem>Profile</ProfileDropdownItem>
                </Link>
                <ProfileDropdownItem onClick={signOut}>Sign out</ProfileDropdownItem>
            </Menu.Items>
        </Menu>
    )
}

function ProfileDropdownItem(props: {children: ReactNode, onClick?: MouseEventHandler<HTMLDivElement>}) {
    return (
        <Menu.Item as="div" className="px-4 py-1 cursor-pointer hover:bg-theme-green" onClick={props.onClick}>
            {props.children}
        </Menu.Item>
    )
}
