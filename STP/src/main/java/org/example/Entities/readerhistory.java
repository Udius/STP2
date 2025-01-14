package org.example.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@Entity(name="readerhistory")
public class readerhistory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private Integer isbn;
    private Date date;
    private Integer id_reader;

    public readerhistory() {}
    public  readerhistory(Integer isbn, Date date, Integer id_reader) {
        this.isbn = isbn;
        this.date = date;
        this.id_reader = id_reader;
    }
}
