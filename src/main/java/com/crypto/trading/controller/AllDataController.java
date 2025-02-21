package com.crypto.trading.controller;

import com.crypto.trading.dto.AllDataDTO;
import com.crypto.trading.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api")
public class AllDataController {
   
   private final CoinRepository coinRepository;
   private final AssetRepository assetRepository;
   private final MarketRepository marketRepository;
   private final BuyingRepository buyingRepository;
   private final SellingRepository sellingRepository;

   public AllDataController(
           CoinRepository coinRepository,
           AssetRepository assetRepository,
           MarketRepository marketRepository,
           BuyingRepository buyingRepository,
           SellingRepository sellingRepository) {
       this.coinRepository = coinRepository;
       this.assetRepository = assetRepository;
       this.marketRepository = marketRepository;
       this.buyingRepository = buyingRepository;
       this.sellingRepository = sellingRepository;
   }

   @PostMapping("/all-data")
   @Transactional
   public ResponseEntity<String> saveAllData(@RequestBody AllDataDTO allData) {
       try {
           System.out.println("받은 데이터: " + allData);  // 데이터 확인

           if (allData.getWeeklyTrends() != null) {
               System.out.println("주간 상승률 데이터 크기: " + allData.getWeeklyTrends().size());
               coinRepository.deleteAll();
               coinRepository.saveAll(allData.getWeeklyTrends());
           }
           
           if (allData.getAssetInfo() != null) {
               System.out.println("자산 정보 데이터 크기: " + allData.getAssetInfo().size());
               assetRepository.deleteAll();
               assetRepository.saveAll(allData.getAssetInfo());
           }
           
           if (allData.getMarketData() != null) {
               System.out.println("시가총액 데이터 크기: " + allData.getMarketData().size());
               marketRepository.deleteAll();
               marketRepository.saveAll(allData.getMarketData());
           }
           
           if (allData.getBuyingRank() != null) {
               System.out.println("매수 순위 데이터 크기: " + allData.getBuyingRank().size());
               buyingRepository.deleteAll();
               buyingRepository.saveAll(allData.getBuyingRank());
           }
           
           if (allData.getSellingRank() != null) {
               System.out.println("매도 순위 데이터 크기: " + allData.getSellingRank().size());
               sellingRepository.deleteAll();
               sellingRepository.saveAll(allData.getSellingRank());
           }

           return ResponseEntity.ok("모든 데이터 저장 성공");
       } catch (Exception e) {
           e.printStackTrace();  // 상세 에러 로그 출력
           return ResponseEntity.internalServerError()
               .body("데이터 저장 실패: " + e.getMessage() + "\n" + e.getCause());
       }
   }

   @GetMapping("/all-data")
   public ResponseEntity<AllDataDTO> getAllData() {
       try {
           AllDataDTO allData = new AllDataDTO();
           allData.setWeeklyTrends(coinRepository.findAll());
           allData.setAssetInfo(assetRepository.findAll());
           allData.setMarketData(marketRepository.findAll());
           allData.setBuyingRank(buyingRepository.findAll());
           allData.setSellingRank(sellingRepository.findAll());

           return ResponseEntity.ok(allData);
       } catch (Exception e) {
           e.printStackTrace();  // 상세 에러 로그 출력
           return ResponseEntity.internalServerError().build();
       }
   }
}