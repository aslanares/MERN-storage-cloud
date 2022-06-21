import React, {useState} from 'react';
import './authorization.css'
import Input from "../../utils/input/Input";
import {useDispatch} from "react-redux";
import {login} from "../../actions/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()

    return (
        <div className='authorization'>
            <div className="authorization__header">Authorization</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Enter your E-mail..."/>
            <Input value={password} setValue={setPassword} type="password" placeholder="Enter your password..."/>
            <button className="authorization__btn" onClick={() => dispatch(login(email, password))}><FontAwesomeIcon icon={faSignIn}/>Sign in</button>
        </div>
    );
};

export default Login;
