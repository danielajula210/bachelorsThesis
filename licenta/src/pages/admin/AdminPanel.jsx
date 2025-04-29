import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import "./adminpanel.css";

import { RegistrationContext } from "../../context/RegistrationContext";

export default function AdminPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(RegistrationContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/postsRoute/foradmin");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2>Panou de Administrare - Postări</h2>
        <input
          type="text"
          placeholder="Caută postări..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading-spinner">Se încarcă...</div>
      ) : (
        <div className="panel-content">
          <div className="posts-list">
            {filteredPosts.length > 0 ? (
              filteredPosts.slice().reverse().map((post) => (
                <div key={post._id} className="post-card">
                  <div className="post-header">
                    <img 
                      src={post.userProfilePicture || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                      alt={post.username}
                      className="post-avatar"
                    />
                    <div>
                      <span className="post-author">{post.username}</span>
                      <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    {post.desc && <p className="post-text">{post.desc}</p>}
                  </div>
                  <div className="post-actions">
                    <button className="post-action-button">👍 {post.likes?.length || 0} persoane</button>
                    <button className="post-action-button">💬 {post.comments?.length || 0} comentarii</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-posts-card">
                <p>Nu s-au găsit postări</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}