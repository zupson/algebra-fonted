const btnClick = document.querySelector("#logout");
const fetchedDataList = document.querySelector("#fetched-data-list");
const searchBar = document.querySelector("#search-bar");
const secondTableContent = document.querySelector(".table2");

let fetchedDataArr = []; // prazno polje u koje cmeo spremati, let- sluzi za referenciranje na neki element u kodu
let transferredDataSet = new Set();

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (token === null) {
        location.replace("login.html");
        return;
    }

    const loadSubjects = fetch(
        "https://www.fulek.com/data/api/supit/curriculum-list/hr",
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token, //iza Barer mora biti razmak koji je isto u navodnicima inavce nece raditi!!!!!
            },
        }
    )
        .then(function (loadSubjects) {
            if (!loadSubjects.ok) {
                throw new Error("Response error" + loadSubjects.status);
            }
            return loadSubjects.json();
        })
        .then(function (data) {
            if (data.isSuccess === true && data.data) {
                console.log(data);
                //ovje ce se loaudati predmeti
                fetchedDataArr = data.data; // Ažuriranje varijable s podacima s poslužitelja
                console.log(fetchedDataArr);
                
            } else {
                alert("Login failed, try again");
            }
        })
        .catch(function (error) {
            console.error(error);
        });

    btnClick.addEventListener("click", function () {
        logout();
        // const deletedRow = target.closest("tr");
        // const kolegij = deletedRow.querySelector("td:first-child").textContent;
    
        // // Uklanjamo "obrisani" objekt iz Seta
        // transferredDataSet.forEach((objekt) => {
        //     if (objekt.kolegij === kolegij) {
        //         transferredDataSet.delete(objekt);
        //     }
        // });
    });

    searchBar.addEventListener("keypress", Search);

    // fetchedDataList.addEventListener("click", onSelectedRow);

    secondTableContent.addEventListener("click", function (event) {
        onDeleteRow(event);
        // transferredDataSet.location.reload();
    });

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

   
    function displaySelectedRow(selectedRowData) {
        const selectedRowDetails = document.getElementById("added-data-list");

        // const rowId = selectedRowData.id;
        const htmlRowsInSecondTable = `
            <tr>

                <td>${selectedRowData.kolegij }</td>
                <td>${selectedRowData.ects }</td>
                <td>${selectedRowData.predavanja}</td>
                <td>${selectedRowData.vjezbe}</td>
                <td>${selectedRowData.sati}</td>
                <td>${selectedRowData.semestar}</td>
                <td>${selectedRowData.tip}</td>
                <td><button class="deleteBtn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
              </svg> Delete</button>   </td>
            
            </tr>`;
        // onclick={delete(${selectedRowData.id})}

        const htmlTable = "<table>" + htmlRowsInSecondTable + "</table>";

        selectedRowDetails.innerHTML += htmlTable;
    }

    function Search(event){
        if (event.key === "Enter") {
            // Dohvaćanje unosa korisnika
            const searchQuery = searchBar.value.trim().toLowerCase();
    
            // Provjera praznog unosa
            if (searchQuery === "") {
                alert("Unesite pojam za pretragu.");
                return;
            }

             // Pretraga podataka za točan rezultat koji odgovara unesenoj vrijednosti
            const FirstResult = fetchedDataArr.find((item) =>
                item.kolegij.toLowerCase() === searchQuery
            );
    
            // Provjera je li pronađen točan rezultat
            if (FirstResult) {

                // Provjera je li rezultat već prebačen
                if (!transferredDataSet.has(FirstResult)) {
                    transferredDataSet.add(FirstResult);
                    displaySelectedRow(FirstResult);
                    console.log("search bar > transferredDataSet: ", transferredDataSet);
                } else {
                    alert("Kolegij je već dodan.");
                }
            } else {
                alert("Nema rezultata za uneseni pojam.");
            }
        }
    }

    function onDeleteRow(event) {

        if (!event.target.classList.contains("deleteBtn")) {
            return;
        }
        
        const deletedRow = event.target.closest("tr");
        console.log("deleted row: ",deletedRow);

        const kolegij = deletedRow.querySelector("td:first-child").textContent; // Dobivanje imena kolegija iz prve ćelije
        console.log("kolegij: ",kolegij);

        // Iteriranje kroz Set i brisanje objekta koji ima odgovarajući kolegij
        transferredDataSet.forEach((objekt) => {
            if (objekt.kolegij === kolegij) {
                transferredDataSet.delete(objekt);
            }
        });
    
        // Uklanjanje redka iz HTML-a
        deletedRow.remove();

        console.log("onDeletedRow funkcija:",transferredDataSet);
    }
});

