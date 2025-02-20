import { Select, MenuItem } from '@material-ui/core';
import {useState, useLayoutEffect} from 'react';

const SpeedControl = (props) => {

    const {audioRef} = props;

    const [playbackSpeed, setPlaybackSpeed] = useState("normal");

    let speeds = { "fullFocus": 1.17, "attentive": 1.05, "normal": 1, "slow" : 0.94, "verySlow" : 0.88};

    const changeSpeed = (event) => {
        let value = event.target.value;
        let speed = speeds[value];
        if (speed === undefined) {
            return;
        }

        setPlaybackSpeed(value);
    }

    useLayoutEffect(() => {
        if (audioRef == null || audioRef.current == null) {
            return;
        }

        let speed = speeds[playbackSpeed];
        if (speed === undefined) { // TODO: Check syntax
            return;
        }

        if (audioRef.current.playbackRate === speed) {
            return;
        }

        console.log("Setting speed to: " + speed);
        audioRef.current.playbackRate = speeds[playbackSpeed];

    }, [playbackSpeed]);

    return (
        <Select className="speedSelector" native={false} displayEmpty={true}
                value={playbackSpeed} onChange={changeSpeed}>
            <MenuItem value="label" disabled>Speed</MenuItem>
            <MenuItem value="fullFocus">1.2x</MenuItem>
            <MenuItem value="attentive">1.1x</MenuItem>
            <MenuItem value="normal">1x</MenuItem>
            <MenuItem value="slow">0.9x</MenuItem>
            <MenuItem value="verySlow">0.8x</MenuItem>
        </Select>
    );
}

export {SpeedControl};