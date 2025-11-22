import Ticker from './components/Ticker';
import Navbar from './components/Navbar';
import Bio from './components/Bio';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import './index.css';

function App() {
  return (
    <div className="double">
      
      <header>
        <Ticker />
      </header>
      
      <Navbar />
      <main>  
        
        <Bio />
        <TechStack />
        <Projects />
        <Contact />
        
      </main>
    </div>
  );
}

export default App;
