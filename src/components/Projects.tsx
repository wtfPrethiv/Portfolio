import React from 'react';
import './Projects.css';

const Projects: React.FC = () => {
  const projectList = [
    {
      title: "Neural Network from Scratch in Rust",
      description: "A feedforward neural network implemented entirely in Rust, learning logic gates like CNOT using basic gradient descent and backpropagation no external ML libraries used !!",
      link: "https://github.com/wtfPrethiv/Neural-Network-from-scratch"
    },
    {
      title: "Quantum Energy Level Prediction NN",
      description: "A TensorFlow based neural network to predict energy levels of a quantum particle in a 1D box using quantum number, particle mass, and box length as features.",
      link: "https://github.com/wtfPrethiv/Quantum-Energy-Level-Prediction-NN"
    },
    {
      title: "NameSniff. [private]",
      description: "NameSniff: Sniff out the best domain name prices across multiple registrars, all in one place. Find, compare, and save on your next domain purchase effortlessly !! ",
      link: "https://github.com/wtfPrethiv/NameSniff."
    },
    {
      title: "Variational Quantum Eigensolver [private]",
      description: "A tool to approximate the ground state energy of quantum systems using a hybrid quantum-classical approach.",
      link: "https://github.com/wtfPrethiv/vqe-solver"
    }
  ];

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">
        
        
        <div className="projects-header">
          <h1>// _PROJECTS</h1>
          
          
          <a 
            href="https://github.com/wtfPrethiv?tab=repositories" 
            target="_blank" 
            rel="noreferrer" 
            className="show-more-btn desktop-only"
          >
            SHOW_ALL [↗]
          </a>
        </div>
        
        <div className="projects-grid">
          {projectList.map((project, index) => (
            <a 
              key={index} 
              href={project.link} 
              target="_blank" 
              rel="noreferrer" 
              className="project-card"
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </a>
          ))}
        </div>
 
        <a 
            href="https://github.com/wtfPrethiv?tab=repositories" 
            target="_blank" 
            rel="noreferrer" 
            className="show-more-btn mobile-only"
        >
            SHOW_ALL [↗]
        </a>

      </div>
    </section>
  );
};

export default Projects;