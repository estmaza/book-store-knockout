// todo use promises

; var Storage = function () {
  var self = this;

  const titleKey = 'book-store-title';
  const authorKey = 'book-store-author';
  const bookKey = 'book-store-book'

  // returns all books and authors in json format
  self.get = function () {
    if (!localStorage.getItem(titleKey)) {
      restore();
    }
    let title = localStorage.getItem(titleKey);

    // into localStorage I will store separate pairs: book-store-author-id, book-store-book-id
    let authors = [];
    let books = [];

    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf(authorKey) !== -1) {
        authors.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      } else if (localStorage.key(i).indexOf(bookKey) !== -1) {
        books.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
      }
    }

    return JSON.stringify({
      success: true,
      data: {
        title: title,
        authors: authors,
        books: books
      }
    });
  };

  self.delete = function (id) {
    localStorage.removeItem(`${bookKey}-${id}`);
  };

  self.save = function (book) {
    if (book.id === 0) {
      // get new id
      let books = [];

      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf(bookKey) !== -1) {
          books.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
      }

      book.id = books[books.length - 1].id + 1;
    }

    localStorage.setItem(`${bookKey}-${book.id}`, JSON.stringify(book));
    return book.id;
  }

  let restore = function () {
    localStorage.setItem(titleKey, 'Book Store');

    for (let i = 0; i < data.authors.length; i++) {
      localStorage.setItem(`${authorKey}-${data.authors[i].id}`, JSON.stringify(data.authors[i]));
    }

    for (let i = 0; i < data.books.length; i++) {
      localStorage.setItem(`${bookKey}-${data.books[i].id}`, JSON.stringify(data.books[i]));
    }
  };

  const data = {
    'authors': [
      {
        id: 1,
        firstName: 'name1',
        lastName: 'sName1'
      },
      {
        id: 2,
        firstName: 'name2',
        lastName: 'sName2'
      },
      {
        id: 3,
        firstName: 'name3',
        lastName: 'sName3'
      },
      {
        id: 4,
        firstName: 'name4',
        lastName: 'sName4'
      }
    ],
    'books': [
      {
        id: 1,
        name: 'book1',
        authors: [1, 2],
        publishDate: '10/10/2010',
        rating: 7,
        pages: 742
      },
      {
        id: 2,
        name: 'book2',
        authors: [3, 4],
        publishDate: '11/11/2011',
        rating: 8,
        pages: 842
      },
      {
        id: 3,
        name: 'book3',
        authors: [1, 4],
        publishDate: '12/12/2012',
        rating: 9,
        pages: 942
      }
    ]
  };

  return self;
};
