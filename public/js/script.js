(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()
// Show Password
let input = document.getElementById("password");
  let checkbox = document.getElementById("show-password");
  checkbox.addEventListener("click",()=>{
    if(checkbox.checked){
    input.type = "text";
  }else{
    input.type = "password";
  }
  })