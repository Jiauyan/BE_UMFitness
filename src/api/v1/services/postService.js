const {db} = require('../../../configs/firebaseDB');
const { collection, getDocs, addDoc, doc, deleteDoc, setDoc, getDoc, query, where, orderBy } = require("firebase/firestore");
const moment = require('moment');
require('moment-duration-format');

const formatTime = (timestamp) => {
    if (!timestamp) {
        return "Invalid date";
    }

    const now = moment();
    const date = moment(timestamp);
    const duration = moment.duration(now.diff(date));

    if (duration.asSeconds() < 60) {
        return `${Math.floor(duration.asSeconds())} seconds ago`;
    } else if (duration.asMinutes() < 60) {
        return `${Math.floor(duration.asMinutes())} minutes ago`;
    } else if (duration.asHours() < 24) {
        return `${Math.floor(duration.asHours())} hours ago`;
    } else if (now.diff(date, 'days') === 1) {
        return "yesterday"; // If it was one day ago
    } else if (now.diff(date, 'weeks') < 1) {
        return `${Math.floor(duration.asDays())} days ago`; // Less than a week
    } else {
        return date.format('DD MMM YYYY').toUpperCase(); // Older than a week
    }
};

// add post
const addPost = async (postDetails, uid) => {
    try {
        const timestamp = new Date().toISOString();
        const addPost = await addDoc(collection(db, 'Posts'), {
            postDetails,
            uid,
            time: timestamp
        });

        const userSnapshot =  await getDoc(doc(db,'Users', uid));
        const userData = userSnapshot.data();
        const userPhotoUrl = userData ? userData.photoURL : '';
        const userName = userData ? userData.username : '';
        const time = timestamp;

        return { id:addPost.id, uid, postDetails, userPhotoUrl, userName, time, formattedTime: formatTime(timestamp) };
    }catch (err) {
        console.log('Error adding post:', err);
        throw err;
    }
}

// edit post
const updatePost = async (id, uid, postDetails) => {
    try {
        const timestamp = new Date().toISOString();
        const updatePost = await setDoc(doc(db, 'Posts', id), {
            uid,
            postDetails,
            time: timestamp
        })

        const userSnapshot =  await getDoc(doc(db,'Users', uid));
        const userData = userSnapshot.data();
        const userPhotoUrl = userData ? userData.photoURL : '';
        const userName = userData ? userData.username : '';
        const time = timestamp;

        return { id, uid, postDetails, userPhotoUrl, userName, time, formattedTime: formatTime(timestamp) };
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// delete post
const deletePost = async (id) => {
    try {
        const deletePost = await deleteDoc(doc(db, 'Posts', id));
        return id;
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// get post by uid
const getPostByUid = async (uid) => {
    try {
        const postsRef = collection(db, 'Posts');
        const q = query(postsRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        const posts = querySnapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }));

         // Fetch user photos
        const postsWithPhotos = await Promise.all(posts.map(async post => {
            const userSnapshot =  await getDoc(doc(db,'Users', post.uid));
            const userData = userSnapshot.data();
            return {
                ...post,
                userPhotoUrl: userData ? userData.photoURL : '',
                userName : userData ? userData.username : '',
                formattedTime: formatTime(post.time)
            };
        }));
        return postsWithPhotos;
    }catch (err) {
        console.error('Error fetching posts:', err);
        throw err;
    }
}

// get post by id
const getPostById = async (id) => {
    try {
        const postSnap = await getDoc(doc(db,'Posts',id));
        const post = {id: postSnap.id, ...postSnap.data()};
        const userSnapshot =  await getDoc(doc(db,'Users', post.uid));
        const userData = userSnapshot.data();
        return {
            ...post,
            userPhotoUrl: userData ? userData.photoURL : '',
            userName : userData ? userData.username : '',
            formattedTime: formatTime(post.time)
        };
    }catch (err) {
        console.error('Error fetching:', err);
        throw err;
    }
}

// get all post
const getAllPosts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db,'Posts'));
        const posts = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        
        // Fetch user photos
        const postsWithPhotos = await Promise.all(posts.map(async post => {
            const userSnapshot =  await getDoc(doc(db,'Users', post.uid));
            const userData = userSnapshot.data();
            return {
                ...post,
                userPhotoUrl: userData ? userData.photoURL : '',
                userName : userData ? userData.username : '',
                formattedTime: formatTime(post.time)
            };
        }));
      return postsWithPhotos;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    }
}

module.exports = {
    addPost,
    updatePost,
    deletePost,
    getPostByUid,
    getPostById,
    getAllPosts
};

