import React, {useRef, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap'
function Education({isPlus}) {
  const skillRefs = useRef([]);
  useEffect(() => {
    if (isPlus) {
      gsap.from(
        skillRefs.current,
        {
          top: '20vw',
          ease: 'power4.out',
          duration: 1.5,
          stagger: 0.3 
        }
      );
      console.log('here')
      console.log(skillRefs.current)
    }
    
  }, [isPlus]);
  


  return (
    <div className='SkillSetList'>
        <div className='SkillSet'><FontAwesomeIcon className='halfGol' icon={faCircleNotch} /><span ref={(el) => skillRefs.current[0] = el} >Web Development</span></div>
        <div className='SkillSet'><FontAwesomeIcon className='halfGol' icon={faCircleNotch} /><span ref={(el) => skillRefs.current[1] = el}>Backend Integration</span></div>
        <div className='SkillSet'><FontAwesomeIcon className='halfGol' icon={faCircleNotch} /><span ref={(el) => skillRefs.current[2] = el}>NLP & IMDAI</span></div>
        <div className='SkillSet'><FontAwesomeIcon className='halfGol' icon={faCircleNotch} /><span ref={(el) => skillRefs.current[3] = el}>Database Management</span></div>
    </div>
  )
}

export default Education