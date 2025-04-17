import './App.css'
import {useState} from "react";
import {Navigate, Route, Routes} from "react-router";
import {Layout} from "./Layout.jsx";
import {Auth} from "./Auth.jsx";
import {Tape} from "./Tape.jsx";
import {Preview} from "./Preview.jsx";
import {AddCar} from "./AddCar.jsx";

function App() {
    const [userAuth] = useState(sessionStorage.getItem("userAuth"));

    return (
        <Routes>
            {userAuth ? (
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<Tape/>}/>
                    <Route path="/:item_id" element={<Preview/>}/>
                    <Route path="/add" element={<AddCar/>}/>
                </Route>
            ) : (
                <Route path="/" element={<Layout/>}>
                    <Route path="/" element={<Auth/>}/>
                </Route>
            )}
            <Route path="*" element={<Navigate to={userAuth ? '/' : '/auth'}/>}/>
        </Routes>)
}

export default App
