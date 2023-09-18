
export interface ParamsType {
    sId: string,
    chapterSlug ?:string,
    mangaSlug ?:string,
}

export interface SearchParamsType {
    id?:string,
    page?:string,
    search?:string,
    filter?:string,
    type?:string
}
export type SourceSelector = {
    api: string;
    search:string;
    pagination:string;
    home: SelectorHome[];
    selector: {
      home: {
        item: string;
        title: string;
        image: string;
        'image-src': string;
        latest: string;
      };
      category: {
        item: string;
        title: string;
        image: string;
        'image-src': string;
        latest: string;
      };
      filter: {};
      info: {
        title: string;
        other: string;
        description: string;
        image: string;
        'image-src': string;
      };
      episode: {
        item: string;
        slug: string;
      };
      watch: {
        type: string;
      };
    };
  };

  export type SelectorHome = {
    title: string;
    selector: string;
    slug: string;
  }