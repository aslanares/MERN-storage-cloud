import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteAvatar, changeUsername, uploadAvatar, changeEmail, changePass} from "../../actions/user";
import './profile.css'
import Input from "../../utils/input/Input";
import {API_URL} from "../../config";
import avatarLogo from '../../assets/img/avatar.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faExchange} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.user.currentUser)
  const currentUsername = useSelector(state => state.user.currentUsername)
  const currentEmail = useSelector(state => state.user.currentEmail)
  const [username, setUsername] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [oldPass, setOldPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmNewPass, setConfirmNewPass] = useState("")
  const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo

  function changeHandler(e) {
    const file = e.target.files[0]
    dispatch(uploadAvatar(file))
  }

  const changeUsernameByPress = () => dispatch(changeUsername(username))
  const changeEmailByPress = () => dispatch(changeEmail(userEmail))

  return (
    <div className="profile">
      <div className="profile__edit">
        <h3>Profile changes</h3>
        <p>If you want to change your profile information, fill in the following fields:</p>
        <input
          type="text"
          placeholder="Your full name (press to submit)"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && changeUsernameByPress()}
        />
        <input
          type="email"
          placeholder="Your E-mail (press to submit)"
          value={userEmail}
          onChange={e => setUserEmail(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && changeEmailByPress()}
        />
        <div className="profile__avatar">
          <button
            className="profile__avatar__delete"
            onClick={() => dispatch(deleteAvatar())}>Delete avatar
          </button>
          <input
            className="profile__avatar__file"
            accept="image/*" onChange={e => changeHandler(e)}
            type="file" placeholder="Upload avatar"
          />
        </div>
        <h3>Password changes</h3>
        <p>If you want to change your account password, fill in the following fields:</p>
        <Input value={oldPass} setValue={setOldPass} type="password" placeholder="Enter your current password..."/>
        <Input value={newPass} setValue={setNewPass} type="password" placeholder="Enter a new password..."/>
        <Input value={confirmNewPass} setValue={setConfirmNewPass} type="password" placeholder="Enter the password again..."/>
        <button
          className="authorization__btn"
          onClick={() => dispatch(changePass(currentUser.email, oldPass, newPass, confirmNewPass))}>
          <FontAwesomeIcon icon={faExchange}/>Change password
        </button>
      </div>
      <div className="profile__info">
        <h3>Profile information</h3>
        <p>Your current avatar:</p>
        <div className="profile__avatar__block">
          <img className="profile__avatar__img" src={avatar} alt=""/>
        </div>
        <p>Your current name: {currentUsername ? currentUsername : currentUser.username}</p>
        <p>Your current E-mail: {currentEmail ? currentEmail : currentUser.email}</p>
      </div>
    </div>
  );
};

export default Profile;