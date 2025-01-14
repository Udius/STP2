package org.example.Entities;

import java.sql.SQLException;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.SneakyThrows;

@Setter
@Getter
@Entity(name="book")
public class book {
    @Id
    //@GeneratedValue(strategy = GenerationType.UUID)
    private Integer isbn;
    @SneakyThrows
    public void setIsbn(Integer isbn) {
        if (isbn < 1) {
            throw new SQLException("Неверное значение индивидуального номера книги (меньше единицы)");
        }
        this.isbn = isbn;
    }
    private String title;
    private String author_l_name;
    private String author_f_name;
    private String author_p_name;
    private String year;

    public book() {}
    @SneakyThrows
    public book(Integer isbn, String title, String author_l_name, String author_f_name, String author_p_name, String year) {
        if (isbn < 1) {
            throw new SQLException("Неверное значение индивидуального номера книги (меньше единицы)");
        }
        this.isbn = isbn;
        this.title = title;
        this.author_l_name = author_l_name;
        this.author_f_name = author_f_name;
        this.author_p_name = author_p_name;
        this.year = year;
    }
}
