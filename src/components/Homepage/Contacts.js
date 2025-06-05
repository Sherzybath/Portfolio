import React, {useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMinus, faPhone, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faInstagram} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope} from '@fortawesome/free-regular-svg-icons'

import gsap from 'gsap';
function Contacts({isPlus, Popup}) {
  const hideTextRefs = useRef([]);

  useEffect(() => {
    if (isPlus) {
      gsap.from(
        hideTextRefs.current,
        {
          top: '15vw',
          ease: 'power4.out',
          duration: 1.5,
          stagger: 0.3 
        }
      );
      
    }
    
  }, [isPlus]);
  const handleCopy1 = () => {

    const phoneNumber = "https://www.instagram.com/sherzybath/";
    gsap.to(
      hideTextRefs.current[0],
      {
        right: '0.17vw',
        ease: 'power4.out',
        duration: 0.5,
         yoyo: true,   
        repeat: 1, 
      }
    );
    Popup();
    navigator.clipboard.writeText(phoneNumber).then(() => {
    });
};
  const handleCopy2 = () => {
    const phoneNumber = "sdzyrsmy@gmail.com";
    gsap.to(
      hideTextRefs.current[1],
      {
        right: '0.2vw',
        ease: 'power4.out',
        duration: 0.5,
         yoyo: true,  
        repeat: 1, 
      }
    );
    Popup();
    navigator.clipboard.writeText(phoneNumber).then(() => {
    });
};
  const handleCopy3 = () => {
    const phoneNumber = "9321656049";
    gsap.to(
      hideTextRefs.current[2],
      {
        right: '0.2vw',
        ease: 'power4.out',
        duration: 0.5,
         yoyo: true, 
        repeat: 1, 
      }
    );
    Popup();
    navigator.clipboard.writeText(phoneNumber).then(() => {
    });
};
  const handleCopy4 = () => {
    const phoneNumber = "https://github.com/Sherzybath";
    gsap.to(
      hideTextRefs.current[3],
      {
        right: '0.2vw',
        ease: 'power4.out',
        duration: 0.5,
         yoyo: true, 
        repeat: 1, 
      }
    );
    Popup();
    navigator.clipboard.writeText(phoneNumber).then(() => {
    });
};
  return (
    <div className='contact'>
        <a className='contactItem' onClick={handleCopy1}>
          <div ref={(el) => hideTextRefs.current[0] = el} className='social-icon'>
          <FontAwesomeIcon icon={faInstagram} />
          <FontAwesomeIcon icon={faCheck} />
          </div>
        </a>
        <a className='contactItem' onClick={handleCopy2}>
          <div ref={(el) => hideTextRefs.current[1] = el} className='social-icon'>
          <FontAwesomeIcon icon={faEnvelope} />
          <FontAwesomeIcon icon={faCheck} />
          </div>
        </a>
        <a className='contactItem' onClick={handleCopy3}>
          <div ref={(el) => hideTextRefs.current[2] = el} className='social-icon'>
          <FontAwesomeIcon icon={faPhone} />
          <FontAwesomeIcon icon={faCheck} />
          </div>
        </a>
        <a className='contactItem' onClick={handleCopy4}>
          <div ref={(el) => hideTextRefs.current[3] = el} className='social-icon'>
          <FontAwesomeIcon icon={faGithub} />
          <FontAwesomeIcon icon={faCheck} />
          </div>
        </a>
        {/* <a className='contactItem'><FontAwesomeIcon ref={(el) => hideTextRefs.current[1] = el} className='social-icon' icon={faEnvelope} /></a>
        <a className='contactItem' onClick={handleCopy}><FontAwesomeIcon ref={(el) => hideTextRefs.current[2] = el} className='social-icon' icon={faPhone} /></a>
        <a className='contactItem'><FontAwesomeIcon ref={(el) => hideTextRefs.current[3] = el} className='social-icon' icon={faGithub} /></a> */}
    </div>
  )
}

export default Contacts