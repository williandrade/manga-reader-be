import { Router, Request, Response, NextFunction } from 'express';
import { Cover, List, Manga } from 'mangadex-full-api';

class HomeRoute {
  router = Router();

  constructor() {
    this.router.get('/banners', this.getBannerStream);
    this.router.get('/', this.getCurrentSeason);
  }

  private async getBannerStream(req: Request, res: Response, next: NextFunction) {
    const obj = await Manga.search({
      includes: ['author', 'artist', 'cover_art'],
      order: { followedCount: 'desc' },
      contentRating: ['safe', 'suggestive'],
      hasAvailableChapters: true,
      createdAtSince: '2023-12-31T00:00:00',
      limit: 5,
    });
    res.send(
      await Promise.all(
        obj.map(async (manga) => {
          const cover = await Cover.get(manga.mainCover.id);
          return {
            id: manga.id,
            image: cover.url,
            text: manga.title.en ?? manga.title,
            subText: `${manga.publicationDemographic} - ${manga.status}`,
          };
        })
      )
    );
  }

  private async getCurrentSeason(req: Request, res: Response, next: NextFunction) {
    const list = await List.get('1cc30d64-45c6-45a6-8c45-3771e1933b0f');

    res.send(
      await Promise.all(
        list.manga.map(async (relantionshipManga) => {
            const manga = await Manga.get(relantionshipManga.id);
            const cover = await Cover.get(manga.mainCover.id);

          return {
            id: relantionshipManga.id,
            image: cover.url,
            text: manga.title.en ?? manga.title,
            subText: `${manga.publicationDemographic} - ${manga.status}`,
          };
        })
      )
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new HomeRoute().getRouter();
