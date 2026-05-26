const form = document.getElementById("contactForm");

form.addEventListener("submit", function(event){

  event.preventDefault();

  alert("Mensagem enviada com sucesso!");

  form.reset();
});