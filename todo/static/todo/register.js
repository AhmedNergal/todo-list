document.addEventListener("DOMContentLoaded", () => {

    let password = document.querySelector("#password");
    let passwordConfirmation = document.querySelector("#confirm-password");
    let passwordMatching = document.querySelector("#password-matching");
    let submit = document.querySelector("#submit");

    passwordConfirmation.addEventListener("input", () => {
        
        if (passwordConfirmation.value === ""){
            passwordMatching.innerHTML = "";
        }

        if (passwordConfirmation.value !== password.value && passwordConfirmation.value !== ""){
            passwordMatching.innerHTML = "Passwords don't match!!!";
            submit.disabled = true;
        } else if (passwordConfirmation.value === password.value) {
            passwordMatching.innerHTML = "Passwords Match!!!";
            submit.disabled = false;
        }
    });
});