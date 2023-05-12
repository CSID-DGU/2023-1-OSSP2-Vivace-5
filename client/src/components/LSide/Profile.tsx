import React from "react";
import "./Profile.css";

type ProfileProps = {
    imageUrl: string;
    name: string;
    email: string;
};

const Profile: React.FC<ProfileProps> = ({ imageUrl, name, email }) => {
    return (
        <div className="profile">
            <img src={imageUrl} alt="Profile" />
            <h2>{name}</h2>
            <p>{email}</p>
        </div>
    );
};

export default Profile;
