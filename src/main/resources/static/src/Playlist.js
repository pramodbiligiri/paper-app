import React, {useState, useEffect} from 'react';
import {Player} from "./Player";

const Playlist = (props) => {

    const {playlist, lastDeleted, previewPopupRefs, removeFromPlaylist,
            isPlaying, setIsPlaying, paperPlayRefs, setPaperPlayRefs,
            isPlayingPaperPlays, setIsPlayingPaperPlays,
            subsRef} = props;

    const getIndexForKeyInSelected = (itemKey) => {
        for (let i = 0; i < playlist.length; i++) {
            if (itemKey === playlist[i].key) {
                return i;
            }
        }

        return -1;
    }

    const getInitialValueForCurrentItemKey = () => {
        let cachedCurrentItemKey = localStorage.getItem("currentItemKey");
        let idxFromCachedKey = getIndexForKeyInSelected(cachedCurrentItemKey);

        if (idxFromCachedKey !== -1 && idxFromCachedKey < playlist.length) {
            return cachedCurrentItemKey;
        }

        if (playlist.length > 0) {
            return playlist[0].key;
        }

        return "-1";
    }

    const [currentItemKey, setCurrentItemKey] = useState(getInitialValueForCurrentItemKey());

    /**
     * Calculate the index of the current item being played, within the playlist.
     * This index could have changed because of items deleted from the playlist.
     */
    const calculateCurrentItemIndex = () => {
        // No deletion event to be handled, OR
        // an item other than current item got deleted
        if (lastDeleted == null || lastDeleted.key !== currentItemKey) {
            return getIndexForKeyInSelected(currentItemKey);
        }

        console.log("Playlist.calculateCurrentItemIndex: lastDeleted.key: " +
            lastDeleted.key + ", lastDeleted.index: " + lastDeleted.index);

        // The current item which was being played got deleted. So you can't just
        // look up the item's key in the playlist.
        if (currentItemKey === lastDeleted.key) {

            console.log("Playlist.calculateCurrentItemIndex: current item deleted");

            // If item was first in playlist, remain at the head of the list.
            if (lastDeleted.index === 0) {
                return 0;
            }

            // Otherwise, move to the next element, without exceeding the playlist
            return Math.min(lastDeleted.index + 1, playlist.length - 1);
        }
    }

    const onPlaylistEnded = () => {
        setIsPlaying(false);
    }

    useEffect(() => {
        if (playlist.length > 0 && currentItemKey === "-1"){

            if(localStorage.getItem("currentItemKey")) {
                let cachedCurrentItemKey = localStorage.getItem("currentItemKey");
                let idx = getIndexForKeyInSelected(cachedCurrentItemKey);
                if (idx !== -1 && idx < playlist.length) {
                    console.log("Playlist.useEffect([]): using cached currentItemKey: " + cachedCurrentItemKey);
                    setCurrentItemKey(cachedCurrentItemKey);
                }
            } else {
                console.log("Playlist.useEffect([]): setting currentItemKey: " + playlist[0].key);
                setCurrentItemKey(playlist[0].key);
            }
        }

        if (playlist.length > 0) {
            localStorage.setItem("playlist", JSON.stringify(playlist));
        }
    }, []);

    useEffect(() => {
        if (playlist.length === 0) {
            setCurrentItemKey("-1");
        } else if (currentItemKey === "-1"){
            console.log("Playlist.useEffect([JSON.stringify(selected)]):. " +
               " setting currentItemKey: " + playlist[0].key);

            setCurrentItemKey(playlist[0].key);
        } else {
            console.log("Playlist.useEffect(selected, lastDeleted): examining lastDeleted: "
                + JSON.stringify(lastDeleted));

            let currentIndex = calculateCurrentItemIndex();
            console.log("New currentITem Index: " + currentIndex);

            setCurrentItemKey(playlist[currentIndex].key);
        }

        localStorage.setItem("playlist", JSON.stringify(playlist));
    }, [JSON.stringify(playlist), JSON.stringify(lastDeleted)]);

    useEffect(() => {
        localStorage.setItem("currentItemKey", currentItemKey);
    }, [currentItemKey]);

    return (
        <Player
           items = {playlist}
           isPlaying = {isPlaying}
           setIsPlaying = {setIsPlaying}
           onPlaylistEnded = {onPlaylistEnded}
           currentItemKey = {currentItemKey}
           setCurrentItemKey = {setCurrentItemKey}
           removeFromPlaylist = {removeFromPlaylist}
           previewPopupRefs = {previewPopupRefs}
           paperPlayRefs = {paperPlayRefs}
           setPaperPlayRefs = {setPaperPlayRefs}
           isPlayingPaperPlays = {isPlayingPaperPlays}
           setIsPlayingPaperPlays = {setIsPlayingPaperPlays}
           subsRef = {subsRef}
         />
    );
}

export {Playlist};