function doLogin(){
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  // Counts this browser as one real signup, once — read by the Admin Panel's
  // "Total users" stat. Demo-only (localStorage), no real backend yet.
  if (!localStorage.getItem('idama_seller_registered')) {
    var count = parseInt(localStorage.getItem('idama_user_count') || '0', 10);
    localStorage.setItem('idama_user_count', String(count + 1));
    localStorage.setItem('idama_seller_registered', 'true');
  }
}
function doLogout(){
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
}
document.querySelectorAll('.tab-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
    document.querySelectorAll('.panel-section').forEach(function(s){s.classList.remove('active');});
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});
function toggleCategoryFields(){
  var cat = document.getElementById('category').value;
  document.querySelectorAll('.type-field').forEach(function(f){
    var cats = f.dataset.cat.split(' ');
    f.classList.toggle('is-open', cats.indexOf(cat) !== -1);
  });
}
