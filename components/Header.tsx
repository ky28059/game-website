import {ReactNode} from 'react';
import Link from 'next/link';
import {BsGear, BsGearFill} from 'react-icons/bs';
import {cookies} from 'next/headers';

// Components
import ProfileDropdown from './ProfileDropdown';
import SignInLink from './SignInLink';


export default function Header() {
    const username = cookies().get('username')?.value;

    return (
        <header className="px-8 text-md flex justify-between">
            <nav className="flex gap-2 items-center">
                <Link href="/" className="text-xl pb-0.5 mr-4">[game website]</Link>

                <HeaderLink href="/">Play</HeaderLink>
                <HeaderLink href="/offline">Offline</HeaderLink>
                <HeaderLink href="/rules">Rules</HeaderLink>
            </nav>
            <nav className="flex gap-2 items-center">
                <Link href="/preferences">
                    <BsGearFill className="text-secondary" />
                </Link>
                {username ? (
                    <ProfileDropdown username={username} />
                ) : (
                    <SignInLink />
                )}
            </nav>
        </header>
    )
}

function HeaderLink(props: {href: string, children: ReactNode}) {
    return (
        <Link href={props.href} className="uppercase text-sm text-secondary px-2 py-4 hover:text-[#ccc]">
            {props.children}
        </Link>
    )
}
