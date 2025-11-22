import React from 'react';
import meImg from '../assets/images/me.png';  
import './Bio.css'
const Bio: React.FC = () => {
  return (
    <section id="home">
      <div className="sabout">
        <h1>Prethiv Sriman D</h1>
        <p>
          I am an 18 year old college student who loves coding and building software. 
          I enjoy learning new things and have a deep interest in quantum computing. 
          I spend my time working on projects, exploring ideas, and figuring out how things work.
        </p>
        
        <img src={meImg} alt="Me" />

        <div className="links-container">
          
          <a 
            href="https://www.linkedin.com/in/prethiv-sriman" 
            target="_blank" 
            rel="noopener noreferrer"
            className="linkedin-button" 
            style={{ marginRight: '10px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
            </svg>
            <span className="linkedin">linkedin</span>
          </a>

          
          <a href="" className="cv">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
            </svg>
            <span className="cvd">Download CV</span>
          </a> 
        </div>   
      </div>
    </section>
  );
};

export default Bio;