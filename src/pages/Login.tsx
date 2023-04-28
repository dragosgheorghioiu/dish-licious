import { Spacer, Button, Text } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { useNavigate, Link, redirect } from 'react-router-dom';
import { isSignInWithEmailLink, signInWithEmailLink, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { EmailInput, PasswordInput, AuthCard } from '../components';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, userLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && user) {
            navigate('/');
        }
    }, [userLoading, user]);

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href) && auth.currentUser?.emailVerified) {
            const email = window.localStorage.getItem('emailForSignIn');
            signInWithEmailLink(auth, email as string, window.location.href)
                .then(() => {
                    window.localStorage.removeItem('emailForSignIn');
                })
                .catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(errorCode);
                    console.log(errorMessage);
                });
        }
    }, []);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                redirect('/');
                // if (auth.currentUser?.emailVerified) {
                //     setLoggedIn(true);
                // }
                // auth.updateCurrentUser(null);
                // sendSignInLinkToEmail(auth, email, actionCodeSettings)
                //   .then(() => {
                //     window.localStorage.setItem("emailForSignIn", email);
                //     console.log(window.localStorage.emailForSignIn);
                //   })
                //   .catch((error) => {
                //     console.log(error)
                //   });
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <AuthCard>
            <EmailInput email={email} setEmail={setEmail} />
            <Spacer y={1} />
            <PasswordInput password={password} setPassword={setPassword} />
            <Spacer y={1} />
            <Button onClick={handleLogin}>Login</Button>
            <Text>
                You don't have an account? <Link to="/register">Register</Link>
            </Text>
        </AuthCard>
    );
};

export default Login;
