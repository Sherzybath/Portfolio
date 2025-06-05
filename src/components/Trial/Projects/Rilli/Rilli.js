
import YouTubeEmbed from '../YouTubeEmbed';
import React, { useRef, useEffect } from 'react';
function Rilli({PillarsRef, overlayRef, heroRef, videoRef, titleRef, spanRefs, projectCont}) {
    const splitText = (text) => {
        return text.split('').map((char, index) => (
          <span style={{color: 'var(--primary-color)', fontFamily:'Canopee'}} ref={(el) => spanRefs.current[index] = el} key={index} className="char">{char}</span>
        ));
      };


      // LINE ANIMATION
            // LINE ANIMATION
            // LINE ANIMATION
            const lineRef = useRef(null);
            useEffect(() => {
              const handleScroll = () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
                const scrollPercent = scrollTop / docHeight;
                const maxHeight = 70; // in vh
                const heightInVh = Math.min(scrollPercent * maxHeight, maxHeight); // clamp to 70
            
                if (lineRef.current) {
                  lineRef.current.style.height = `${heightInVh}vh`;
                }
              };
            
              window.addEventListener('scroll', handleScroll);
              return () => window.removeEventListener('scroll', handleScroll);
            }, []);




  return (
    <div>
      <div ref={heroRef} className='Rilli' style={{background: 'var(--secondary-color)'}}> 
        <div ref={overlayRef} className='overlay' style={{background: 'var(--primary-color)'}}> </div>
        <header>
            <span style={{marginTop: '10vw'}} ref={titleRef} className='Title' >{splitText('RILLI')}</span>
        </header>

          
      </div>
          <div ref={el => PillarsRef.current[0] = el} className='Pillar1'></div>

          <div ref={el => PillarsRef.current[1] = el} className='Pillar2'>
            <span className='TagName'>@Sherzybath</span>
            <div ref={lineRef} className='line'></div>
          </div>
        <div ref={projectCont} className='ProjectCont'>
            <div className='ProjectDeet'>
              <div className='ProjectDeetTop'>
                <p>Rilli is a user-friendly university timetable system that lets administrators create schedules while allowing students and teachers to access them and add notes effortlessly.</p>
              </div>
              <div className='ProjectDeetBottom'>
                  <div>
                    <span className='Head'>Role</span>
                    <span className='Text'>Web Developer</span>
                  </div>
                  <div>
                    <span className='Head'>Tasks</span>
                    <span className='Text'>UI/UX Design, Custom Animations, Functionalities and Backend, Webflow Integration, GSAP Animations, Responsive Design, Testing and Deployment.</span>
                  </div>
                  <div>
                    <span className='Head'>Link</span>
                    <span className='Text'>Not Osu</span>
                  </div>
              </div>
            </div>
            <div className='VIDEO'>
              <YouTubeEmbed videoId="whsnWzTCneE" />
                {/* <video ref={videoRef} 

                    autoPlay
                    muted
                    playsInline
                    loop
                    >
                    <source src={Intro} type="video/mp4" class="" />
                </video> */}
            </div>
            <div>
              <p>Rilli was developed in collaboration with university administrators to create a seamless and intuitive timetable system.</p>
              <p>With a focus on accessibility and efficiency, Rilli needed a clean UI, smooth interactions, and a system that both students and faculty could navigate effortlessly. To ensure flexibility and maintainability, I implemented custom animations with GSAP and a responsive design, allowing the platform to adapt across all devices while maintaining a polished experience.</p>
            </div>
            <div className='VIDEO'>
              <YouTubeEmbed videoId="Aq-mfDkpXQk" />
                {/* <video ref={videoRef} 

                    autoPlay
                    muted
                    playsInline
                    loop
                    >
                    <source src={Function} type="video/mp4" class="" />
                </video> */}
            </div>
            <p>Rilli was where I truly began my journey with HTML, CSS, and JavaScript. While I had a solid grasp of design and layout, diving into functionality and interactivity pushed me to explore more advanced techniques. I experimented with GSAP for animations, refined my responsive design skills, and built custom features that made the system more intuitive. This project was a major learning experience, shaping the way I approach front-end development today.</p>

            
            
        </div>
          {/* <div className='Finale'>
            <span>Website Link</span>
            <button>http://Rilli.vercel.com</button>
          </div>      */}
    </div>
    
  )
}

export default Rilli