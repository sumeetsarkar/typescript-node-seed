import { Response } from 'express';

const FILE_EXTENSION_REGEX = /\.([a-z]+)$/;
const DAYS = 365;
const AGE = DAYS * 86400;

export const staticOptions = {
  dotfiles: 'ignore',
  index: false,
  redirect: false,
  setHeaders(res: Response, path: string) {
    const fileExtension = FILE_EXTENSION_REGEX.exec(path);
    if (!fileExtension) {
      return;
    }
    const extension = fileExtension[1];
    if (extension === 'html') {
      res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.set('Expires', '-1');
      res.set('Pragma', 'no-cache');
      return;
    }
    res.set('x-timestamp', `${Date.now()}`);
    res.header('Cache-Control', `public, max-age=${AGE}`);
    res.removeHeader('ETag');
    res.removeHeader('Last-Modified');
  },
};
