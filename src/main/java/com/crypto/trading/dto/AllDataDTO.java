package com.crypto.trading.dto;

import java.util.List;

import com.crypto.trading.entity.Asset;
import com.crypto.trading.entity.Buying;
import com.crypto.trading.entity.Coin;
import com.crypto.trading.entity.Market;
import com.crypto.trading.entity.Selling;

import lombok.Data;

@Data
public class AllDataDTO {
    private List<Coin> weeklyTrends;
    private List<Asset> assetInfo;
    private List<Market> marketData;
    private List<Buying> buyingRank;
    private List<Selling> sellingRank;
}
