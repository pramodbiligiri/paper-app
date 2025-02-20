package io.bitken.tts.view;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.bitken.tts.model.entity.PaperAudio;
import io.bitken.tts.model.entity.PaperCategory;
import io.bitken.tts.model.entity.PaperData;
import io.bitken.tts.model.entity.converter.IAudioFile;
import io.bitken.tts.model.entity.converter.LocalAudioFile;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class PaperInfo {

    private static final SimpleDateFormat sdf = new SimpleDateFormat("d MMM, yyyy");

    @JsonProperty
    // RISK: Exposing paper id to Client, for stats purposes
    private long paperId;

    @JsonProperty
    private String filename;

    @JsonProperty
    private String title;

    @JsonProperty
    private String pubDate;

    @JsonProperty
    private int duration;

    @JsonProperty
    private String key;

    @JsonProperty("abstract")
    private String abstractt;

    @JsonProperty
    private String link;

    @JsonProperty
    private String authors;

    @JsonProperty
    private List<String> categories;

    public void setPaperId(long paperId) {
        this.paperId = paperId;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPubDate(String pubDate) {
        this.pubDate = pubDate;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public void setAbstractt(String abstractt) {
        this.abstractt = abstractt;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public long getPaperId() {
        return paperId;
    }

    public String getFilename() {
        return filename;
    }

    public String getTitle() {
        return title;
    }

    public String getPubDate() {
        return pubDate;
    }

    public int getDuration() {
        return duration;
    }

    public String getKey() {
        return key;
    }

    public String getAbstractt() {
        return abstractt;
    }

    public String getLink() {
        return link;
    }

    public String getAuthors() {
        return authors;
    }

    public List<String> getCategories() {
        return categories;
    }

    public static PaperInfo from(PaperData pd) {
        PaperInfo pi = new PaperInfo();


        pi.setPaperId(pd.getId());
        pi.setTitle(pd.getTitle());

        List<PaperAudio> audios = pd.getAudio();
        PaperAudio audio = audios.get(audios.size() - 1);
        String fullPath = resolvePath(audio.getAudio());
        pi.setFilename(fullPath);

        Integer duration = audio.getDuration();
        pi.setDuration(duration == null ? 0 : duration);

        pi.setLink("https://arxiv.org/abs/" + pd.getArxivId());
        pi.setKey(pd.getArxivId());
        pi.setAuthors(pd.getAuthors());

        setCategories(pi, pd);

        setPubdate(pi, pd);

        pi.setAbstractt(pd.getAbstractt());

        return pi;
    }

    private static void setCategories(PaperInfo pi, PaperData pd) {
        pi.setCategories(
            pd.getCategories().stream().
            map(PaperCategory::getCategory).collect(Collectors.toList())
        );
    }

    private static void setPubdate(PaperInfo pi, PaperData pd) {
        Timestamp pubDate = pd.getPubDate();
        if (pubDate == null) {
            pi.setPubDate("");
        } else {
            pi.setPubDate(Long.toString(pubDate.getTime()/1000));
        }
    }

    private static String resolvePath(IAudioFile file) {
        if (file instanceof LocalAudioFile) {
            return "/file/" + file.getFilename();
        }

        return file.getFullPath();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaperInfo paperInfo = (PaperInfo) o;
        return paperId == paperInfo.paperId &&
                duration == paperInfo.duration &&
                Objects.equals(filename, paperInfo.filename) &&
                Objects.equals(title, paperInfo.title) &&
                Objects.equals(pubDate, paperInfo.pubDate) &&
                Objects.equals(key, paperInfo.key) &&
                Objects.equals(abstractt, paperInfo.abstractt) &&
                Objects.equals(link, paperInfo.link) &&
                Objects.equals(authors, paperInfo.authors) &&
                Objects.equals(categories, paperInfo.categories);
    }

    @Override
    public int hashCode() {
        return Objects.hash(paperId, filename, title, pubDate, duration, key, abstractt, link, authors, categories);
    }

    @Override
    public String toString() {
        return "PaperInfo{" +
                "paperId=" + paperId +
                ", filename='" + filename + '\'' +
                ", title='" + title + '\'' +
                ", pubDate='" + pubDate + '\'' +
                ", duration=" + duration +
                ", key='" + key + '\'' +
                ", abstractt='" + abstractt + '\'' +
                ", link='" + link + '\'' +
                ", authors='" + authors + '\'' +
                ", categories=" + categories +
                '}';
    }
}