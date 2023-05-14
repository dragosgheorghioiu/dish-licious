import { Card, Text, Button, Row, User, Spacer, Image } from '@nextui-org/react';
import { HeartIcon } from '../assets/HeartIcon';
import { useEffect, useState } from 'react';
import { getDoc, collection, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useContext } from 'react';
import { AuthContext } from '../context';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PostType } from '../interfaces';
import { Link } from 'react-router-dom';

type Props = {
    post: PostType;
};

function SinglePost({ post }: Props) {
    const { user } = useContext(AuthContext);
    const userCollectionRef = collection(db, 'users');
    const postCollectionRef = collection(db, 'posts');
    const [likesLength, setLikesLength] = useState(0);
    const [liked, setLiked] = useState(true);
    const [saved, setSaved] = useState(true);
    const [userName, setUserName] = useState('');
    const [photoUser, setPhotoUser] = useState('');
    const [userID, setUserID] = useState('');

    useEffect(() => {
        const getLikes = async () => {
            const docRef = doc(db, 'posts', post.id);
            getDoc(docRef).then(doc => {
                if (doc.exists()) {
                    setLikesLength(doc.data().likes.length);
                } else {
                    console.log(`User documentnot found`);
                }
            });
        };
        getLikes();
    }, [post.id]);

    useEffect(() => {
        if (!user) {
            return;
        }
        const check = async () => {
            try {
                const docRef = doc(db, 'posts', post.id);
                const docSnap = await getDoc(docRef);
                const liked = docSnap.data()?.likes.includes(user.uid);
                setLiked(liked);
                const userdocRef = doc(db, 'users', user.uid);
                const docUserSnap = await getDoc(userdocRef);
                const saved = docUserSnap.data()?.favourites.includes(post.id);
                setSaved(saved);
                console.log(post.userID);
                const userPostdocRef = doc(db, 'users', post.userID);
                const docUserPostSnap = await getDoc(userPostdocRef);
                const userName = docUserPostSnap.data()?.username;
                const photoUser = docUserPostSnap.data()?.photoURL;
                const userID = docUserPostSnap.data()?.id;
                setPhotoUser(photoUser);
                setUserName(userName);
                setUserID(userID);
            } catch (error) {
                console.log(error);
            }
        };
        check();
    }, [user, post.id]);

    const addToFav = async () => {
        if (user) {
            const userDocRef = doc(userCollectionRef, user.uid);
            try {
                await updateDoc(userDocRef, {
                    favourites: arrayUnion(post.id),
                });
                setSaved(true);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const removeFromFav = async () => {
        if (user) {
            const userDocRef = doc(userCollectionRef, user.uid);
            try {
                await updateDoc(userDocRef, {
                    favourites: arrayRemove(post.id),
                });
                setSaved(false);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const like = async () => {
        try {
            if (user !== null) {
                const postDocRef = doc(postCollectionRef, post.id);
                await updateDoc(postDocRef, {
                    likes: arrayUnion(user.uid),
                });
                setLiked(true);
                setLikesLength(likesLength + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const unlike = async () => {
        try {
            if (user !== null) {
                const postDocRef = doc(db, 'posts', post.id);
                await updateDoc(postDocRef, {
                    likes: arrayRemove(user.uid),
                });
                setLiked(false);
                setLikesLength(likesLength - 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card isHoverable variant="bordered" css={{ mw: '400px' }}>
            <Card.Header>
                <Text b css={{ whiteSpace: 'nowrap' }}>
                    {post.title}
                </Text>
                <Row justify="flex-end">
                    <Link to={`/user-profile?userId=${userID}`}>
                        <User css={{ cursor: 'pointer' }} src={photoUser} name={userName} />
                    </Link>
                </Row>
            </Card.Header>
            <Card.Divider />
            <Link to={`/post?postId=${post.id}`}>
                <Card.Body isPressable css={{ py: '$10' }}>
                    <Image
                        width={400}
                        height={170}
                        containerCss={{ borderRadius: '3%' }}
                        src={post.photoURL}
                        alt="Default Image"
                        objectFit="cover"
                    />
                    <Spacer y={0.2} />
                    <Row>
                        <Text color="#ec9127" css={{ marginLeft: '$1' }}>
                            {' '}
                            Liked by {likesLength}{' '}
                        </Text>
                    </Row>
                    <Spacer y={0.3} />
                    <Row>
                        <Text
                            css={{
                                height: '5em',
                                marginLeft: '$1',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                            }}
                        >
                            Mod de preparare: {post.description}
                        </Text>
                    </Row>
                    <Row>
                        <Text>
                            {' '}
                            Time Cost: {post.timeCost} {post.timeUnit}
                        </Text>
                    </Row>
                </Card.Body>
            </Link>
            <Card.Divider />

            <Card.Footer>
                <Row justify="flex-start">
                    {!liked ? (
                        <Button
                            auto
                            color="error"
                            css={{ mr: '$2' }}
                            onPress={() => like()}
                            icon={<HeartIcon fill="currentColor" filled />}
                        />
                    ) : (
                        <Button
                            auto
                            css={{ mr: '$2', backgroundColor: 'transparent', border: 'none' }}
                            onPress={() => unlike()}
                            icon={<HeartIcon filled fill="#F31260" />}
                        />
                    )}
                    {!saved ? (
                        <Button color="error" css={{ width: '75px' }} auto onPress={() => addToFav()}>
                            Save
                        </Button>
                    ) : (
                        <Button flat color="error" css={{ width: '75px' }} auto onPress={() => removeFromFav()}>
                            Saved
                        </Button>
                    )}
                </Row>
                <Row justify="flex-end">
                    <Button.Group>
                        <Button css={{ mr: '$2' }}> + </Button>
                        <Button>View comment list</Button>
                    </Button.Group>
                </Row>
            </Card.Footer>
        </Card>
    );
}
export default SinglePost;
