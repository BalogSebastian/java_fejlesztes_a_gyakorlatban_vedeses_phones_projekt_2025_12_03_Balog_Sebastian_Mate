package com.phoneshop.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor // Kell a JPA-nak
@AllArgsConstructor
@Entity
@Table(name = "_user") // FONTOS: A "user" szó foglalt az SQL-ben, ezért "_user"-nek nevezzük a táblát, hogy ne legyen hiba.
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) // Nem lehet két ugyanilyen nevű felhasználó
    private String username;

    @Column(unique = true, nullable = false) // Email is legyen egyedi
    private String email;

    @Column(nullable = false)
    private String password;    // Ezt majd titkosítva (hash-elve) tároljuk

    @Enumerated(EnumType.STRING)

    // Így szövegként (ADMIN, USER) menti be az adatbázisba, nem számként (0, 1)
    private Role role;

    // Itt a kapcsolat! Egy usernek lehet sok telefonja.
    // A "mappedBy" azt jelenti, hogy a kapcsolatot a Phone osztályban lévő "user" mező intézi.
    // A JsonIgnore azért kell, hogy ha lekérjük a usert, ne akarja végtelen ciklusban lekérni a telefonjait is visszafelé.
    // (Bár a DTO-k használata tisztább lesz később, most ez a gyors megoldás).


    @OneToMany(mappedBy = "user")
    private List<Phone> phones;
}