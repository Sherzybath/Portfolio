import React, { useRef, useEffect } from 'react';
import YouTubeEmbed from '../YouTubeEmbed'
function Rentique({PillarsRef, overlayRef, heroRef, videoRef, titleRef, spanRefs, projectCont}) {
    const splitText = (text) => {
        return text.split('').map((char, index) => (
          <span style={{color: 'var(--primary-color)', fontFamily:'Canopee',fontSize: '23vw'}} ref={(el) => spanRefs.current[index] = el} key={index} className="char">{char}</span>
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
            <span style={{marginTop: '10vw'}} ref={titleRef} className='Title' >{splitText('RENTIQUE')}</span>
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
                <p>Rentique is a stylish and user-friendly platform that allows users to browse and rent traditional Indian wedding attire, making it easy to find the perfect outfit for any celebration.</p>
              </div>
              <div className='ProjectDeetBottom'>
                  <div>
                    <span className='Head'>Role</span>
                    <span className='Text'>Web Developer, BackEnd</span>
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
              <YouTubeEmbed videoId="G4Ljb9DzPn0" />
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
              <p>Rentique was built to make renting clothes for Indian weddings simple, stylish, and stress-free.</p>
              <p>The platform needed to feel elegant yet approachable, with fluid interactions and a seamless user experience. I developed the front end in React, using GSAP to bring the UI to life with subtle animations that enhanced the browsing and booking flow. On the backend, I used PostgreSQL to manage inventory, user data, and booking logistics, ensuring everything ran smoothly behind the scenes. The result was a responsive, full-stack experience tailored for celebration.</p>
            </div>
            <div className='VIDEO'>
            <YouTubeEmbed videoId="PDxsa0LJjJc" />
            
                {/* <video ref={videoRef} 

                    autoPlay
                    muted
                    playsInline
                    loop
                    >
                    <source src={List} type="video/mp4" class="" />
                </video> */}
            </div>
            <p>Rentique was where I really deepened my understanding of full-stack development, especially the connection between PostgreSQL and React. While I was comfortable with front-end work, this project pushed me to handle data flow between the client and server. I learned how to structure and query a PostgreSQL database efficiently, set up endpoints, and ensure smooth communication with the React frontend. Managing user data, inventory, and rental requests in real-time taught me a lot about state management, asynchronous operations, and backend logic. It was a big step forward in building scalable, connected applications.</p>
            <div className='VIDEO'>
              <YouTubeEmbed videoId="rJA1ifnbG0g" />
                {/* <video ref={videoRef} 

                    autoPlay
                    muted
                    playsInline
                    loop
                    >
                    <source src={Display} type="video/mp4" class="" />
                </video> */}
            </div>
            
            
        </div>
          {/* <div className='Finale'>
            <span>Website Link</span>
            <button>http://Rilli.vercel.com</button>
          </div>      */}
    </div>
    
  )
}

export default Rentique