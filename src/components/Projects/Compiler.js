
import React, { useRef , useState} from 'react';
import Sherzy from '../../Assets/Images/SherzyChibi.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import CommandInputBox from './CommandInputBox';
import { helpProject, unhandleHelpCommand, undoLoad, onLoadAnimation } from '../../Commands';

import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';

const Compiler = ({ compilerRef, infoBoxRefs, boardRef, currentComponent, setCurrentComponent,  isHelp, setHelp, control, triggerSwap }) => {
  const listRef = useRef(null);
  const navigate = useNavigate()
  const [isOpen, setOpen] = useState(false);

  const runProjectSwap = (targetComponent, closeCompiler = false) => {
    triggerSwap();

    if (closeCompiler) {
      undoLoad(compilerRef, setOpen, setHelp, listRef);
    }

    setTimeout(() => {
      setCurrentComponent(targetComponent);
    }, 900);
  };

  const commands = {
    '/help': () => {
      if (isHelp) {
        unhandleHelpCommand(compilerRef, listRef, setHelp);
      } else {
        helpProject(compilerRef, listRef, setHelp);
      }
    },
    '/aboutme': () => {
      navigate('/');
    },

    '/skillweave': () => runProjectSwap('SkillWeave', true),
    '/rilli': () => runProjectSwap('Rilli'),
    '/rentique': () => runProjectSwap('Rentique'),

  };
  const { scrollYProgress } = useScroll();

  // Create a motion value for the vertical position
  const y = useMotionValue(0); // Initial y position for drag

  // Transform the scroll progress to affect the y position dynamically
  const scrollYTransform = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  
  return (
    <motion.div dragControls={control} whileDrag={{scale:1.2, zIndex:10}} y={scrollYProgress} dragConstraints={boardRef} className='compiler' ref={compilerRef} style={{ position: 'fixed', top: '2vh', left: '2vw', opacity: '0' }} >
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
        <button onClick={commands['/eeeeeeeeeeeeeeeeeeeee']} className='listItem'>
          <FontAwesomeIcon icon={faMinus} className='IconFA' />
          <span>/aboutME</span>
        </button> 
        <button onClick={commands['/rilli']} className='listItem'>
          <FontAwesomeIcon icon={currentComponent === 'Rilli' ? faPlus : faMinus}  className='IconFA' />
          <span className={currentComponent === 'Rilli' ? 'active' : ''}>/Rilli</span>
        </button>
        <button onClick={commands['/skillweave']} className='listItem'>
          <FontAwesomeIcon icon={currentComponent === 'SkillWeave' ? faPlus : faMinus}  className='IconFA' />
          <span className={currentComponent === 'SkillWeave' ? 'active' : ''}>/SkillWeave</span>
        </button>
        <button onClick={commands['/rentique']} className='listItem'>
          <FontAwesomeIcon icon={currentComponent === 'Rentique' ? faPlus : faMinus}  className='IconFA' />
          <span className={currentComponent === 'Rentique' ? 'active' : ''}>/Rentique</span>
        </button>
        
      </div>
    </motion.div>
  );
};

export default Compiler;
