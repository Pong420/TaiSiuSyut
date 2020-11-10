export const Routes = {
  base_url: '/api',
  auth: {
    prefix: '/auth',
    login: '/login',
    logout: '/logout',
    registration: '/registration',
    refresh_token: '/refresh-token',
    modify_password: '/modify-password',
    delete_account: '/delete-account',
    cloudinary_sign: '/cloudinary/sign'
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
    delete_book: '/:id',
    public_book: '/:id/public',
    finish_book: '/:id/finish'
  },
  chapter: {
    prefix: '/book/:bookID/chapters',
    create_chapter: '',
    get_chapters: '',
    get_chapter: '/:chapterID',
    update_chapter: '/:chapterID',
    delete_chapter: '/:chapterID'
  },
  payment: {
    prefix: '/payment',
    get_payments: '',
    create_payment: '',
    update_payment: '/:id'
  }
};
