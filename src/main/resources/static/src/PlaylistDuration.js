import {getDurationSec, secondsToDurationStr} from './Utils';

const PlaylistDuration = (props) => {
    const {items, currentIndex, playlistCurrentTimestamp} = props;

    const durationSec = getDurationSec(items);
    const durationStr = secondsToDurationStr(durationSec);
    const currentTimestampStr = secondsToDurationStr(playlistCurrentTimestamp);

    if (playlistCurrentTimestamp === durationSec) {
        return (
            <div className="playlistDuration playlistDurationEnded">
              <span className="playlistCurrentTimestampEnded">{currentIndex + 1}</span><span className="playlistDurationText"> / {items.length} papers,</span>&#160;<span className="playlistCurrentTimestampEnded">{currentTimestampStr}</span><span className="playlistDurationText"> / {durationStr}</span>
            </div>
        );
    }

    return (
          <div className="playlistDuration">
              <span className="playlistCurrentTimestamp">{currentIndex + 1}</span><span className="playlistDurationText"> / {items.length} papers,</span>&#160;<span className="playlistCurrentTimestamp">{currentTimestampStr}</span><span className="playlistDurationText"> / {durationStr}</span>
          </div>
    );
}

export {PlaylistDuration};