import React, { useState } from "react";

type AddProjectProps = {
    onAddProject: (title: string, description: string) => void;
};

const AddProject: React.FC<AddProjectProps> = ({ onAddProject }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onAddProject(title, description);
        setTitle("");
        setDescription("");
    };

    return (
        <div className="add-project">
            <h2>Add Project</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                />
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
};

export default AddProject;
