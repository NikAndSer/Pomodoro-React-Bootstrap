import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  // Timer
  const timer = {
    break: 60 * 5,
    session: 60 * 25,
    sessionBreak: 'Session',
  }

  // State
  const [time, setTime] = useState(timer.session);
  const [breakTime, setBreakTime] = useState(timer.break);
  const [sessionTime, setSessionTime] = useState(timer.session);
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  const [currentTimer, setCurrentTimer] = useState('Session');

  const timerRef = useRef(null);

  const beepSoundRef = useRef(null);
  const beepSound = beepSoundRef.current;

  useEffect(() => {
    if (time < 0) {
      playBeepSound();
      switchTimer();
    }
  }, [time]);

  // Convert display time
  const convertTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    // Add 0 to seconds if less than 10
    if (minutes < 10 && seconds > 10) {
      minutes = `0${minutes}`;
    } else if (minutes < 10 && seconds < 10) {
      minutes = `0${minutes}`;
      seconds = `0${seconds}`;
    } else if (minutes > 10 && seconds < 10) {
      seconds = `0${seconds}`;
    }
    // Add colon between minutes and seconds
    return `${minutes}:${seconds}`;
  }

  // Convert break and session time
  const convertBreakSession = (time) => {
    let minutes = Math.floor(time / 60);
    return minutes;
  }

  // Reset timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setStartButtonClicked(false);
    setTime(timer.session);
    setBreakTime(timer.break);
    setSessionTime(timer.session);
    setCurrentTimer('Session');

    if (beepSound) {
      beepSound.pause();
      beepSound.currentTime = 0;
    }
  }

  // Decrement break
  const decrementBreak = () => {
    if (startButtonClicked === true) {
      return null;
    } else {
      setBreakTime((prevBreakTime) => (prevBreakTime < 120 ? 60 : prevBreakTime - 60));
    }
  }

  // Increment break
  const incrementBreak = () => {
    if (startButtonClicked === true) {
      return null;
    } else {
      setBreakTime((prevBreakTime) => (prevBreakTime > 3540 ? 3600 : prevBreakTime + 60));
    }
  }

  // Decrement session
  const decrementSession = () => {
    if (startButtonClicked === true) {
      return null;
    } else {
      setSessionTime((prevSessionTime) => (prevSessionTime < 120 ? 60 : prevSessionTime - 60));
      setTime((prevTime) => (prevTime < 120 ? 60 : prevTime - 60));
    }
  }

  // Increment session
  const incrementSession = () => {
    if (startButtonClicked === true) {
      return null;
    } else {
      setSessionTime((prevSessionTime) => (prevSessionTime > 3540 ? 3600 : prevSessionTime + 60));
      setTime((prevTime) => (prevTime > 3540 ? 3600 : prevTime + 60));
    }
  }



  // Start/Stop timer
  const startStopTimer = () => {
    setStartButtonClicked((prevState) => !prevState);

    if (!startButtonClicked) {
      // Start the timer
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      // Stop the timer
      clearInterval(timerRef.current);
    }
  };

  // Switch between session and break timers
  const switchTimer = () => {
    if (currentTimer === 'Session') {
      setCurrentTimer('Break');
      setTime(breakTime);
    } else {
      setCurrentTimer('Session');
      setTime(sessionTime);
    }
  };


  // Play beep sound
  const playBeepSound = () => {
    beepSound.currentTime = 0; // Reset sound to the beginning
    beepSound.play();

    // Stop the sound after 1 second
    setTimeout(() => {
      beepSound.pause();
      beepSound.currentTime = 0;
    }, 1000);
  }

  return (
    
    <>
    <div id="test-div">
    <i class="fa-solid fa-arrow-left-long"></i> 
    <p id="test">test my project </p>
    </div>
    
    
    
    <h1>
      POMODORO
    </h1>
    
    <div className='container text-center border rounded border-5 border-success-subtle mt-5 p-3'>

      {/* Break&Session Row */}
      <div className='row'>
        {/* Break Column */}
        <div className='col-sm-6'>
          <h3>BREAK</h3>
          <div className='d-flex align-items-center justify-content-center mb-2' id='break-label'>
            <button className='btn btn-light' onClick={decrementBreak} id='break-decrement'>
              <i className="fa-solid fa-down-long"></i>
            </button>
            <p className='m-0 ms-2 me-2 fs-4 fw-medium' id='break-length'>{convertBreakSession(breakTime)}</p>
            <button className='btn btn-light' onClick={incrementBreak} id='break-increment'>
              <i className="fa-solid fa-up-long"></i>
            </button>
          </div>
        </div>

        {/* Session Column */}
        <div className='col-sm-6'>
          <h3>SESSION</h3>
          <div id='session-label' className='d-flex align-items-center justify-content-center mb-2'>
            <button className='btn btn-light' onClick={decrementSession} id='session-decrement'>
              <i class="fa-solid fa-down-long"></i>
            </button>
            <p className="m-0 ms-2 me-2 fs-4 fw-medium" id='session-length'>{convertBreakSession(sessionTime)}</p>
            <button className='btn btn-light' onClick={incrementSession} id='session-increment'>
              <i class="fa-solid fa-up-long"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Timer Row */}
      <div className='row text-center'>
        <div className='col d-flex align-items-center justify-content-center'>
          <div className='rounded-circle border border-5 border-success equal-sided-circle' id='timer-label'>
            <h3 id='timer'>{currentTimer}</h3>
            <div id='time-left'>{convertTime(time)}</div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          {/* Timer beep sound */}
          <audio id='beep' ref={beepSoundRef} src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'></audio>
        </div>
      </div>

      {/* Start/Stop Row */}
      <div className='row'>
        <div className='col-sm-6 d-flex align-items-center justify-content-center'>
          <button className='btn btn-success w-50 mt-3' onClick={startStopTimer} id='start_stop'>
            {startButtonClicked ? 'STOP' : 'START'}
          </button>
        </div>


        {/* Reset Row */}
        <div className='col-sm-6 d-flex align-items-center justify-content-center'>
          <button className='btn btn-danger w-50 mt-3' onClick={resetTimer} id='reset'>
            RESET
          </button>
        </div>
      </div>
    </div>
    
    {/* Footer */}
    <footer className='text-center mt-5'>
      <p>
        Coded by <a href='https://github.com/NikAndSer' target='_blank' rel='noreferrer'>NikAndSer</a>
      </p>
    </footer>

    </>
    
  );
}

export default App;