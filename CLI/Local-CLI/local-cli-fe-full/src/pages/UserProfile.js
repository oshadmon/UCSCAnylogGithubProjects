import React, { useState, useEffect } from 'react';
import { getUser } from '../services/auth'; // Adjust path as needed

// import '../styles/UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            setUser({ name: "name", email: "email" });
            setLoading(false);
            setError(null);

            try {
                const result = await getUser();
                setUser(result.data.user.user_metadata);
                console.log(result);


            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    //   useEffect(() => {
    //     // Replace with your actual user API endpoint
    //     fetch('/api/user')
    //       .then(res => {
    //         if (!res.ok) throw new Error('Network response was not ok');
    //         return res.json();
    //       })
    //       .then(data => {
    //         setUser(data);
    //         setLoading(false);
    //       })
    //       .catch(err => {
    //         console.error('Error fetching user:', err);
    //         setError('Failed to load user profile.');
    //         setLoading(false);
    //       });
    //   }, []);

    if (loading) {
        return <div className="userprofile-container">Loading...</div>;
    }

    if (error) {
        return <div className="userprofile-container error">{error}</div>;
    }

    return (
        <div className="userprofile-container">
            <div className="profile-card">
                {/* <img
          src={user.avatarUrl || '/assets/default-avatar.png'}
          alt="Profile"
          className="profile-avatar"
        /> */}
                <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
                <p className="profile-email">{user.email}</p>
                {/* Add more fields as needed */}
            </div>
        </div>
    );
};

export default UserProfile;
