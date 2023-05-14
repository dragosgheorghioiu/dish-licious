import { Navbar, Link, Text, Avatar, Dropdown, Image } from '@nextui-org/react';
import { styled } from '@nextui-org/react';
import { useContext } from 'react';
import Logo from '../assets/icon.png';
import { UserDataContext } from '../context';
import { redirect, useNavigate } from 'react-router-dom';
import { auth } from '../config';
import { useLocation } from 'react-router-dom';
import { SearchNavbarItem } from '.';
import { Notifications } from '.';

export const Box = styled('div', {
    boxSizing: 'border-box',
});

function NavbarF() {
    const location = useLocation();
    const { userData } = useContext(UserDataContext);

    const navigate = useNavigate();
    const collapseItems = ['Add Post', 'Feed', 'Favorites', 'Notifications', 'Search'];

    const handleLogOut = async () => {
        try {
            await auth.signOut();
            await auth.updateCurrentUser(null);
            redirect('/login');
        } catch (error) {
            alert(error);
        }
    };

    const handleAction = (actionKey: string) => {
        if (actionKey === 'logout') {
            handleLogOut();
        } else {
            navigate(`/${actionKey}`);
        }
    };

    return (
        <Navbar variant="sticky">
            <Navbar.Toggle showIn="xs" />
            <Navbar.Brand
                css={{
                    '@xs': {
                        w: '12%',
                    },
                }}
            >
                <Image src={Logo} height={70} />
                <Text b hideIn="xs">
                    Dish-licious
                </Text>
            </Navbar.Brand>
            <Navbar.Content activeColor="secondary" hideIn="xs">
                <Navbar.Link isActive={location.pathname === '/'} href="/">
                    Feed
                </Navbar.Link>
                <Navbar.Link isActive={location.pathname === '/add-post'} href="/add-post">
                    Add post
                </Navbar.Link>
                <Navbar.Link isActive={location.pathname === '/favourites'} href="/favourites">
                    Favourites
                </Navbar.Link>
                <SearchNavbarItem />
                <Notifications />
            </Navbar.Content>
            <Navbar.Content
                css={{
                    '@xs': {
                        w: '12%',
                        jc: 'flex-end',
                    },
                }}
            >
                <Dropdown placement="bottom-right">
                    <Navbar.Item>
                        <Dropdown.Trigger>
                            <Avatar bordered as="button" color="secondary" size="md" src={userData?.photoURL} />
                        </Dropdown.Trigger>
                    </Navbar.Item>
                    <Dropdown.Menu
                        aria-label="User menu actions"
                        onAction={actionKey => handleAction(actionKey as string)}
                        disabledKeys={['username']}
                    >
                        <Dropdown.Item key="username" css={{ height: '$18' }} textValue="username">
                            <Text b color="#ec9127" css={{ d: 'flex' }}>
                                Signed in as {userData?.username}
                            </Text>
                        </Dropdown.Item>
                        <Dropdown.Item key="profile" withDivider textValue=" My Profile">
                            My Profile
                        </Dropdown.Item>
                        <Dropdown.Item key="groups" withDivider>
                            Groups
                        </Dropdown.Item>
                        <Dropdown.Item key="settings" withDivider textValue="Settings">
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Item key="logout" withDivider color="error" textValue="LogOut">
                            Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar.Content>
            <Navbar.Collapse>
                {collapseItems.map((item, index) => (
                    <Navbar.CollapseItem
                        key={item}
                        activeColor="#fedebe"
                        css={{
                            color: index === collapseItems.length - 1 ? '$error' : '',
                        }}
                        isActive={index === 2}
                    >
                        <Link
                            color="secondary"
                            css={{
                                minWidth: '100%',
                            }}
                            href="#"
                        >
                            {item}
                        </Link>
                    </Navbar.CollapseItem>
                ))}
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarF;
