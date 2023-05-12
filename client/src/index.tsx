import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Sidebar from "../src/components/LSide/Sidebar";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
);

const MainApp: React.FC = () => {
    return (
        <div className="App">
            <Sidebar>
                <p>This is the main content of the app.</p>
            </Sidebar>
        </div>
    );
};

export default App;
