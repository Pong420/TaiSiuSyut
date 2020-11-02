export const Routes = {
  base_url: '/api',
  auth: {
    prefix: '/auth',
    login: '/login',
    logout: '/logout',
    registration: '/registration',
    refresh_token: '/refresh-token',
    modify_password: '/modify-password',
    delete_account: '/delete-account'
  },
  user: {
    prefix: '/user',
    create_user: '',
    get_users: '',
    update_user: '/:id',
    delete_user: '/:id'
  },
  book: {
    prefix: '/book',
    create_book: '',
    get_books: '',
    get_book: '/:id',
    update_book: '/:id',
    delete_book: '/:id'
  },
  chapter: {
    prefix: '/book/:bookID/chapters',
    create_chapter: '',
    get_chapters: '',
    get_chapter: '/:chapterID',
    update_chapter: '/:chapterID',
    delete_chapter: '/:chapterID'
  }
};
