
let button = document.querySelector("#theme_btn");
let buttonstrt = document.querySelector("#zegarStart");
let buttonstop = document.querySelector("#zegarStop");
let filtr = document.querySelector("input#filtr");
const ile = document.querySelector("#ile_wyn");
const produkty = document.querySelectorAll(".karta");
const html = document.querySelector("#html");
const czas = document.querySelector("#czas");
const savedTheme = localStorage.getItem("theme");

const formularz = document.querySelector("form");
const select_product = document.querySelector("#prod");
const ilosc = document.querySelector("#ile");
const wartosc = document.querySelector("#wartosc");
const wiad = document.querySelector("#wiad");
const span_do_errora = document.querySelector("#error");
const podglad = document.querySelector("#podglad");


if (savedTheme == "light") {
    html.dataset.theme = "light";
    button.innerHTML = "Tryb Ciemny";
} else if (savedTheme == "dark") {
    html.dataset.theme = "dark";
    button.innerHTML = "Tryb Jasny";
} else if (savedTheme == null){
    localStorage.setItem("theme", "light");
}



button.addEventListener("click", zmiana = () => {
    if (html.dataset.theme == "light") {
        html.dataset.theme = "dark";
        button.innerHTML = "Tryb Jasny";
        button.ariaPressed = "true";
        localStorage.setItem("theme", "dark");
    }
    else  {
        html.dataset.theme = "light";
        button.innerHTML = "Tryb Ciemny";
        button.ariaPressed = "false";
        localStorage.setItem("theme", "light");
    }
});

if (czas != null) {
    let locale = new Intl.Locale("pl-PL");

    pisz_czas = () => {
        czas.innerHTML = (Intl.DateTimeFormat("pl-PL", {dateStyle: "full", timeStyle: "long", timeZone: locale.getTimeZones()}).format(Date.now()));
    }
    let interwal;
    interwal = setInterval(pisz_czas, 1000);

    buttonstop.addEventListener("click", stop = () => {
        clearInterval(interwal);
        interwal = null;
    });

    buttonstrt.addEventListener("click", wznow = () => {
        if (!interwal) {
            interwal = setInterval(pisz_czas, 1000);
        }
    });
}

if (filtr != null) {
    let ile_produk;
    filtr.addEventListener("input", filtruj = () => {
        ile_produk = 0;
        for (const produkt of produkty) {
            if (produkt.querySelector("h2").innerHTML.toLowerCase().includes(filtr.value.trim().toLowerCase()) == false) {
                produkt.hidden = true;
            } else {
                produkt.hidden = false;
            }
            if (produkt.hidden == false) {
                ile_produk++;
            }
            ile.innerHTML = ile_produk;
            if (ile_produk == 0) {
                ile.innerHTML = ile_produk + ", Nie znaleziono produktu";
            }
        }
        
    });
}

const produkty_i_ceny = [
    { id: "RAM", nazwa: "Kości RAM", cenaGrosze: 90000},
    { id: "Karta_Graficzna", nazwa: "Karta Graficzna", cenaGrosze: 439900},
    { id: "Dysk", nazwa: "Dysk SSD M.2", cenaGrosze: 65900}
];
const pln = new Intl.NumberFormat("pl-PL", {style:"currency", currency:"PLN"});
grosze_to_zloty = (grosze) => {
    return pln.format(grosze / 100);
}

oblicz = (cena, ilosc) => {
    return cena * ilosc;
}

hide_podglad = () => {
    podglad.hidden = true;
    podglad.innerHTML = '';
}


if (formularz != null) {
    walidacja_ilosci = () => {
        if (ilosc.value == '') {
            return {
                ok: false,
                kom: "Podaj ilość (1-5)"
            };
        }
       const liczba = Number(ilosc.value);
        if(!Number.isInteger(liczba)) {
            return {
                ok: false,
                kom: "Ilość musi być liczbą całkowitą"
            };
        }
        if (liczba < 1 || liczba > 5) {
            return {
                ok: false,
                kom: "Ilość musi być w zakresie od 1 do 5"
            };
        }
        return {
            ok: true,
            wartosc: liczba
        };
    }
    wartosc_zapytki = () => {
        const produkt = produkty_i_ceny.find((p) => p.id === select_product.value);
        if (!produkt) {
            wartosc.innerHTML = 'Wybierz produkt aby zobaczyć wartość';
            return;
        }
        const walidacja = walidacja_ilosci();
        if (!walidacja.ok) {
            wartosc.innerHTML = 'Podaj poprawną ilość aby zobaczyć wartosć';
            return;
        }
        wartosc.innerHTML = `Wartość zapytania: ${grosze_to_zloty(oblicz(produkt.cenaGrosze, walidacja.wartosc))}`;
    }
    select_product.addEventListener("change", () => {
        wartosc_zapytki();
        hide_podglad();
    });
    ilosc.addEventListener("input", () => {
        wartosc_zapytki();
        hide_podglad();
    });
    walidacja_wiad = () => {
        if(wiad.value.trim().length < 10) {
            return {
                ok: false,
                kom: 'Wiadomość musi mieć przynajmniej 10 znaków długości (nie licząc spacji)'
            };
        }
        return {
            ok: true,
            wartosc: wiad.value
        };
    }
    wiad.addEventListener("input", () => {
        if(span_do_errora.textContent) {
            const info_o_wal = walidacja_wiad();
            if (info_o_wal.ok) {
                span_do_errora.innerHTML = '';
                wiad.removeAttribute('aria-invalid');
            }
        }
        hide_podglad();
    });
    formularz.addEventListener("submit", (e) => {
        e.preventDefault();

        span_do_errora.innerHTML = '';
        wiad.removeAttribute('aria-invalid');
        
        const produkt = produkty_i_ceny.find((p) => p.id === select_product.value);
        if (!produkt) {
            select_product.focus();
            return;
        }

        const walid_ile = walidacja_ilosci();
        if (!walid_ile.ok) {
            ilosc.focus();
            wartosc.innerHTML = walidacja_ilosci.kom;
            return;
        }

        const walid_wiad = walidacja_wiad();
        if(!walid_wiad.ok) {
            span_do_errora.innerHTML = walid_wiad.kom;
            wiad.setAttribute("aria-invalid", 'true');
            wiad.focus();
            return;
        }

        const ile_prod = walid_ile.wartosc;
        const grosze = oblicz(produkt.cenaGrosze, ile_prod);
        const w_pln = grosze_to_zloty(grosze);

        podglad.innerHTML = '';
        let h2 = document.createElement("h2");
        h2.textContent = 'Podsumowanie';
        podglad.appendChild(h2);

        let lista = document.createElement("ul");

        let liProd = document.createElement("li");
        liProd.textContent = `Produkt: ${produkt.nazwa}`;
        lista.appendChild(liProd);

        let liIle = document.createElement("li");
        liIle.textContent = `Ilość: ${ile_prod}`;
        lista.appendChild(liIle);

        let liWart = document.createElement("li");
        liWart.textContent = `Wartość: ${w_pln}`;
        lista.appendChild(liWart);

        const liWiad = document.createElement("li");
        liWiad.textContent = `Wiadomość: ${walid_wiad.wartosc}`;
        lista.appendChild(liWiad);

        podglad.appendChild(lista);
        podglad.hidden = false;
    });
    wartosc_zapytki();
}
