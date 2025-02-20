import {Link, Button, Table, TableBody, TableCell, TableRow} from '@material-ui/core';
import {PaperCategories} from "./PaperDisplayHelpers";
import {PaperBasicActions} from "./PaperBasicActions";
import {getDisplayStrFromEpochSec} from "./Utils";
import React, {useState} from 'react';
import {useMediaPredicate} from 'react-media-hook';

const PaperListMain = (props) => {

    const {items, playlist, isPlaying, setIsPlaying, addToPlaylist, removeFromPlaylist,
           paperPlayRefs, isPlayingPaperPlays, setIsPlayingPaperPlays, previewRefs, hidePreviews, setHidePreviews,
        inPopup, previewPopupRefs} = props;

    const getIndexOfItemInPlaylist = (itemKey) => {
        for (let i = 0; i < playlist.length; i++) {
            if (itemKey === playlist[i].key) {
                return i;
            }
        }

        return -1;
    }

    const getTableRows = () => {
        const tableRows = [];

        for (let i = 0; i < items.length; i = i + 1) {
            let indexOfItemInPlaylist = getIndexOfItemInPlaylist(items[i].key);

            let actionLink;
            if (indexOfItemInPlaylist !== -1) {
                actionLink = <span className="paperActionDelWrap"><Link className="paperActionDel"
                    onClick={(e) => removeFromPlaylist(e, indexOfItemInPlaylist)}>Remove from playlist</Link></span>;
            } else {
                actionLink = <Button className="paperAction" variant="outlined"
                    onClick={() => addToPlaylist(items, items[i].key)}>Add to Playlist</Button>;
            }

            tableRows.push(
                <TableRow>
                    <TableCell className="paperDisplay">

                      <PaperBasicInfo paper = {items[i]} />

                      <PaperBasicActions
                          items = {items}
                          index = {i}
                          actionLink = {actionLink}
                          paperPlayRefs = {paperPlayRefs}
                          isPlayingPaperPlays = {isPlayingPaperPlays}
                          setIsPlayingPaperPlays = {setIsPlayingPaperPlays}
                          previewRefs = {previewRefs}
                          hidePreviews = {hidePreviews}
                          setHidePreviews = {setHidePreviews}
                          inPopup = {inPopup}
                          previewPopupRefs = {previewPopupRefs}
                          isPlaying = {isPlaying}
                          setIsPlaying = {setIsPlaying}
                      />
                    </TableCell>
                </TableRow>
             );
        }

        return tableRows;
    }

    return (
        <Table className="playlist">
          <TableBody>
            {getTableRows()}
          </TableBody>
        </Table>
    );
}

const PaperBasicInfo = (props) => {

    const {paper} = props;

    return (
        <>
          <div className="paperTitleRow">
            <span className="paperSource">{getDisplayStrFromEpochSec(parseInt(paper.pubDate, 10))}</span>
            <span className="sourceAuthorSeparator">&#8211;</span>
            <span className="paperTitle">{paper.title}</span>
            <PaperCategories categories={paper.categories} />
          </div>
          <div className="paperMeta">
            <AuthorView authors={paper.authors} />
          </div>
        </>
    );
}

const AuthorView = (props) => {

    const {authors} = props;
    const isMediumPlusSize = useMediaPredicate("(min-width: 600px)");
    const truncLength = isMediumPlusSize ? 100 : 45;
    const [showFull, setShowFull] = useState (authors.length < truncLength ? true : false);

    if (showFull) {
        return (
          <span className="paperAuthors">{authors}</span>
        );
    }

    return (
      <span onClick={e => setShowFull(true)} className="paperAuthors">
        {authors.substring(0, truncLength)}
        <Link color="inherit" onClick={f=>f} className="paperAuthorsEllipsis">...</Link>
      </span>
    );
}

export {PaperListMain};