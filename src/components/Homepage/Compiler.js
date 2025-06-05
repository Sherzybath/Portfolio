// Compiler.js
import React, { useRef , useState} from 'react';
import Sherzy from '../../Assets/Images/SherzyChibi.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import CommandInputBox from './CommandInputBox';
import {handleTransitionProjects, aboutMeCommand, handleHelpCommand, undoLoad, closeAboutMe, onLoadAnimation, unhandleHelpCommand } from '../../Commands';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Compiler = ({ compilerRef, infoBoxRefs, boardRef, isPlus, setPlus,  isHelp, setHelp, control,}) => {
  const listRef = useRef(null);
  const navigate = useNavigate()
  const [isOpen, setOpen] = useState(false);
  const commands = {
    '/help': () => {
      if (isHelp) {
        unhandleHelpCommand(compilerRef, listRef, setHelp);
    } else {
      handleHelpCommand(compilerRef, listRef, setHelp)
    }},
    '/aboutme': () => {
      if (isPlus) {
        closeAboutMe(infoBoxRefs, setPlus);
      } else {
        aboutMeCommand(infoBoxRefs, setPlus);
      }
    },
    '/projects': () => handleTransitionProjects(navigate),

  };
  
  return (
    <motion.div drag dragControls={control} whileDrag={{scale:1.2, zIndex:10}} dragConstraints={{left: 0, top:0, right:0, bottom:0}} className='compiler' ref={compilerRef}  >
      <div className='Nav'>
        <img
          className='logo'
          src={Sherzy}
          onClick={() => isOpen ? undoLoad(compilerRef, setOpen, setHelp, listRef) : onLoadAnimation(compilerRef, setOpen)}
          alt="logo"
          draggable="false"
        />
        <CommandInputBox commands={commands} compilerRef={compilerRef}> /</CommandInputBox>
      </div>
      <div className='list' ref={listRef}>
        <button onClick={commands['/aboutme']} className='listItem'>
          <FontAwesomeIcon icon={isPlus ? faPlus : faMinus}  className='IconFA' />
          <span className={isPlus ? 'active' : ''}>/aboutME</span>
        </button>
        <button onClick={commands['/projects']} className='listItem'>
          <FontAwesomeIcon icon={faMinus} className='IconFA' />
          <span>/projects</span>
        </button>
        <button className='listItem'>
          <FontAwesomeIcon icon={faMinus} className='IconFA' />
          <span>/hobbies</span>
        </button>
        <button className='listItem'>
          <FontAwesomeIcon icon={faMinus} className='IconFA' />
          <span>/experience</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Compiler;
