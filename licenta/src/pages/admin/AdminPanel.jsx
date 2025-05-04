import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./adminpanel.css";

import Post from '../../components/post/Post'; 
import { Logout } from "../../context/RegistrationAction";
import {RegistrationContext} from "../../context/RegistrationContext";

export default function AdminPanel() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { dispatch } = useContext(RegistrationContext);

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

    const handleLogout = (e) => {
        e?.preventDefault?.();
        dispatch(Logout()); 
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return <div>Se încarcă postările...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="adminPanel">
            <div className="adminHeader">
                <h1 className="adminTitle">Panou administrativ</h1>
                <button className="logoutButton" onClick={handleLogout}>
                    Deconectare
                </button>
            </div>
            <div className="postsContainer">
                {posts.length > 0 ? (
                    [...posts].reverse().map(post => <Post key={post._id} post={post} />)
                ) : (
                    <p>Nu sunt postări disponibile.</p>
                )}
            </div>
        </div>
    );
}
