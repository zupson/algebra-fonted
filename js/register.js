const btnClick = document.querySelector("#btn-register")
const username = document.querySelector("#username")
const password = document.querySelector("#password")

document.addEventListener("DOMContentLoaded", function () {

    console.log("I am ready!");

    btnClick.addEventListener("click", function (event) {
        event.preventDefault();//sprijecavamo defaultno slanje na server nego mi to radimo s JS
        //console.log("clicked")


        const loginData = {
            "username": username.value,
            "password": password.value
        };
        //console.log(user, password)

        const response = fetch("https://www.fulek.com/data/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })

            .then(function (response) {
                if (!response.ok) {
                    throw new Error("response error");
                }
                return response.json();

            })

            .then(function (data) {
                if (data.isSuccess === true) {
                    //console.log(data.data.token)//kad otvorimo dev toolse mozemo vidjeti da je jedan paremater vec data sto znaci da mu pristupamo kreko data i onda naš data i onda tek token
                    //console.log(data.data.username)
                    //localStorage.setItem("token", data.data.token)
                    //localStorage.setItem("user", data.data.username)

                    alert("Regitration successiful")
                    location.replace("login.html");

                } else {
                    alert("Register failed, try again")
                }
                //console.log(data)
            })
            .catch(function (error) {
                console.error("fetch error" + error);
                console.log("FAILURE");
            })
    });
});