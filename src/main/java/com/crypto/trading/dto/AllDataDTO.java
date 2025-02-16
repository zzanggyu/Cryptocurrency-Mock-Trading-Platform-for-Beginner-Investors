package com.crypto.trading.dto;

import lombok.Data;
import java.util.List;

import com.crypto.trading.domain.*;

@Data
public class AllDataDTO {
    private List<Coin> weeklyTrends;
    private List<Asset> assetInfo;
    private List<Market> marketData;
    private List<Buying> buyingRank;
    private List<Selling> sellingRank;
}
