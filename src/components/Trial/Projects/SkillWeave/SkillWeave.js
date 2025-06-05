
import YouTubeEmbed from '../YouTubeEmbed'
import React, { useRef, useEffect } from 'react';
function SkillWeave({PillarsRef, overlayRef, heroRef, videoRef, titleRef, spanRefs, projectCont}) {
    const splitText = (text) => {
        return text.split('').map((char, index) => (
          <span style={{color: 'var(--primary-color)', fontFamily: 'Canopee',fontSize: '20vw'}} ref={(el) => spanRefs.current[index] = el} key={index} className="char">{char}</span>
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
        <div ref={overlayRef} className='overlay' style={{background: '--primary-color'}}> </div>
        <header>
            <span style={{marginTop: '10vw'}} ref={titleRef} className='Title' >{splitText('SKILLWEAVE')}</span>
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
                    <p>SkillWeave is a freelance service platform that connects clients with creative professionals through a clean, streamlined experience designed for ease of use and scalability.</p>
                  </div>
                  <div className='ProjectDeetBottom'>
                      <div>
                        <span className='Head'>Role</span>
                        <span className='Text'>Full-Stack Developer</span>
                      </div>
                      <div>
                        <span className='Head'>Tasks</span>
                        <span className='Text'>Full-Stack Development, React Frontend, TailwindCSS Styling, PostgreSQL Integration, Python AI Chatbot, User Authentication, Messaging System, Dashboard Features.</span>
                      </div>
                      <div>
                        <span className='Head'>Link</span>
                        <span className='Text'>Not Osu</span>
                      </div>
                  </div>
                </div>
                <div className='VIDEO'>
                    <YouTubeEmbed videoId="Vg4WWyK3m-o" />
                    {/* <video ref={videoRef} 
    
                        autoPlay
                        muted
                        playsInline
                        loop
                        >
                        <source src={Homepage} type="video/mp4" class="" />
                    </video> */}
                </div>
                <div>
                  <p>SkillWeave was built as a freelance marketplace platform, designed to connect clients and service providers in a simple and intuitive way.</p>
                  <p>The project called for a functional, minimal interface that could support key features like profile creation, service listings, and conversations between users. I used React and TailwindCSS on the frontend to keep the design lightweight and adaptable across devices. PostgreSQL handled the database, and I brought in a Python-based AI chatbot to guide users and answer questions. This build gave me the chance to bring multiple technologies together into one cohesive and interactive product.</p>
                </div>
                <div className='VIDEO'>
                  <YouTubeEmbed videoId="ncwDZNP-Xnc" />
                    {/* <video ref={videoRef} 
    
                        autoPlay
                        muted
                        playsInline
                        loop
                        >
                        <source src={Portfolios} type="video/mp4" class="" />
                    </video> */}
                </div>
                <p>SkillWeave was my first serious dive into full-stack development. Built with React on the frontend, PostgreSQL for the database, and styled using TailwindCSS, the project taught me how to structure and connect a complete web application. I also integrated a Python-based AI chatbot to handle user queries, which added an extra layer of functionality and complexity. Designing the user experience, building out core features like profiles and listings, and managing data flow between frontend and backend really helped me understand how full-stack systems work in practice.</p>
                <div className='VIDEO'>
                  <YouTubeEmbed videoId="kWO2BQfuBg0" />
                    {/* <video ref={videoRef} 
    
                        autoPlay
                        muted
                        playsInline
                        loop
                        >
                        <source src={Fork} type="video/mp4" class="" />
                    </video> */}
                </div>
                
                
            </div>

    </div>
    
 
  )
}

export default SkillWeave