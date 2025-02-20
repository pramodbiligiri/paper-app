import React, {useState, useRef, useEffect} from 'react';
import {Playlist} from "./Playlist";
import {AppHeader} from './AppHeader';
import {Footer} from './Footer';
import {Item} from './Item';
import {MainContentArea} from './MainContentArea';

const PaperList = (props) => {

    const [playlist, setPlaylist] = useState(localStorage.getItem("playlist") ? JSON.parse(localStorage.getItem("playlist")) : []);
    const lastDeleted = useRef(null);

    const [previewPopupRefs, setPreviewPopupRefs] = useState([]);

    // Is playing related for player
    const [isPlaying, setIsPlaying] = useState(false);

    // Is playing related for paperlist
    const [paperPlayRefs, setPaperPlayRefs] = useState([]);
    const [isPlayingPaperPlays, setIsPlayingPaperPlays] = useState([]);

    const subsRef = useRef(null);

    const getItem = (items, itemKey) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key === itemKey) {
                return items[i];
            }
        }

        return null;
    }

    const addToPlaylist = (items, itemKey) => {
        let item = getItem(items, itemKey);
        if (item == null) {
            return;
        }

        let newItem = new Item (
            {
                url: item.url,
                paperId: item.paperId,
                title: item.title,
                duration: item.duration,
                key: item.key,
                authors: item.authors,
                pubDate: item.pubDate,
                link: item.link,
                abstract: item.abstract,
                categories: item.categories
            }
        );

        setPlaylist(current => [...current, newItem]);
    }

    const removeFromPlaylist = (e, itemIndex) => {
        lastDeleted.current = {index: itemIndex, key: playlist[itemIndex].key};
        setPlaylist(current => current.filter((s, index) => index !== itemIndex));
    }

    useEffect(() => {
        return (() => {
            lastDeleted.current = null;
        });
    });

    console.log("PaperList");

    return (
        <>
            <AppHeader />

            <Playlist
                playlist = {playlist}
                isPlaying = {isPlaying}
                setIsPlaying = {setIsPlaying}
                lastDeleted = {lastDeleted.current}
                removeFromPlaylist = {removeFromPlaylist}
                previewPopupRefs = {previewPopupRefs}
                paperPlayRefs = {paperPlayRefs}
                setPaperPlayRefs = {setPaperPlayRefs}
                isPlayingPaperPlays = {isPlayingPaperPlays}
                setIsPlayingPaperPlays = {setIsPlayingPaperPlays}
                subsRef = {subsRef}
            />

            <MainContentArea
                playlist = {playlist}
                isPlaying = {isPlaying}
                setIsPlaying = {setIsPlaying}
                addToPlaylist = {addToPlaylist}
                removeFromPlaylist = {removeFromPlaylist}
                previewPopupRefs = {previewPopupRefs}
                setPreviewPopupRefs = {setPreviewPopupRefs}
                paperPlayRefs = {paperPlayRefs}
                setPaperPlayRefs = {setPaperPlayRefs}
                isPlayingPaperPlays = {isPlayingPaperPlays}
                setIsPlayingPaperPlays = {setIsPlayingPaperPlays}
                subsRef = {subsRef}
            />

            <Footer />

        </>
    );
}

export {PaperList};