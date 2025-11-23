import React from 'react';
import './Ticker.css'

const Ticker: React.FC = () => {

  const content = (
    <div className="ticker-item">
      <p>
        &copy; // DOUBLE00 | wtfPrethiv&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;
        // WELCOME TO THE PORTFOLIO &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp; 
        // SCROLL DOWN FOR PROJECTS &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;
        // LAST UPDATED : DEC 7 2024&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;
        // NOTE: ssSSssIiitEESSSSSS NNnnnnOOoooooTTTTtT fuLLY RESPOnSIVE yetttt !!!!!!!!!!!!!!
      </p>
    </div>
  );

  return (
    <div className="double00">
      <div className="ticker-track">
        {content}
        {content}
      </div>
    </div>
  );
};

export default Ticker;