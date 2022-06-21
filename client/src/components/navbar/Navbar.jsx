import React, {useState} from 'react';
import './navbar.css';
import Logo from '../../assets/img/mern-logo.png';
import {NavLink, useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {displaySearch, hideSearch, logout} from "../../reducers/userReducer";
import {getFiles, searchFiles} from "../../actions/file";
import {showLoader} from "../../reducers/appReducer";
import avatarLogo from '../../assets/img/avatar.svg'
import {API_URL} from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faUserPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const isAuth = useSelector(state => state.user.isAuth)
  let isSearch = useSelector(state => state.user.isSearch)
  const currentDir = useSelector(state => state.files.currentDir)
  const currentUser = useSelector(state => state.user.currentUser)
  const dispatch = useDispatch()
  const [searchName, setSearchName] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(false)
  const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo
  let location = useLocation()

  function searchChangeHandler(e) {
    setSearchName(e.target.value)
    if (searchTimeout != false) {
      clearTimeout(searchTimeout)
    }
    dispatch(showLoader())
    if(e.target.value != '') {
      setSearchTimeout(setTimeout((value) => {
        dispatch(searchFiles(value));
      }, 500, e.target.value))
    } else {
      dispatch(getFiles(currentDir))
    }
  }

  return (
    <div className="navbar">
      <div className="container">
        <NavLink to="/"><img src={Logo} alt="" className="navbar__logo"/></NavLink>
        {isAuth && location.pathname !== '/profile' ? <input
          value={searchName}
          onChange={e => searchChangeHandler(e)}
          className='navbar__search'
          type="text"
          placeholder="File name..."/> : ''}
        {!isAuth && <div className="navbar__login"><NavLink to="/login"><FontAwesomeIcon icon={faSignIn} />Authorization</NavLink></div> }
        {!isAuth && <div className="navbar__registration"><NavLink to="/registration"><FontAwesomeIcon icon={faUserPlus} />Registration</NavLink></div> }
        {isAuth && <div className="navbar__logout" onClick={() => dispatch(logout()) }><FontAwesomeIcon icon={faSignOut} />Sign out</div> }
        {isAuth && <NavLink to='/profile' className="navbar__profile">
          <img className="navbar__avatar" src={avatar} alt=""/>
        </NavLink>}
      </div>
    </div>
  );
};

export default Navbar;