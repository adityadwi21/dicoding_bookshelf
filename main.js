//aditdw21

document.addEventListener("DOMContentLoaded", function () {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const bookForm = document.getElementById("bookForm");
  const bookFormSubmitButton = document.getElementById("bookFormSubmit");
  const searchBookForm = document.getElementById("searchBook");
  const searchBookInput = document.getElementById("searchBookTitle");

  let editingBookId = null;

  // Fungsi untuk memuat buku dari localStorage
  function loadBooks(books = JSON.parse(localStorage.getItem("books")) || []) {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      const bookItem = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookItem);
      } else {
        incompleteBookList.appendChild(bookItem);
      }
    });
  }

  // Fungsi untuk menyimpan buku ke localStorage
  function saveBooks(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  // Fungsi untuk membuat elemen buku
  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;
    return bookItem;
  }

  // Fungsi untuk menambahkan buku baru
  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const book = {
      id: editingBookId || new Date().getTime(),
      title,
      author,
      year: Number(year),
      isComplete,
    };

    const books = JSON.parse(localStorage.getItem("books")) || [];

    if (editingBookId) {
      // Jika sedang mengedit, perbarui buku yang ada
      const index = books.findIndex((b) => b.id === editingBookId);
      books[index] = book;
    } else {
      // Jika menambahkan buku baru
      books.push(book);
    }

    saveBooks(books);
    loadBooks(books);

    // Clear form input dan reset ke mode tambah
    bookForm.reset();
    editingBookId = null; // Reset ID yang sedang diedit
    bookFormSubmitButton.textContent = "Masukkan Buku ke rak Belum selesai dibaca";
  });

  // Event delegation untuk tombol "Selesai dibaca", "Hapus Buku", dan "Edit Buku"
  document.body.addEventListener("click", function (e) {
    const target = e.target;
    const bookItem = target.closest('[data-testid="bookItem"]');
    const bookId = bookItem ? bookItem.getAttribute("data-bookid") : null;

    if (!bookId) return;

    const books = JSON.parse(localStorage.getItem("books")) || [];

    if (target.matches('[data-testid="bookItemDeleteButton"]')) {
      // Menghapus buku
      const updatedBooks = books.filter((book) => book.id != bookId);
      saveBooks(updatedBooks);
      loadBooks(updatedBooks);
    }

    if (target.matches('[data-testid="bookItemIsCompleteButton"]')) {
      // Memindahkan buku antara rak
      const book = books.find((book) => book.id == bookId);
      book.isComplete = !book.isComplete;
      saveBooks(books);
      loadBooks(books);
    }

    if (target.matches('[data-testid="bookItemEditButton"]')) {
      // Edit buku (pre-fill form with existing book data)
      const book = books.find((book) => book.id == bookId);
      document.getElementById("bookFormTitle").value = book.title;
      document.getElementById("bookFormAuthor").value = book.author;
      document.getElementById("bookFormYear").value = book.year;
      document.getElementById("bookFormIsComplete").checked = book.isComplete;

      // Update the submit button to 'Update'
      bookFormSubmitButton.textContent = "Update Buku";

      // Set form to update instead of add
      editingBookId = book.id;
    }
  });

  // Fitur pencarian buku
  searchBookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchQuery = searchBookInput.value.toLowerCase();

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchQuery));

    loadBooks(filteredBooks);
  });

  // Muat buku dari localStorage saat halaman dimuat
  loadBooks();
});
