import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';

const PlayerActions = (props) => {

    const {isPlaying, prevTrackFn, pauseCurrentFn, playFromCurrentFn,
              nextTrackFn, hasNext, hasPrev, itemsCount} = props;

    return (
        <div className="playlistButtonWrap">
            {hasPrev ?
                <span className="trackChangeIconPrevWrap"><Link onClick={prevTrackFn}><img
                       alt="Previous abstract" className="playlistNextImg" src="./prev-6.png"/></Link></span>
                :<span className="trackChangeIconPrevWrap"><img
                        alt="Previous abstract disabled" className="playlistNextImg playlistNextImgDisabled" src="./prev-dis-2.png"/></span>
            }
            {isPlaying ?
              <Button className="playButtonPause" onClick={pauseCurrentFn} variant="contained" color="primary">Pause</Button>
              : itemsCount === 1 ?
                  <Button className="playButton" onClick={playFromCurrentFn} variant="contained" color="primary">Play Abstract</Button>
                :<Button className="playButton" onClick={playFromCurrentFn} variant="contained" color="primary">Play Abstracts</Button>
            }
            {hasNext ?
                <span className="trackChangeIconNextWrap"><Link onClick={nextTrackFn}><img
                        alt="Next abstract" className="playlistNextImg" src="./next-6.png"/></Link></span>
                :<span className="trackChangeIconNextWrap"><img
                        alt="Next abstract disbled" className="playlistNextImg playlistNextImgDisabled" src="./next-dis-2.png"/></span>
            }
        </div>
    );
}

export {PlayerActions};