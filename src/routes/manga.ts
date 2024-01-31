import { Router, Request, Response, NextFunction } from 'express';
import { Cover, Manga } from 'mangadex-full-api';

class MangaRoute {
  router = Router();

  constructor() {
    this.router.get('/:id', this.getManga);
    this.router.get('/:id/chapters', this.getChapters);
  }

  private async getManga(req: Request, res: Response, next: NextFunction) {
    const manga = await Manga.get(req.params.id);
    const cover = await Cover.get(manga.mainCover.id);
    
    const parsedManga = {
        title: manga.title.en ?? manga.title,
        description: manga.description,
        status: manga.status,
        tags: manga.tags,
        mainCover: cover.url,
        authors: manga.authors,
        artists: manga.artists,
        lastChapter: manga.lastChapter,
        lastVolume: manga.lastVolume,
        publicationDemographic: manga.publicationDemographic
    }

    res.send(parsedManga);
  }

  private async getChapters(req: Request, res: Response, next: NextFunction) {
    const mangaFeed = await Manga.getFeed(req.params.id);

    res.send(mangaFeed);
  }

  getRouter() {
    return this.router;
  }
}

export default new MangaRoute().getRouter();
