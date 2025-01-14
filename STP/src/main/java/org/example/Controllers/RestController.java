package org.example.Controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import lombok.SneakyThrows;

import org.example.Entities.reader;
import org.example.Entities.book;
import org.example.Entities.readerhistory;
import org.example.Repositories.readerRepo;
import org.example.Repositories.bookRepo;
import org.example.Repositories.readerhistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.text.SimpleDateFormat;
import java.sql.SQLException;
import java.util.Map;

@org.springframework.web.bind.annotation.RestController
@Setter
@Getter
public class RestController {
    @Autowired
    private readerRepo readerRep;
    @Autowired
    private bookRepo bookRep;
    @Autowired
    private readerhistoryRepo readerhistoryRep;
    @GetMapping("/getAll_reader")
    public ResponseEntity<Iterable<reader>> getAllReaders() {
        Iterable<reader> readers = readerRep.findAll();
        return new ResponseEntity<>(readers, HttpStatus.OK);
    }

    @GetMapping("/getAll_book")
    public ResponseEntity<Iterable<book>> getAllBooks() {
        Iterable<book> books = bookRep.findAll();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/getAll_readerhistory")
    public ResponseEntity<Iterable<readerhistory>> getAllReadersHistory() {
        Iterable<readerhistory> readersHistory = readerhistoryRep.findAll();
        return new ResponseEntity<>(readersHistory, HttpStatus.OK);
    }

    @PostMapping("/insert/reader")
    public ResponseEntity<?> insertReaderRow(@RequestBody JsonNode jsonNode) {
        Map<String, String> newData = new ObjectMapper().convertValue(jsonNode, Map.class);

        reader r = new reader(newData.get("name"), newData.get("phone"));
        readerRep.save(r);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @SneakyThrows
    @PostMapping("/insert/book")
    public ResponseEntity<?> insertBookRow(@RequestBody JsonNode jsonNode) {
        Map<String, String> newData = new ObjectMapper().convertValue(jsonNode, Map.class);
        
        if (bookRep.findById(Long.parseLong(newData.get("isbn"))).getClass() != java.util.Optional.class) {
            throw new SQLException("Книга с указанным индивидуальным номером уже существует в базе данных");
        }
        book b = new book(Integer.parseInt(newData.get("isbn")), newData.get("title"), newData.get("author_l_name"),
                newData.get("author_f_name"), newData.get("author_p_name"), newData.get("year"));
        bookRep.save(b);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/insert/readerhistory")
    public ResponseEntity<?> insertReaderHistoryRow(@RequestBody JsonNode jsonNode) {
        Map<String, String> newData = new ObjectMapper().convertValue(jsonNode, Map.class);

        String dateString = newData.get("date");  // Замените на строку даты в соответствующем формате
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            // Шаг 1: Разобрать строку даты в объект java.util.Date
            java.util.Date utilDate = sdf.parse(dateString);
            // Шаг 2: Преобразовать java.util.Date в java.sql.Date
            java.sql.Date date = new java.sql.Date(utilDate.getTime());
            readerhistory rh = new readerhistory(Integer.parseInt(newData.get("isbn")), date, Integer.parseInt(newData.get("id_reader")));
            readerhistoryRep.save(rh);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/deleteRow/reader/{FKValue}")
    public ResponseEntity<?> deleteReaderRow(@PathVariable("FKValue") String FKValue) {
        readerRep.delete(readerRep.findById(Long.parseLong(FKValue)).get());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/deleteRow/book/{FKValue}")
    public ResponseEntity<?> deleteBookRow(@PathVariable("FKValue") String FKValue) {
        bookRep.delete(bookRep.findById(Long.parseLong(FKValue)).get());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/deleteRow/readerhistory/{FKValue}")
    public ResponseEntity<?> deleteReaderHistoryRow(@PathVariable("FKValue") String FKValue) {
        readerhistoryRep.delete(readerhistoryRep.findById(Long.parseLong(FKValue)).get());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/updateRow/reader/{FKValue}")
    public ResponseEntity<?> updateReaderRow(@RequestBody JsonNode jsonNode,
                                             @PathVariable("FKValue") String FKValue) {
        Map<String, String> newData = new ObjectMapper().convertValue(jsonNode, Map.class);
        reader r = readerRep.findById(Long.parseLong(FKValue)).get();

        r.setName(newData.get("name"));
        r.setPhone(newData.get("phone"));

        readerRep.save(r);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/updateRow/book/{FKValue}")
    public ResponseEntity<?> updateBookRow(@RequestBody JsonNode jsonNode,
                                           @PathVariable("FKValue") String FKValue) {
        Map<String, String> newData = new ObjectMapper().convertValue(jsonNode, Map.class);
        book b = bookRep.findById(Long.parseLong(FKValue)).get();
        book b_new = new book();

        b_new.setIsbn(Integer.parseInt(newData.get("isbn")));
        b_new.setTitle(newData.get("title"));
        b_new.setAuthor_l_name(newData.get("author_l_name"));
        b_new.setAuthor_f_name(newData.get("author_f_name"));
        b_new.setAuthor_p_name(newData.get("author_p_name"));
        b_new.setYear(newData.get("year"));
        
        bookRep.delete(b);
        bookRep.save(b_new);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/updateRow/readerhistory/{FKValue}")
    public ResponseEntity<?> updateReaderHistoryRow(@RequestBody JsonNode jsonNode,
                                                    @PathVariable("FKValue") String FKValue) {
        Map<String, String> newData = new ObjectMapper().convertValue(jsonNode, Map.class);
        readerhistory rh = readerhistoryRep.findById(Long.parseLong(FKValue)).get();

        rh.setId_reader(Integer.parseInt(newData.get("id_reader")));
        rh.setIsbn(Integer.parseInt(newData.get("isbn")));

        String dateString = newData.get("date");  // Замените на строку даты в соответствующем формате
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            // Шаг 1: Разобрать строку даты в объект java.util.Date
            java.util.Date utilDate = sdf.parse(dateString);
            // Шаг 2: Преобразовать java.util.Date в java.sql.Date
            java.sql.Date date = new java.sql.Date(utilDate.getTime());
            rh.setDate(date);
            readerhistoryRep.save(rh);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getRow/reader/{FKValue}")
    public ResponseEntity<?> getRowReaders(@PathVariable("FKValue") String FKValue) {
        reader r = readerRep.findById(Long.parseLong(FKValue)).get();
        return new ResponseEntity<>(r, HttpStatus.OK);
    }

    @GetMapping("/getRow/book/{FKValue}")
    public ResponseEntity<?> getRowBooks(@PathVariable("FKValue") String FKValue) {
        book b = bookRep.findById(Long.parseLong(FKValue)).get();
        return new ResponseEntity<>(b, HttpStatus.OK);
    }
}
