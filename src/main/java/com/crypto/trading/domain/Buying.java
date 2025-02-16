package com.crypto.trading.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Buying {
    @Id
    private Long id;

    private String title;
    
    @Column(name = "change_percent")
    private String changePercent;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
}