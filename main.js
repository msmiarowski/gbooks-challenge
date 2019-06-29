
const key = 'AIzaSyDsG5Z1xQo0SjJOzN9D0fv1Exe1oEOTdV4'; 

// Renders an error message
function showError(msg) {
  const html = `<li><p class="error">${msg}</p></li>`;
  document.querySelector('#results').innerHTML = html;
}

// Searches for books and returns a promise that resolves a JSON list
function searchForBooks() {
  let search = document.querySelector('#search-bar').value;    // save value of search bar
  const URL = 'https://www.googleapis.com/books/v1/volumes/?q=';    // URL to search
  const maxResults = '&maxResults=10';
  let searchGBooks = `${URL}${search}${maxResults}`;    // google books api + search value

  // set up JSON request
  let request = new XMLHttpRequest();
  request.open('GET', searchGBooks, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      let data = JSON.parse(request.responseText);    // Success! here is the JSON data
      render(data);
    } else {
      showError('No matches meet your search. Please try again');    // reached the server but it returned an error
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send();
}

// Generate HTML and sets #results's contents to it
let renderedBooks = []; 
function render(data) {
  data.items.forEach(function(item) {
    if(renderedBooks.includes(item.id)){
      return;
    }
    renderedBooks.push(item.id);

    const coverImage = item.volumeInfo.imageLinks.thumbnail;   
    const title = item.volumeInfo.title;  
    const infoLink = item.volumeInfo.infoLink; 
    // subtitle
    let subTitle = item.volumeInfo.subtitle;
    if( subTitle ){
      subTitle += `<span class="sub-title">: ${subTitle}</span>'`;
    } 
    // authors array
    const authors = item.volumeInfo.authors;    
    let authorHTML = '';
    if(!authors){
      authorHTML += '<li>Author Unknown</li>';
    } else {
      authors.forEach(function(author){
        authorHTML += `<li>${author}</li>`;
      });
    }
     
    // creating html layout of book info
    const bookList = `
      <a href="${infoLink}"><img src="${coverImage}" alt="${title}" class="thumb" /></a>
      <div class="details">
        <h3 class="title">Title:</h3>
        <h4 class="title">${title}${subTitle}</h4>
        <h3 class="author">Author(s):</h3>
        <ul class="authors">${authorHTML}</ul>
        <a href="${infoLink}" title="more information about ${title}" class="more">More info about this book</a>
      </div>
    `;

    const listItem = document.createElement('LI');    // Create an <li>
    listItem.innerHTML = bookList;    // push book data to <li>
    listItem.setAttribute('class', 'book-info');   // add class
    listItem.setAttribute('data-gbid', item.id );   // add data attribute
    
    // document.querySelector('#results').appendChild(listItem);    // add <li> to <ul>
    const resultsUL = document.querySelector('#results');
    resultsUL.insertBefore(listItem, resultsUL.firstChild);
  });

  // add an LI to show the user what they searched for.
  const searchVal = document.querySelector('#search-bar').value;
  const userSearch = document.createElement('LI');    // Create an <li>
  userSearch.setAttribute('class', 'user-search');
  userSearch.innerHTML = `<h2>Books matching your search for: <span>${searchVal}</span></h2>`;    // push book data to <li>
  const resultsUL = document.querySelector('#results');
  resultsUL.insertBefore(userSearch, resultsUL.firstChild);
}

// hit the enter button to do a search
let input = document.querySelector('#search-bar');

input.addEventListener('keydown', function(e){
  if(e.keyCode == 13) {
    searchForBooks();
  } 
});

document.querySelector('#search-btn').addEventListener('click', searchForBooks, false);   // search button press to get results
document.querySelector('#search-bar').value = '';  // clear value of input on page refresh

