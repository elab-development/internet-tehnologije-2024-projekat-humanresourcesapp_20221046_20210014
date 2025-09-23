# HR App

**HR App** je moderna full-stack veb aplikacija za upravljanje ljudskim resursima, razvijena u React-u (frontend) i Laravel-u (backend) sa MySQL bazom podataka. Frontend koristi savremene UI obrasce, pretražive i filtrirajuće tabele, modal forme i vizuelne kartice za pregled podataka; backend izlaže REST API osiguran Laravel Sanctum autentikacijom i servisnim validacijama, dok se podaci čuvaju u relacijama (korisnici, plate, bonusi, platni listići). Aplikacija je zamišljena da bude pregledna, brza i praktična za svakodnevni HR rad, uz jasno razdvojene odgovornosti klijenta i servera.

![Logo](./human-resources-frontend-app/src/components/images/logo.png)

## Pregled
**HR App** je moderna **full-stack** veb aplikacija za upravljanje ljudskim resursima, razvijena u **React** (frontend) + **Laravel** (backend) uz **MySQL** bazu. Klijent komunicira sa serverom preko **REST API** sloja zaštićenog **Laravel Sanctum** autentikacijom, dok se podaci čuvaju u relacijama: **korisnici**, **plate (salaries)**, **bonusi (bonuses)** i **platni listići (payslips)**.

## Uloge korisnika
- **Neulogovani korisnik** – pristupa samo javnim stranicama (**Login**, **Register**).
- **Ulogovani zaposleni** – vidi **lični profil**, **svoje plate**, **svoje bonuse** i **svoje platne listiće**; može ažurirati **ime**, **pol** i **datum rođenja**.
- **HR radnik** – ima administrativne privilegije nad svim entitetima (globalni pregled, **kreiranje**, **izmena**, **brisanje**).

## Funkcionalnosti po ulozi
- **Zaposleni**
  - Pregled **profila** (pozicija, email, pol, početak ugovora).
  - Pregled **mojih plata/bonusa/platnih listića** preko zaštićenih ruta (*my-salary*, *my-bonuses*, *my-payslips*).
  - Ažuriranje profila preko **PATCH** rute **/profile/update** (samo: **name**, **gender**, **date_of_birth**).
- **HR radnik**
  - Upravljanje **platama**: **create**, **delete**, i ciljano **PATCH** ažuriranje **/salaries/{salary}/updateCurrencyAndAmount** (samo **amount** i **currency**).
  - Upravljanje **bonusima**: **create**, **delete**, i **PATCH** **/bonuses/{bonus}/updateReasonAndAmount** (samo **amount** i **reason** iz definisanog combo box-a).
  - Kreiranje **platnih listića** koji sabiraju **platu + bonus** za isti mesec, sa **issue_date** na kraj meseca.
  - **CSV izvoz** svih platnih listića preko rute **GET /payslips/export/csv**.

## Arhitektura i API
- **Backend: Laravel**
  - Kontroleri (Users, Salaries, Bonuses, Payslips), **Resource** klase za ujednačen JSON izlaz.
  - Jasno odvojene **HR** administrativne rute od **worker** self-service ruta.
  - Validacije request-ova, autorizacija preko **Auth** i provera **isHr** polja.
- **Frontend: React**
  - Reusable **Table** komponenta (globalna pretraga, filter, sortiranje, akcije).
  - **Modal** forme za **Create / Edit**, optimizovane PATCH tokove za ciljane izmene.
  - Dashboard kartice sa stavkama **najbližim današnjem datumu** i mapa/vreme widgeti.

## UI/UX
- Tamna tema sa **crno-belim invert hoverom** na redovima tabela i brend paletom (**crvena #D6232A**).
- Kartice: **Salaries**, **Bonuses**, **Payrolls**, **Users** sa brojčanim indikatorima.
- Motivacioni citat iz **dummy JSON** API-ja preko custom hook-a **useRandomQuote** (dugme **New Quote**).

## Baza podataka
- **MySQL** relacije: **users**, **salaries**, **bonuses**, **payslips** (+ FK veze).
- Migracije i seeder-i postavljaju šemu i početne podatke; decimalna preciznost prilagođena za finansije.

## Bezbednost i pravila pristupa
- **Laravel Sanctum** za autentikaciju (token u **sessionStorage** na klijentu).
- Autorizacija po ulozi (**HR** vs **Worker**) na nivou kontrolera.
- **PATCH-only** tokovi za ciljane izmene: **samo potrebna polja**, bez rizika od neželjenih update-a.


## Instalacija i pokretanje
---------------------------

1. Klonirajte repozitorijum:
```bash
    git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-humanresourcesapp_20221046_20210014.git
```
2. Pokrenite backend:
```bash
   cd human-resources-app
   composer install
   php artisan migrate:fresh --seed
   php artisan serve
```
    
3. Pokrenite frontend:
```bash
   cd human-resources-frontend-app
   npm install
   npm start
```
    
4.  Frontend pokrenut na: [http://localhost:3000](http://localhost:3000) Backend API pokrenut na: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)