function handleNavigation(evt) {
  evt.preventDefault();
  console.log($(this).attr('href').replace('/', ''));
}