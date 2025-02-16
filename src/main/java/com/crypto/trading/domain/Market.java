package com.crypto.trading.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Market{
    @Id
    private Long id;
    
    @Column(name = "market_rank")
    private String rank;
    private String name;
    private String marketcap;
    private String transactionvalue;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
}
