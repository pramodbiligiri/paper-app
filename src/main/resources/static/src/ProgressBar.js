import {secondsToDurationStr} from './Utils';
import {SpeedControl} from './SpeedControl';

const ProgressBar = (props) => {
    const {currentSec, durationSec, onSliderChange, audioRef} = props;

//    console.log("ProgressBar");

    const currentTimestampStr = secondsToDurationStr(currentSec);
    const durationStr = secondsToDurationStr(durationSec);

    return (
        <>
            <span className="paperProgressWrap">
              <span className="currentTimestamp">{currentTimestampStr}</span>
              <input type="range" className="paperProgress"
                  value={currentSec}
                  min="0" max={durationSec}
                  step="1"
                  onChange={onSliderChange}
                  />
               <span className="paperDuration">{durationStr}</span>
               <span className="currentPaperSpeedControl"><SpeedControl audioRef={audioRef} /></span>
            </span>
        </>
    );
}

export {ProgressBar};