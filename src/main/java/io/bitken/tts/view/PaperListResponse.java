package io.bitken.tts.view;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class PaperListResponse {

    private List<PaperInfo> pInfos = new ArrayList<>();

    @JsonProperty("total")
    private int total;

    @JsonProperty("from")
    private int from;

    @JsonProperty("count")
    private int count;

    @JsonProperty("categories")
    private List<String> categories;

    public PaperListResponse() {
        total = 0;
    }

    public void addPaperInfos(List<PaperInfo> pInfos) {
        this.pInfos.addAll(pInfos);
    }

    @JsonProperty("papers")
    public List<PaperInfo> getPInfos() {
        return pInfos;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }
}
