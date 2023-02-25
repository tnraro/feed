export interface PageList {
  pages: (Required<Pick<PageContext, "url">> & PageContext)[];
  next?: string;
}

export interface PageDocument {
  id: string;
  game: string;
  category: string;
  url: string;
  title: string;
  time: string;
  summary?: string;
  content: string;
}

export type PageContext = Partial<PageDocument>;

export type ListParserPlugin = [RegExp, (text: string, baseurl: string) => PageList]

export type PageParserPlugin = [RegExp, (text: string, baseurl: string) => PageContext]

export type Source = { entrypoint: string } & PageContext;