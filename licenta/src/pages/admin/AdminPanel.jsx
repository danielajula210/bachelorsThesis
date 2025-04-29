import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../../components/post/Post'; 
import "./adminpanel.css";

export default function AdminPanel() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/postsRoute/foradmin');
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Nu s-au putut încărca postările.');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Se încarcă postările...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="adminPanel">
            <h1>Postări Admin</h1>
            <div className="postsContainer">
                {posts.length > 0 ? (
                    posts.map(post => <Post key={post._id} post={post} />)
                ) : (
                    <p>Nu sunt postări disponibile.</p>
                )}
            </div>
        </div>
    );
}
