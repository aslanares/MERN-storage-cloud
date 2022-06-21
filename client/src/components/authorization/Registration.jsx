import React, {useState} from 'react';
import './authorization.css'
import Input from "../../utils/input/Input";
import {registration} from "../../actions/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Registration = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className='authorization'>
            <div className="authorization__header">Registration</div>
            <Input value={username} setValue={setUsername} type="text" placeholder="Enter your name"/>
            <Input value={email} setValue={setEmail} type="text" placeholder="Enter your E-mail..."/>
            <Input value={password} setValue={setPassword} type="password" placeholder="Enter your password..."/>
            <button
              className="authorization__btn"
              onClick={() => registration(username, email, password)}>
              <FontAwesomeIcon icon={faUserPlus}/>Sign up
            </button>
        </div>
    );
};

export default Registration;
