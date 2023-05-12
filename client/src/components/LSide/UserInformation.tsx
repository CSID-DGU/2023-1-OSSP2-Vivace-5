import React from "react";

type UserInformationProps = {
    profileImage: string;
    username: string;
    email: string;
};

const UserInformation: React.FC<UserInformationProps> = ({ profileImage, username, email }) => {
    return (
        <div className="user-information">
            <img className="user-profile-image" src={profileImage} alt="Profile" />
            <div className="user-details">
                <div className="user-name">{username}</div>
                <div className="user-email">{email}</div>
            </div>
        </div>
    );
};

export default UserInformation;
