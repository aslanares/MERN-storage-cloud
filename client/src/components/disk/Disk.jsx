import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getFiles, uploadFile} from "../../actions/file";
import FileList from "./fileList/FileList";
import './disk.css';
import "../../utils/vars.css";
import Popup from "./Popup";
import {setCurrentDir, setFileView, setPopupDisplay} from "../../reducers/fileReducer";
import Uploader from "./uploader/Uploader";
import Select from "react-select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faFolder, faFile} from "@fortawesome/free-solid-svg-icons";

const Disk = () => {
  const dispatch = useDispatch()
  const currentDir = useSelector(state => state.files.currentDir)
  const loader = useSelector(state => state.app.loader)
  const dirStack = useSelector(state => state.files.dirStack)
  const [dragEnter, setDragEnter] = useState(false)
  const options = [
    { value: 'name', label: 'By name' },
    { value: 'type', label: 'By type' },
    { value: 'date', label: 'By date' },
  ];
  const optionsStyles = {
    control: base => ({
      ...base,
      backgroundColor: "#FFF",
      color: "@font-color",
      border: "none",
      boxShadow: "inset 0px 0px 6px 3px rgb(0 0 0 / 5%)",
      borderRadius: "5px",
      "&:hover": {
        boxShadow: "inset 0px 0px 6px 3px rgb(0 0 0 / 10%)",
      }
    }),
    option: (provided, {isFocused}) => ({
      ...provided,
      backgroundColor: isFocused ? "#F88C10" : "transparent",
      color: "@font-color"
    }),
  }
  const [sort, setSort] = useState({value: 'name', label: 'By name'})

  const [handleChange] = useState(() => (sort) => setSort(sort));


  useEffect(() => {
    dispatch(getFiles(currentDir, sort.value))
  }, [currentDir, sort.value])

  function showPopupHandler() {
    dispatch(setPopupDisplay('flex'))
  }

  function backClickHandler() {
    const backDirId = dirStack.pop()
    dispatch(setCurrentDir(backDirId))
  }

  function fileUploadHandler(event) {
    const files = [...event.target.files]
    files.forEach(file => dispatch(uploadFile(file, currentDir)))
  }

  function dragEnterHandler(event) {
    event.preventDefault()
    event.stopPropagation()
    setDragEnter(true)
  }

  function dragLeaveHandler(event) {
    event.preventDefault()
    event.stopPropagation()
    setDragEnter(false)
  }

  function dropHandler(event) {
    event.preventDefault()
    event.stopPropagation()
    let files = [...event.dataTransfer.files]
    files.forEach(file => dispatch(uploadFile(file, currentDir)))
    setDragEnter(false)
  }

  if(loader) {
    return (
      <div className="loader">
        <div className="lds-dual-ring"></div>
      </div>
    )
  }

  return ( !dragEnter ?
      <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
        <div className="disk__btns">
          <button className="disk__back" onClick={() => backClickHandler()}><FontAwesomeIcon icon={faArrowLeft} /> Back</button>
          <button className="disk__create" onClick={() => showPopupHandler()}><FontAwesomeIcon icon={faFolder} /> Create folder</button>
          <div className="disk__upload">
            <label htmlFor="disk__upload-input" className="disk__upload-label">Upload file<FontAwesomeIcon icon={faFile} /></label>
            <input multiple={true} onChange={(event)=> fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
          </div>

          <Select
            placeholder="Select a type"
            searchable={false}
            value={sort}
            onChange={handleChange}
            options={options}
            styles={optionsStyles}
          />

          <button className="disk__plate" onClick={() => dispatch(setFileView('plate'))}></button>
          <button className="disk__list" onClick={() => dispatch(setFileView('list'))}></button>
        </div>
        <FileList/>
        <Popup/>
        <Uploader/>
      </div>
      :
      <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
        Drag files here
      </div>
  );
};

export default Disk;