package com.crypto.trading.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.crypto.trading.entity.Asset;
import com.crypto.trading.repository.AssetRepository;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetRepository assetRepository;

    public AssetController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    /**
     * 자산 정보를 저장합니다.
     *
     * @param assets 자산 정보 리스트
     * @return 성공 메시지
     */
    @PostMapping
    public ResponseEntity<String> saveAssets(@RequestBody List<Asset> assets) {
       // 기존 데이터 삭제
       assetRepository.deleteAll();
       // 새 데이터 저장
       assetRepository.saveAll(assets);
       return ResponseEntity.ok("Assets data updated successfully!");
    }

    /**
     * 모든 자산 정보를 가져옵니다.
     *
     * @return 자산 정보 리스트
     */
    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        List<Asset> assets = assetRepository.findAll();
        return ResponseEntity.ok(assets);
    }

    /**
     * 특정 자산 정보를 ID로 가져옵니다.
     *
     * @param id 자산 ID
     * @return 자산 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        return assetRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
