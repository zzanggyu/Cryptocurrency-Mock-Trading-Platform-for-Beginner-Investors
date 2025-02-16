package com.crypto.trading.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Asset {
    @Id
    private Long id;

    private String name;
    private String weeklyGain;
    private String monthlyGain;
    private String threemonthGain;
    private String sixmonthGain;
    private String yearlyGain;
}
